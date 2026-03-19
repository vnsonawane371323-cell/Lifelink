import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

const LEVEL_COLORS = {
  High:   '#EF4444',
  Medium: '#F59E0B',
  Low:    '#10B981',
};

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  const { requestCount, level } = payload[0].payload;
  return (
    <div className="rounded-xl bg-white shadow-lg border border-slate-100 p-3 text-sm">
      <p className="font-bold text-slate-800">{label}</p>
      <p className="text-slate-600">{requestCount} request{requestCount !== 1 ? 's' : ''}</p>
      <p style={{ color: LEVEL_COLORS[level] }} className="font-semibold mt-0.5">
        {level} Demand
      </p>
    </div>
  );
};

export default function PredictionChart({ data = [] }) {
  return (
    <section className="rounded-2xl bg-white shadow-md p-6">
      <h2 className="text-lg font-semibold text-slate-800">Predicted Demand by Blood Group</h2>
      <p className="text-sm text-slate-500 mt-0.5">Based on request volume over the last 30 days</p>
      <div className="mt-5 h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 4, right: 16, left: 0, bottom: 4 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="bloodGroup" tick={{ fontSize: 13, fontWeight: 600 }} axisLine={false} tickLine={false} />
            <YAxis allowDecimals={false} tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f1f5f9' }} />
            <Bar dataKey="requestCount" radius={[6, 6, 0, 0]}>
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={LEVEL_COLORS[entry.level] ?? '#FF6B6B'}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="mt-4 flex flex-wrap gap-4 justify-center">
        {Object.entries(LEVEL_COLORS).map(([level, color]) => (
          <div key={level} className="flex items-center gap-1.5 text-sm text-slate-600">
            <span className="h-3 w-3 rounded-full" style={{ backgroundColor: color }} />
            {level} Demand
          </div>
        ))}
      </div>
    </section>
  );
}
