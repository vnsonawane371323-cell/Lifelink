import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { joinOrganization } from '../services/api';

export default function JoinOrganization() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();
  const [status, setStatus] = useState('pending');

  useEffect(() => {
    const join = async () => {
      if (!token) {
        setStatus('error');
        toast.error('Invalid invite link');
        return;
      }
      try {
        const res = await joinOrganization(token);
        if (res?.success) {
          setStatus('success');
          toast.success('You have successfully joined the organization');
          setTimeout(() => navigate('/dashboard', { replace: true }), 1500);
        } else {
          setStatus('error');
          toast.error(res?.message || 'Failed to join organization');
        }
      } catch (error) {
        setStatus('error');
        const message = error?.response?.data?.message || 'Failed to join organization';
        toast.error(message);
      }
    };
    join();
  }, [token, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl border border-slate-100 shadow-sm p-6 text-center space-y-4">
        <h1 className="text-2xl font-bold text-slate-900">Join Organization</h1>
        <p className="text-slate-500 text-sm">Verifying your invite token...</p>

        {status === 'success' && (
          <div className="p-4 rounded-xl bg-green-50 text-green-700 text-sm">
            You have successfully joined the organization. Redirecting...
          </div>
        )}

        {status === 'error' && (
          <div className="p-4 rounded-xl bg-red-50 text-red-700 text-sm">
            Invite link invalid or expired.
          </div>
        )}

        <Link to="/login" className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-slate-900 text-white font-semibold hover:bg-slate-800">
          Go to Login
        </Link>
      </div>
    </div>
  );
}
