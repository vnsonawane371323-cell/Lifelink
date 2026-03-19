import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const COLORS = ['#FF6B6B', '#FF8A8A', '#FFB2B2', '#FFD6D6', '#FF9F68', '#FFC15A', '#8ED1FC', '#66C2A5'];

export default function BloodGroupChart({ data = [] }) {
  return (
    <section className="rounded-2xl bg-white shadow-md p-6">
      <h2 className="text-lg font-semibold text-slate-800">Blood Group Distribution</h2>
      <div className="mt-4 h-80">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={110}
              label
            >
              {data.map((entry, index) => (
                <Cell key={`${entry.name}-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
