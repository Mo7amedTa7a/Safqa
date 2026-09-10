import AppError from "../utils/AppError.js";

// ============================================================
// Validation Middleware
// ============================================================
// الـ middleware ده بياخد schema (القواعد) ويطبقها على الـ request
// لو في خطأ → يرجع رسالة خطأ 400
// لو كل حاجة صح → يكمل للـ controller
// ============================================================

// source = "body"   → بيتحقق من البيانات اللي الـ user بعتها في الـ request body
// source = "params" → بيتحقق من الـ id اللي في الـ URL زي /users/:id
// source = "query"  → بيتحقق من الـ filters زي /products?page=1&limit=10

const validate = (schema, source = "body") => {

    // بنرجع function عادية هي اللي Express بيشغلها كـ middleware
    return (req, res, next) => {

        // هنا بناخد البيانات من الـ request ونعملها validate بالـ schema
        const { error, value } = schema.validate(req[source], {
            abortEarly: false,  // مش هنوقف عند أول خطأ، هنجمع كل الأخطاء
            stripUnknown: true, // لو الـ user بعت fields مش موجودة في الـ schema، هنشيلها
        });

        // لو فيه أخطاء في البيانات
        if (error) {
            // بنجمع كل رسائل الأخطاء في string واحدة مفصولة بـ comma
            const errorMessage = error.details
                .map((err) => err.message)
                .join(", ");

            // بنبعت الخطأ لـ global error handler بـ status 400 Bad Request
            return next(new AppError(errorMessage, 400));
        }

        // لو كل البيانات صح → نحط البيانات المنظفة بدل القديمة
        // (Joi ممكن يعدل قيم زي trimming النصوص أو تحويل النوع)
        req[source] = value;

        // كمل للـ controller
        next();
    };
};

export default validate;
