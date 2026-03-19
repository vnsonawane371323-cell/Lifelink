import { FiUsers, FiActivity, FiAlertTriangle, FiMapPin } from 'react-icons/fi';
import InviteLinkGenerator from '../../components/organization/InviteLinkGenerator';
import CreateBloodRequest from '../../components/organization/CreateBloodRequest';
import NearbyDonors from '../../components/organization/NearbyDonors';

const cards = [
  { title: 'Total Volunteers', count: 42, icon: FiUsers, color: 'from-[#f43f5e] to-[#fb7185]' },
  { title: 'Active Donors', count: 128, icon: FiActivity, color: 'from-[#14b8a6] to-[#22d3ee]' },
  { title: 'Active Blood Requests', count: 6, icon: FiAlertTriangle, color: 'from-[#f59e0b] to-[#f97316]' },
  { title: 'Nearby Donors', count: 18, icon: FiMapPin, color: 'from-[#6366f1] to-[#8b5cf6]' },
];

export default function Dashboard() {
  return (
    <div className="space-y-8">
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <div
            key={card.title}
            className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 flex items-center gap-4"
          >
            <div className={`h-12 w-12 rounded-xl bg-gradient-to-br ${card.color} text-white flex items-center justify-center shadow`}> 
              <card.icon className="h-6 w-6" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-slate-500">{card.title}</p>
              <p className="text-2xl font-bold text-slate-900">{card.count}</p>
            </div>
            <button className="text-sm font-semibold text-[#f43f5e] hover:underline">View</button>
          </div>
        ))}
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <CreateBloodRequest />
        </div>
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <InviteLinkGenerator />
        </div>
      </section>

      <section className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
        <NearbyDonors />
      </section>
    </div>
  );
}
