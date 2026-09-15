// SupplierOffer Controller
// - Belongs to: Member 3
//
// POST   /:id/offers      → createOffer (SUPPLIER)
// PATCH  /:offerId       → updateOffer (SUPPLIER - owner)
// PATCH  /:id/withdraw   → withdrawOffer (SUPPLIER - owner)
// GET    /:id/offers     → getOffersForPool (SUPPLIER)
// GET    /my             → getMyOffers (SUPPLIER)
// GET    /:id            → getOfferById (SUPPLIER)


import {
  createOffer,
  updateOffer,
  withdrawOffer,
  getOffersForPool,
  getMyOffers,
  getOfferById
} from "./supplierOffer.service.js";



const createOffercontrol = async (req, res, next) => {

  try {

    const { id } = req.params;

    const supplierId = req.user.id;

    const data = req.body;

    const offer = await createOffer(
      id,
      supplierId,
      data
    );

    res.status(201).json({
      success: true,
      data: offer
    });

  } catch (err) {

    next(err);

  }

};



const updateOffercontrol = async (req, res, next) => {

  try {

    const { offerId } = req.params;

    const supplierId = req.user.id;

    const data = req.body;

    const offer = await updateOffer(
      offerId,
      supplierId,
      data
    );

    res.status(200).json({
      success: true,
      data: offer
    });

  } catch (err) {

    next(err);

  }

};



const withdrawOffercontrol = async (req, res, next) => {

  try {

    const { id } = req.params;

    const supplierId = req.user.id;

    const offer = await withdrawOffer(
      id,
      supplierId
    );

    res.status(200).json({
      success: true,
      data: offer
    });

  } catch (err) {

    next(err);

  }

};



const getOffersForPoolcontrol = async (req, res, next) => {

  try {

    const { id } = req.params;

    const offers = await getOffersForPool(id);

    res.status(200).json({
      success: true,
      data: offers
    });

  } catch (err) {

    next(err);

  }

};


const getMyOfferscontrol = async (req, res, next) => {

  try {

    const supplierId = req.user.id;

    const offers = await getMyOffers(supplierId);

    res.status(200).json({
      success: true,
      data: offers
    });

  } catch (err) {

    next(err);

  }

};



const getOfferByIdcontrol = async (req, res, next) => {

  try {

    const { id } = req.params;

    const offer = await getOfferById(id);

    res.status(200).json({
      success: true,
      data: offer
    });

  } catch (err) {

    next(err);

  }

};



export {
  createOffercontrol,
  updateOffercontrol,
  withdrawOffercontrol,
  getOffersForPoolcontrol,
  getMyOfferscontrol,
  getOfferByIdcontrol
};