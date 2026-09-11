// SupplierOffer Controller
// - Belongs to: Member 3
// - POST   /             → createOffer (SUPPLIER)
// - PATCH  /:id          → updateOffer (SUPPLIER - owner)
// - DELETE /:id/withdraw → withdrawOffer (SUPPLIER - owner)
// - GET    /pool/:poolId → getOffersForPool (ADMIN | SUPPLIER)

const { createOffer,updateOffer,withdrawOffer,getOffersForPool } = require("./supplierOffer.service");

const createOffercontrol = async (req, res, next) => {

  try {

    const { id } = req.params;

    const supplierId = req.user.id;

    const data = req.body;

    const offer = await createOffer(id,supplierId,data);

    res.status(201).json({
      success: true,
      data: offer
    });

  } catch (err) {
    next(err);
  }
};


////////////////////


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
////////////////////////////
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
///////////////////////////////////

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


module.exports = {createOffercontrol,updateOffercontrol,withdrawOffercontrol,getOffersForPoolcontrol};



