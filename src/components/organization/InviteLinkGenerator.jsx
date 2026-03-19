import { useState } from 'react';
import { FiLink, FiCopy, FiSend, FiRefreshCw } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { generateInviteLink } from '../../services/api';

export default function InviteLinkGenerator() {
  const [inviteLink, setInviteLink] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    try {
      setLoading(true);
      const res = await generateInviteLink();
      setInviteLink(res.inviteLink || res.token || '');
      toast.success('Invite link generated');
    } catch (error) {
      const message = error?.response?.data?.message || 'Failed to generate link';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!inviteLink) return;
    await navigator.clipboard.writeText(inviteLink);
    toast.success('Invite link copied');
  };

  const share = () => {
    if (!inviteLink) return;
    if (navigator.share) {
      navigator.share({ title: 'LifeLink Invite', text: 'Join our organization', url: inviteLink });
    } else {
      toast('Sharing not supported on this device');
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-[#f43f5e] to-[#fb7185] text-white flex items-center justify-center shadow">
          <FiLink className="h-6 w-6" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Invite Volunteers</h2>
          <p className="text-sm text-slate-500">Generate and share a secure invite link.</p>
        </div>
      </div>

      <div className="flex gap-2">
        <button
          type="button"
          onClick={handleGenerate}
          disabled={loading}
          className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg bg-[#f43f5e] text-white font-semibold py-2.5 shadow hover:opacity-95 disabled:opacity-60"
        >
          {loading ? 'Generating...' : 'Generate Invite'}
          <FiRefreshCw className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={share}
          className="px-4 rounded-lg border border-slate-200 text-slate-700 font-semibold hover:bg-slate-50"
        >
          <FiSend className="h-5 w-5" />
        </button>
      </div>

      <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex items-center gap-3">
        <input
          type="text"
          readOnly
          value={inviteLink}
          placeholder="Invite link will appear here"
          className="flex-1 bg-transparent outline-none text-sm text-slate-700"
        />
        <button
          type="button"
          onClick={handleCopy}
          disabled={!inviteLink}
          className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 disabled:opacity-50"
        >
          <FiCopy className="h-4 w-4" />
          Copy
        </button>
      </div>
    </div>
  );
}
