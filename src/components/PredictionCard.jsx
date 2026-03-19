import { FaTint } from 'react-icons/fa';

const LEVEL_CONFIG = {
  High:   { cardBg: 'bg-red-50',    text: 'text-red-700',    badge: 'bg-red-500 text-white',    dot: 'bg-red-500' },
  Medium: { cardBg: 'bg-yellow-50', text: 'text-yellow-700', badge: 'bg-yellow-400 text-white', dot: 'bg-yellow-400' },
  Low:    { cardBg: 'bg-green-50',  text: 'text-green-700',  badge: 'bg-emerald-500 text-white', dot: 'bg-emerald-500' },
};

export default function PredictionCard({ bloodGroup, requestCount, level }) {
  const config = LEVEL_CONFIG[level] ?? LEVEL_CONFIG.Low;

  return (
    <div className={`${config.cardBg} rounded-2xl shadow-md p-5 flex flex-col gap-3`}>
      {/* Header row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FaTint className={`${config.text} h-4 w-4`} />
          <span className="text-xl font-extrabold text-slate-800">{bloodGroup}</span>
        </div>
        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${config.badge}`}>
          {level}
        </span>
      </div>

      {/* Demand level row */}
      <div className="flex items-center gap-2">
        <span className={`h-2 w-2 rounded-full ${config.dot}`} />
        <span className={`text-sm font-medium ${config.text}`}>
          {level} Demand
        </span>
      </div>

      {/* Count */}
      <p className="text-xs text-slate-500">
        {requestCount} request{requestCount !== 1 ? 's' : ''} in last 30 days
      </p>
    </div>
  );
}
