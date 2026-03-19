const BloodRequest = require('../models/BloodRequest');
const Organization = require('../models/Organization');
const { sendEmail } = require('../services/emailService');

const createBloodRequest = async (req, res) => {
  try {
    const {
      patientName,
      bloodGroup,
      hospital,
      city,
      contactNumber,
      urgencyLevel,
      organizationId,
    } = req.body;

    const requiredFields = [
      { key: 'patientName', value: patientName },
      { key: 'bloodGroup', value: bloodGroup },
      { key: 'hospital', value: hospital },
      { key: 'city', value: city },
      { key: 'contactNumber', value: contactNumber },
      { key: 'urgencyLevel', value: urgencyLevel },
      { key: 'organizationId', value: organizationId },
    ];

    const missing = requiredFields.filter((field) => !field.value);
    if (missing.length) {
      return res.status(400).json({
        success: false,
        message: `Missing required fields: ${missing.map((f) => f.key).join(', ')}`,
      });
    }

    const allowedUrgencyLevels = ['Normal', 'Urgent', 'Critical'];
    if (!allowedUrgencyLevels.includes(urgencyLevel)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid urgencyLevel. Allowed values: Normal, Urgent, Critical',
      });
    }

    const organization = await Organization.findById(organizationId).select('email headName name');
    if (!organization) {
      return res.status(404).json({
        success: false,
        message: 'Organization not found',
      });
    }

    const bloodRequest = new BloodRequest({
      patientName: patientName.trim(),
      bloodGroup: bloodGroup.trim(),
      hospital: hospital.trim(),
      city: city.trim(),
      contactNumber: contactNumber.trim(),
      urgencyLevel,
      organizationId,
      requestedBy: req.user?._id,
      status: 'Open',
    });

    await bloodRequest.save();

    const subject = '🚨 Emergency Blood Request Alert';
    const text = `A new blood request has been created.

Patient: ${patientName}
Blood Group: ${bloodGroup}
Hospital: ${hospital}
City: ${city}
Contact Number: ${contactNumber}
Urgency: ${urgencyLevel}

Please take immediate action.`;

    const html = `
      <p>A new blood request has been created.</p>
      <ul>
        <li><strong>Patient:</strong> ${patientName}</li>
        <li><strong>Blood Group:</strong> ${bloodGroup}</li>
        <li><strong>Hospital:</strong> ${hospital}</li>
        <li><strong>City:</strong> ${city}</li>
        <li><strong>Contact Number:</strong> ${contactNumber}</li>
        <li><strong>Urgency:</strong> ${urgencyLevel}</li>
      </ul>
      <p>Please take immediate action.</p>
    `;

    const emailResult = await sendEmail(organization.email, subject, text, html);
    if (!emailResult?.success) {
      console.error('Blood request email failed:', emailResult?.message);
      return res.status(502).json({
        success: false,
        message: 'Blood request created but failed to send email alert',
        data: bloodRequest,
      });
    }

    return res.status(201).json({
      success: true,
      message: 'Blood request created and email alert sent',
      data: bloodRequest,
    });
  } catch (error) {
    console.error('Error creating blood request:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Server error while creating blood request',
    });
  }
};

module.exports = {
  createBloodRequest,
};
