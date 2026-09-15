// SupplierOffer Routes
// - Belongs to: Member 3
// - POST / PATCH / DELETE: SUPPLIER only
// - GET: ADMIN or SUPPLIER

import express from "express";
import protect from "../../middlewares/auth.middleware.js";
import authorize from "../../middlewares/role.middleware.js";
import validate from "../../middlewares/validate.middleware.js";
import { createOffercontrol, updateOffercontrol, withdrawOffercontrol, getOffersForPoolcontrol,getOfferByIdcontrol, getMyOfferscontrol} from "./supplierOffer.controller.js";
import { createOfferValidation } from "./supplierOffer.validation.js";

const router = express.Router();

router.post("/:id/offers", protect, authorize("SUPPLIER"), validate(createOfferValidation), createOffercontrol);
router.patch("/:offerId", protect, authorize("SUPPLIER"), validate(createOfferValidation), updateOffercontrol);
router.patch("/:id/withdraw", protect, authorize("SUPPLIER"), withdrawOffercontrol);
router.get("/:id/offers", protect, authorize("SUPPLIER"), getOffersForPoolcontrol);

router.get(
  "/my",
  protect,
  authorize("SUPPLIER"),
  getMyOfferscontrol
);


router.get(
  "/:id",
  protect,
  authorize("SUPPLIER"),
  getOfferByIdcontrol
);

export default router;
