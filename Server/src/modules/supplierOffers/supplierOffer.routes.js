// SupplierOffer Routes
// - Belongs to: Member 3
// - POST / PATCH / DELETE: SUPPLIER only
// - GET: ADMIN or SUPPLIER

import express from "express";
import protect from "../../middlewares/auth.middleware.js";
import { restrictTo } from "../../middlewares/role.middleware.js";
import validate from "../../middlewares/validate.middleware.js";
import { createOffercontrol, updateOffercontrol, withdrawOffercontrol, getOffersForPoolcontrol } from "./supplierOffer.controller.js";
import { createOfferValidation } from "./supplierOffer.validation.js";

const router = express.Router();

router.post("/:id/offers", protect, restrictTo("SUPPLIER"), validate(createOfferValidation), createOffercontrol);
router.patch("/:offerId", protect, restrictTo("SUPPLIER"), validate(createOfferValidation), updateOffercontrol);
router.patch("/:id/withdraw", protect, restrictTo("SUPPLIER"), withdrawOffercontrol);
router.get("/:id/offers", protect, restrictTo("SUPPLIER"), getOffersForPoolcontrol);

export default router;
