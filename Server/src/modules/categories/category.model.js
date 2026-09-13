// Category Model
// - Fields: name, description, image, isActive, slug
// - slug used for SEO-friendly URLs
// - isActive used to disable categories without deleting them

import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            minlength: 2,
            maxlength: 100,
        },
        slug: {
            type: String,
            lowercase: true,
            unique: true,
            index: true,
        },
        description: {
            type: String,
            trim: true,
            maxlength: 1000,
            default: "",
        },
        image: {
            type: String,
            trim: true,
            default: "",
        },
        isActive: {
            type: Boolean,
            default: true,
            index: true,
        },
    },
    { timestamps: true }
);

// Pre-save middleware to generate slug if not provided, or auto-generate from name
categorySchema.pre("save", function (next) {
    if (this.isModified("name")) {
        this.slug = this.name.toLowerCase().split(" ").join("-");
    }
    next();
});

const Category = mongoose.model("Category", categorySchema);

export default Category;
