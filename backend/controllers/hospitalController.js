const Hospital = require('../models/Hospital');

const getHospitalsByCity = async (req, res) => {
  try {
    const { city } = req.params;
    const hospitals = await Hospital.find({ city: new RegExp(`^${city}$`, 'i') })
      .select('name city hasBloodBank phone address createdAt')
      .sort({ name: 1 });

    return res.status(200).json({
      success: true,
      data: hospitals,
      count: hospitals.length,
    });
  } catch (_error) {
    return res.status(500).json({
      success: false,
      message: 'Server error while retrieving hospitals by city',
    });
  }
};

module.exports = { getHospitalsByCity };