# Member 2 integrated mapping

This patch adapts the Member 2 ZIP to the existing Client/src/app structure.

## Replace existing scaffold files
- features/products/models/product.model.ts
- features/products/services/product.service.ts
- features/products/product-list/*
- features/products/product-details/*
- features/products/category-list/*
- features/products/product-management/*
- features/buying-requests/models/buying-request.model.ts
- features/buying-requests/services/buying-request.service.ts
- features/buying-requests/my-requests/*
- features/buying-requests/create-request/*
- features/buying-requests/request-details/*
- features/buying-requests/edit-request/*

## Add new file
- features/products/product-card.component.ts
- features/member2.routes.ts

## Do not replace
- core/*
- shared/*
- layout/*
- features/auth/*
- features/users/*
- features/admin/*
- features/supplier-onboarding/*
- features/buying-pools/*
- features/supplier-offers/*
- features/deals/*
- features/orders/*
- features/shipments/*
- features/payments/*
- features/settlements/*
- features/disputes/*
- features/returns/*
- features/refunds/*
- features/reviews/*
- features/notifications/*

## app.routes.ts
Do not replace the whole file. Add:
import { MEMBER2_ROUTES } from './features/member2.routes';

and merge `...MEMBER2_ROUTES` into the existing routes array with the other members' routes.
