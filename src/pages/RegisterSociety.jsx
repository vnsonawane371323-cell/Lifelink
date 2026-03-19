import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { createSociety } from '../services/societyService';

const RegisterSociety = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '',
    registrationId: '',
    city: '',
    contactEmail: user?.email || '',
    contactPhone: '',
    lat: '',
    lng: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.name.trim() || !form.city.trim()) {
      setError('Society name and city are required.');
      return;
    }

    setLoading(true);
    try {
      await createSociety({
        name: form.name.trim(),
        registrationId: form.registrationId.trim(),
        city: form.city.trim(),
        contactEmail: form.contactEmail.trim(),
        contactPhone: form.contactPhone.trim(),
        headUserId: user.uid,
        geoLocation: {
          lat: parseFloat(form.lat) || 0,
          lng: parseFloat(form.lng) || 0,
        },
      });
      navigate('/society');
    } catch (err) {
      setError(err.message || 'Failed to register society.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-backgroundLight flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Register Your Society</h1>
          <p className="text-sm text-gray-500 mt-1">
            Submit your blood donation society for admin verification.
          </p>
        </div>

        {/* Card */}
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-lg border border-gray-200 shadow-sm p-8 space-y-5"
        >
          {error && (
            <div className="bg-red-50 border border-red-200 text-medicalRed text-sm rounded-md px-4 py-3">
              {error}
            </div>
          )}

          {/* Society Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Society Name <span className="text-medicalRed">*</span>
            </label>
            <input
              id="name"
              name="name"
              type="text"
              value={form.name}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-hospitalBlue focus:border-hospitalBlue"
              placeholder="e.g. City Blood Bank Society"
            />
          </div>

          {/* Registration ID */}
          <div>
            <label htmlFor="registrationId" className="block text-sm font-medium text-gray-700 mb-1">
              Registration / License ID
            </label>
            <input
              id="registrationId"
              name="registrationId"
              type="text"
              value={form.registrationId}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-hospitalBlue focus:border-hospitalBlue"
              placeholder="Official registration number"
            />
          </div>

          {/* City */}
          <div>
            <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
              City <span className="text-medicalRed">*</span>
            </label>
            <input
              id="city"
              name="city"
              type="text"
              value={form.city}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-hospitalBlue focus:border-hospitalBlue"
              placeholder="e.g. Mumbai"
            />
          </div>

          {/* Contact Email */}
          <div>
            <label htmlFor="contactEmail" className="block text-sm font-medium text-gray-700 mb-1">
              Contact Email
            </label>
            <input
              id="contactEmail"
              name="contactEmail"
              type="email"
              value={form.contactEmail}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-hospitalBlue focus:border-hospitalBlue"
            />
          </div>

          {/* Contact Phone */}
          <div>
            <label htmlFor="contactPhone" className="block text-sm font-medium text-gray-700 mb-1">
              Contact Phone
            </label>
            <input
              id="contactPhone"
              name="contactPhone"
              type="tel"
              value={form.contactPhone}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-hospitalBlue focus:border-hospitalBlue"
              placeholder="+91 98765 43210"
            />
          </div>

          {/* Geo Location */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="lat" className="block text-sm font-medium text-gray-700 mb-1">
                Latitude
              </label>
              <input
                id="lat"
                name="lat"
                type="text"
                value={form.lat}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-hospitalBlue focus:border-hospitalBlue"
                placeholder="19.0760"
              />
            </div>
            <div>
              <label htmlFor="lng" className="block text-sm font-medium text-gray-700 mb-1">
                Longitude
              </label>
              <input
                id="lng"
                name="lng"
                type="text"
                value={form.lng}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-hospitalBlue focus:border-hospitalBlue"
                placeholder="72.8777"
              />
            </div>
          </div>

          {/* Upload Document (mock) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Verification Document
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-md px-4 py-6 text-center">
              <svg className="mx-auto h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
              </svg>
              <p className="mt-2 text-xs text-gray-500">
                Upload your society registration certificate (PDF or image).
              </p>
              <p className="text-xs text-gray-400 mt-1">Document upload will be available soon.</p>
            </div>
          </div>

          {/* Info banner */}
          <div className="bg-blue-50 border border-blue-200 rounded-md px-4 py-3">
            <p className="text-xs text-hospitalBlue">
              After registration, your society will be reviewed by an admin. You can access your
              dashboard while verification is in progress, but some actions will remain disabled
              until approved.
            </p>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-hospitalBlue text-white py-2.5 rounded-md text-sm font-medium hover:bg-hospitalBlueDark transition-colors disabled:opacity-60"
          >
            {loading ? 'Registering…' : 'Register Society'}
          </button>

          <p className="text-center text-sm text-gray-500">
            Already registered?{' '}
            <Link to="/society" className="text-hospitalBlue font-medium hover:underline">
              Go to Dashboard
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default RegisterSociety;
