export default function StatCard({ icon, title, value }) {
  return (
    <div className="bg-white rounded-2xl shadow-md p-5 flex items-center gap-4">
      <div className="h-11 w-11 rounded-xl bg-[#FF6B6B]/10 text-[#FF6B6B] flex items-center justify-center text-xl">
        {icon}
      </div>
      <div>
        <p className="text-sm text-slate-500">{title}</p>
        <p className="text-2xl font-bold text-slate-800">{value}</p>
      </div>
    </div>
  );
}
