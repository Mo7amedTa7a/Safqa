const {
    getDeals,
    getDealById,
    updateDealStatus
} = require('./deal.service');

const getDealsController = async (req, res) => {
  try {
    const deals = await getDeals();

    return res.status(200).json(deals);
  } catch (err) {
    return res.status(500).json({
      msg: err.message
    });
  }
};

const getDealByIdController = async (req, res) => {
  try {
    const deal = await getDealById(req.params.id);

    return res.status(200).json(deal);
  } catch (error) {
    return res.status(404).json({
      msg: error.message
    });
  }
};

const updateDealStatusController = async (req, res) => {
  try {
    const deal = await updateDealStatus(
      req.params.id,
      req.body.status
    );

    return res.status(200).json(deal);
  } catch (error) {
    return res.status(400).json({
      msg: error.message
    });
  }
};

module.exports = {
    getDealsController,
    getDealByIdController,
    updateDealStatusController
}