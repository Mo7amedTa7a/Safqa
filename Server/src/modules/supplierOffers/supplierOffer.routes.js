// SupplierOffer Routes
// - Belongs to: Member 3
// - POST / PATCH / DELETE: SUPPLIER only
// - GET: ADMIN or SUPPLIER

const express = require("express");

const router = express.Router();

const { createOffercontrol,updateOffercontrol,withdrawOffercontrol ,getOffersForPoolcontrol} = require("./supplierOffer.controller");

const { createOfferValidation } = require("./supplierOffer.validation");

const protect = require("../auth/auth.middleware");
const apiLimit = require("../middleware/apiLimit");
const validate = require("../middleware/validation.middleware");


router.post("/:id/offers", protect,apiLimit("SUPPLIER"),validate(createOfferValidation),createOffercontrol);

router.patch("/:offerId",protect,apiLimit("SUPPLIER"),validate(createOfferValidation),updateOffercontrol);
router.patch("/:id/withdraw",protect,apiLimit("SUPPLIER"),withdrawOffercontrol);

router.get("/:id/offers",protect,apiLimit("SUPPLIER"),getOffersForPoolcontrol);






module.exports = router;
