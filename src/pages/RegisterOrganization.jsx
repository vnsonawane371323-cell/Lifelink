import { useState } from 'react';
import { Link } from 'react-router-dom';
import { registerOrganization } from '../services/organizationService';

const initialForm = {
  name: '',
  city: '',
  address: '',
  contactNumber: '',
  email: '',
  password: '',
  headName: '',
};

const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export default function RegisterOrganization() {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);
  const [inviteLink, setInviteLink] = useState('');
  const [copied, setCopied] = useState(false);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const nextErrors = {};

    if (!form.name.trim()) nextErrors.name = 'Organization name is required.';
    if (!form.city.trim()) nextErrors.city = 'City is required.';
    if (!form.contactNumber.trim()) nextErrors.contactNumber = 'Contact number is required.';

    if (!form.email.trim()) {
      nextErrors.email = 'Email is required.';
    } else if (!isValidEmail(form.email.trim())) {
      nextErrors.email = 'Enter a valid email address.';
    }

    if (!form.password) {
      nextErrors.password = 'Password is required.';
    } else if (form.password.length < 6) {
      nextErrors.password = 'Password must be at least 6 characters.';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setServerError('');
    setInviteLink('');
    setCopied(false);

    if (!validate()) return;

    try {
      setLoading(true);
      const payload = {
        name: form.name.trim(),
        city: form.city.trim(),
        address: form.address.trim(),
        contactNumber: form.contactNumber.trim(),
        email: form.email.trim(),
        password: form.password,
        headName: form.headName.trim(),
      };

      const result = await registerOrganization(payload);
      setInviteLink(result.inviteLink || '');
    } catch (error) {
      const message = error?.response?.data?.message || 'Registration failed. Please try again.';
      setServerError(message);
    } finally {
      setLoading(false);
    }
  };

  const copyInvite = async () => {
    if (!inviteLink) return;
    try {
      await navigator.clipboard.writeText(inviteLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (_err) {
      setCopied(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F7FB] px-4 py-10 flex items-center justify-center">
      <div className="w-full max-w-3xl bg-white border border-slate-100 rounded-2xl shadow-sm p-8">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Register Organization</h1>
            <p className="text-sm text-slate-500 mt-1">Create your LifeLink organization account and share the invite link with staff.</p>
          </div>
          <Link to="/login" className="text-sm text-[#FF6B6B] font-semibold hover:underline">
            Back to Login
          </Link>
        </div>

        <div className="grid md:grid-cols-5 gap-8">
          <form onSubmit={onSubmit} className="md:col-span-3 space-y-4" noValidate>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Organization Name</label>
                <input
                  name="name"
                  value={form.name}
                  onChange={onChange}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-[#FF6B6B] focus:ring-2 focus:ring-[#FF6B6B]/20"
                  placeholder="City Blood Center"
                />
                {errors.name ? <p className="mt-1 text-xs text-red-600">{errors.name}</p> : null}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">City</label>
                <input
                  name="city"
                  value={form.city}
                  onChange={onChange}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-[#FF6B6B] focus:ring-2 focus:ring-[#FF6B6B]/20"
                  placeholder="Mumbai"
                />
                {errors.city ? <p className="mt-1 text-xs text-red-600">{errors.city}</p> : null}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Address</label>
              <input
                name="address"
                value={form.address}
                onChange={onChange}
                className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-[#FF6B6B] focus:ring-2 focus:ring-[#FF6B6B]/20"
                placeholder="Full address"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Contact Number</label>
                <input
                  name="contactNumber"
                  value={form.contactNumber}
                  onChange={onChange}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-[#FF6B6B] focus:ring-2 focus:ring-[#FF6B6B]/20"
                  placeholder="9876543210"
                />
                {errors.contactNumber ? <p className="mt-1 text-xs text-red-600">{errors.contactNumber}</p> : null}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Head Name</label>
                <input
                  name="headName"
                  value={form.headName}
                  onChange={onChange}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-[#FF6B6B] focus:ring-2 focus:ring-[#FF6B6B]/20"
                  placeholder="Organization head"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={onChange}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-[#FF6B6B] focus:ring-2 focus:ring-[#FF6B6B]/20"
                  placeholder="org@example.com"
                />
                {errors.email ? <p className="mt-1 text-xs text-red-600">{errors.email}</p> : null}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
                <input
                  name="password"
                  type="password"
                  value={form.password}
                  onChange={onChange}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-[#FF6B6B] focus:ring-2 focus:ring-[#FF6B6B]/20"
                  placeholder="Minimum 6 characters"
                />
                {errors.password ? <p className="mt-1 text-xs text-red-600">{errors.password}</p> : null}
              </div>
            </div>

            {serverError ? <p className="text-sm text-red-600">{serverError}</p> : null}

            <button
              type="submit"
              disabled={loading}
              className="w-full md:w-auto px-5 py-2.5 bg-[#FF6B6B] text-white font-semibold rounded-lg shadow-sm hover:opacity-95 disabled:opacity-60"
            >
              {loading ? 'Registering...' : 'Register Organization'}
            </button>
          </form>

          <div className="md:col-span-2 bg-[#0F172A] text-white rounded-2xl p-6 space-y-4">
            <h2 className="text-lg font-semibold">Invite link</h2>
            <p className="text-sm text-slate-200">
              After registration, share the invite link with your staff. They can join the organization dashboard using this link.
            </p>

            {inviteLink ? (
              <div className="space-y-3">
                <div className="bg-white/10 rounded-lg p-3 text-sm break-all">
                  {inviteLink}
                </div>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={copyInvite}
                    className="px-4 py-2 rounded-md bg-white text-[#0F172A] font-semibold hover:bg-slate-100"
                  >
                    {copied ? 'Copied' : 'Copy link'}
                  </button>
                  <a
                    className="px-4 py-2 rounded-md bg-transparent border border-white text-white font-semibold hover:bg-white/10"
                    href={inviteLink}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Open link
                  </a>
                </div>
              </div>
            ) : (
              <div className="bg-white/5 rounded-lg p-4 text-sm text-slate-200">
                Complete the form to generate an invite link for your organization.
              </div>
            )}

            <div className="text-sm text-slate-200 border-t border-white/10 pt-4">
              <p className="font-semibold text-white">What this includes:</p>
              <ul className="list-disc list-inside space-y-1 mt-2">
                <li>Registers the organization and generates a unique invite link.</li>
                <li>Links staff accounts to the organization using the invite link.</li>
                <li>Keeps your emergency alerts routed to the correct organization head.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
