// ============================================================
//  Prediction Controller — LifeLink
//  Derives AI-style blood demand predictions from historical
//  blood request data (last 30 days).
// ============================================================

const BloodRequest = require('../models/BloodRequest');

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

/**
 * Classify demand level relative to the maximum observed count.
 * Ratios: High >= 60 %, Medium >= 25 %, else Low.
 */
function classifyLevel(count, max) {
  if (max === 0) return 'Low';
  const ratio = count / max;
  if (ratio >= 0.6) return 'High';
  if (ratio >= 0.25) return 'Medium';
  return 'Low';
}

// @desc   Get blood demand predictions based on last 30 days of requests
// @route  GET /api/predictions
// @access Private
const getPredictions = async (req, res) => {
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const aggregate = await BloodRequest.aggregate([
      { $match: { createdAt: { $gte: thirtyDaysAgo } } },
      { $group: { _id: '$bloodGroup', requestCount: { $sum: 1 } } },
    ]);

    // Build count lookup map
    const countMap = {};
    aggregate.forEach(({ _id, requestCount }) => {
      countMap[_id] = requestCount;
    });

    const maxCount = aggregate.length > 0
      ? Math.max(...aggregate.map((a) => a.requestCount))
      : 0;

    const data = BLOOD_GROUPS.map((bg) => {
      const requestCount = countMap[bg] ?? 0;
      return {
        bloodGroup: bg,
        requestCount,
        level: classifyLevel(requestCount, maxCount),
      };
    });

    return res.status(200).json({
      success: true,
      message: 'Blood demand predictions fetched successfully',
      data,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message || 'Server error while generating predictions',
    });
  }
};

module.exports = { getPredictions };
