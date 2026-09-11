const {
  getDeals,
  getDealById,
  updateDealStatus,
  createDealFromPool,
} = require('./deal.service');

const getDealsController = async (req, res) => {
  try {
    const deals = await getDeals();
    return res.status(200).json({
      success: true,
      data: deals,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const getDealByIdController = async (req, res) => {
  try {
    const deal = await getDealById(req.params.id);
    return res.status(200).json({
      success: true,
      data: deal,
    });
  } catch (error) {
    return res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

const updateDealStatusController = async (req, res) => {
  try {
    const deal = await updateDealStatus(req.params.id, req.body.status);
    return res.status(200).json({
      success: true,
      data: deal,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const selectOfferController = async (req, res) => {
  try {
    const { poolId } = req.params;
    const result = await createDealFromPool(poolId);
    return res.status(201).json({
      success: true,
      data: result,
      message: 'Deal created successfully',
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getDealsController,
  getDealByIdController,
  updateDealStatusController,
  selectOfferController,
};