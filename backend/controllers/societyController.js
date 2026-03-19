const Society = require('../models/Society');

const getSocietiesByCity = async (req, res) => {
  try {
    const { city } = req.params;
    const societies = await Society.find({ city: new RegExp(`^${city}$`, 'i') })
      .select('name city contactPerson phone createdAt')
      .sort({ name: 1 });

    return res.status(200).json({
      success: true,
      data: societies,
      count: societies.length,
    });
  } catch (_error) {
    return res.status(500).json({
      success: false,
      message: 'Server error while retrieving societies by city',
    });
  }
};

module.exports = { getSocietiesByCity };