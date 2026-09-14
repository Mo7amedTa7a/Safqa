# Safqa — Frontend Guide
> Angular 19 · SSR · CSS · Feature-Based Architecture

---

## اسم الـ Pattern ده إيه؟

الـ structure ده اسمه **Feature-Based Architecture** (أو **Domain-Driven Folder Structure**).

ده من أشهر الـ patterns في Angular وبيُستخدم في **كل المشاريع الكبيرة تقريباً** لأنه:
- كل member يشتغل في الـ folder بتاعه من غير ما يعدي على حد تاني
- سهل تلاقي أي ملف لأنه مرتب حسب الـ domain (مش حسب النوع)
- سهل تـ scale المشروع وتضيف features جديدة
- هو نفس الـ pattern اللي Angular documentation بتنصح بيه رسمياً

---

## هيكل المشروع الكامل

```
Client/
├── angular.json              <- إعدادات الـ Angular CLI
├── tsconfig.json             <- إعدادات الـ TypeScript
├── package.json              <- الـ dependencies
└── src/
    ├── main.ts               <- Entry point (Client)
    ├── main.server.ts        <- Entry point (SSR Server)
    ├── server.ts             <- Express server للـ SSR
    ├── index.html            <- الصفحة الرئيسية
    ├── styles.css            <- Global CSS للمشروع كله
    ├── environments/
    │   ├── environment.ts        <- Development (apiUrl local)
    │   └── environment.prod.ts   <- Production
    └── app/
        ├── app.component.ts      <- Root component
        ├── app.config.ts         <- App providers (HTTP, Router, SSR)
        ├── app.config.server.ts  <- SSR-specific providers
        ├── app.routes.ts         <- كل الـ routes
        ├── core/             <- Member 1
        ├── shared/           <- الكل
        ├── layout/           <- Member 1
        └── features/         <- كل member عنده folder خاص
```

---

## شرح كل folder

### core/ — Member 1 فقط
الأساسيات اللي الـ app كله بيعتمد عليها. محدش يعدل فيها غير Member 1.

```
core/
├── interceptors/
│   ├── auth.interceptor.ts       <- بيضيف JWT token على كل request تلقائياً
│   └── error.interceptor.ts      <- بيتعامل مع أخطاء HTTP (401, 403, 500...)
├── guards/
│   ├── auth.guard.ts             <- يحمي الـ routes المحتاجة login
│   ├── role.guard.ts             <- يحمي حسب الـ role (ADMIN, SUPPLIER...)
│   └── supplier.guard.ts         <- يتحقق إن الـ Supplier ACTIVE
├── services/
│   ├── auth.service.ts           <- login, logout, register, token management
│   ├── user.service.ts           <- بيانات المستخدمين
│   └── supplier-profile.service.ts
└── models/
    ├── user.model.ts
    ├── supplier-profile.model.ts
    └── api-response.model.ts     <- شكل الـ API response الموحد
```

---

### shared/ — الكل يضيف فيه لو محتاج
Components وPipes وDirectives بتتكرر في أكتر من feature.
قبل ما تضيف هنا، تأكد إن الحاجة دي بتتستخدم في أكتر من مكان.

```
shared/
├── components/
│   ├── loading/                  <- Loading spinner
│   ├── error-state/              <- رسالة خطأ مع زرار retry
│   ├── empty-state/              <- مفيش بيانات
│   ├── confirmation-dialog/      <- Popup تأكيد (حذف, إلغاء...)
│   ├── status-badge/             <- Badge ملوّن حسب الـ status
│   └── pagination/               <- Pagination للقوائم
├── pipes/
│   ├── status-label.pipe.ts      <- 'PENDING_REVIEW' -> 'Pending Review'
│   └── currency-format.pipe.ts   <- 1500 -> '1,500.00 EGP'
└── directives/
    └── role-based.directive.ts   <- يخفي/يظهر عناصر HTML حسب الـ role
```

---

### layout/ — Member 1

```
layout/
├── public-layout/    <- للصفحات العامة (Login, Register) — بدون Sidebar
├── auth-layout/      <- للـ Dashboard — فيه Sidebar + Navbar
├── navbar/           <- الشريط العلوي (اسم المستخدم، role، logout)
└── sidebar/          <- القائمة الجانبية (links تتغير حسب الـ role)
```

---

### features/ — كل member عنده domain خاص بيه

| Folder | Owner | الـ Screens |
|--------|-------|-------------|
| auth/ | Member 1 | Login, Register, Forgot/Reset Password |
| users/ | Member 1 | My Profile, Edit Profile, Change Password |
| supplier-onboarding/ | Member 1 | Complete Profile, Pending, Rejected |
| admin/ | Member 1 | Users Management, Suppliers Management |
| products/ | Member 2 | Product List, Details, Management |
| buying-requests/ | Member 2 | Create, My Requests, Details, Edit |
| buying-pools/ | Member 3 | Pool List, Details, Join Pool |
| supplier-offers/ | Member 3 | Available Pools, Create/Edit/My Offers |
| deals/ | Member 4 | Deal List, Details |
| orders/ | Member 4 | Order List, Details |
| shipments/ | Member 5 | Shipment List, Details, Tracking |
| payments/ | Member 5 | COD, Payment Details |
| settlements/ | Member 5 | Settlement List, Details |
| disputes/ | Member 5 | Dispute List, Create, Details |
| returns/ | Member 5 | Return List, Details |
| refunds/ | Member 5 | Refund List |
| reviews/ | Member 5 | Review List, Create |
| notifications/ | Member 5 | Notification Center |

---

### شكل كل feature folder من جوا

```
buying-requests/
├── create-request/
│   ├── create-request.component.ts    <- الـ logic
│   ├── create-request.component.html  <- الـ template
│   └── create-request.component.css   <- الـ styles
├── my-requests/
│   ├── my-requests.component.ts
│   ├── my-requests.component.html
│   └── my-requests.component.css
├── services/
│   └── buying-request.service.ts      <- التواصل مع الـ API
└── models/
    └── buying-request.model.ts        <- TypeScript Interface
```

---

## قواعد مهمة للتيم

### 1. كل واحد يشتغل في الـ domain بتاعه بس
```
غلط: Member 2 يعدل في core/ أو features/deals/
صح:  Member 2 يشتغل في features/products/ و features/buying-requests/
```

### 2. الـ API URL من environment بس — لا hardcoding
```typescript
// صح
import { environment } from '../../../environments/environment';
const url = environment.apiUrl + '/buying-requests';

// غلط
const url = 'http://localhost:5000/api/buying-requests';
```

### 3. الـ HTTP requests في الـ Service بس، مش في الـ Component
```typescript
// صح — component بيكلم service
this.buyingRequestService.getMyRequests().subscribe(...)

// غلط — component بيكلم HttpClient مباشرة
this.http.get('/api/buying-requests').subscribe(...)
```

### 4. الـ JWT بيتضاف تلقائي
مش محتاج تضيف Authorization header بنفسك.
auth.interceptor.ts بيعمل ده تلقائي على كل request.

### 5. متغيرش حاجة في domain حد تاني بدون coordination
لو محتاج interface من Member تاني، اتكلمه وخليه يضيف اللي محتاجه.

---

## لتشغيل المشروع

```bash
# Development server
ng serve

# Production build
ng build

# SSR server
npm run serve:ssr:safqa
```

---

## ترتيب الـ Dependencies بين الـ Members

```
Member 1 (Foundation)
    |
    v
Member 2 (Products + Requests)
    |
    v
Member 3 (Pools + Offers)
    |
    v
Member 4 (Deals + Orders)
    |
    v
Member 5 (Fulfillment + Financial)
```

كل member ما يبدأش يتكامل مع الـ API
إلا بعد ما الـ member اللي قبله خلص الجزء اللي بيعتمد عليه.
