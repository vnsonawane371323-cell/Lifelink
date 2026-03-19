const User = require('../models/User');
const Donor = require('../models/Donor');
const Hospital = require('../models/Hospital');
const Society = require('../models/Society');
const { donorDataset, hospitalDataset, societyDataset } = require('../data/maharashtraDatasets');

const ensureStructuredDatasets = async () => {
  // Cleanup donor docs with malformed GeoJSON before any findAndModify/upsert work.
  const donorsWithLocation = await Donor.find({ location: { $exists: true } })
    .select('_id location')
    .lean();

  const invalidLocationDonorIds = donorsWithLocation
    .filter((donor) => {
      const coordinates = donor.location?.coordinates;
      return (
        donor.location?.type !== 'Point' ||
        !Array.isArray(coordinates) ||
        coordinates.length < 2 ||
        !Number.isFinite(coordinates[0]) ||
        !Number.isFinite(coordinates[1])
      );
    })
    .map((donor) => donor._id);

  if (invalidLocationDonorIds.length > 0) {
    await Donor.updateMany(
      { _id: { $in: invalidLocationDonorIds } },
      { $unset: { location: 1 } }
    );
  }

  // Seed donors by creating/updating paired users first.
  for (const donor of donorDataset) {
    const user = await User.findOneAndUpdate(
      { email: donor.email.toLowerCase() },
      {
        name: donor.name,
        email: donor.email.toLowerCase(),
        role: 'donor',
      },
      {
        new: true,
        upsert: true,
        setDefaultsOnInsert: true,
      }
    ).select('+password');

    // Ensure password exists for newly upserted users.
    if (!user.password) {
      user.password = 'secret123';
      await user.save();
    }

    await Donor.findOneAndUpdate(
      { userId: user._id },
      {
        userId: user._id,
        bloodGroup: donor.bloodGroup,
        phone: donor.phone,
        age: donor.age,
        gender: donor.gender,
        city: donor.city,
        state: donor.state,
        isAvailable: true,
      },
      {
        upsert: true,
        setDefaultsOnInsert: true,
      }
    );
  }

  for (const hospital of hospitalDataset) {
    await Hospital.findOneAndUpdate(
      { name: hospital.name, city: hospital.city },
      hospital,
      { upsert: true, setDefaultsOnInsert: true }
    );
  }

  for (const society of societyDataset) {
    await Society.findOneAndUpdate(
      { name: society.name, city: society.city },
      society,
      { upsert: true, setDefaultsOnInsert: true }
    );
  }
};

module.exports = { ensureStructuredDatasets };