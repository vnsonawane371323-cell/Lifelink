import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

const labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const data = {
  labels,
  datasets: [
    {
      label: 'Blood Requests per Day',
      data: [10, 14, 9, 18, 16, 12, 20],
      borderColor: '#FF6B6B',
      backgroundColor: 'rgba(255, 107, 107, 0.18)',
      fill: true,
      tension: 0.35,
      pointRadius: 4,
      pointHoverRadius: 5,
    },
  ],
};

const options = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: true,
      position: 'top',
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        stepSize: 5,
      },
      grid: {
        color: '#e2e8f0',
      },
    },
    x: {
      grid: {
        display: false,
      },
    },
  },
};

export default function BloodChart() {
  return (
    <section className="rounded-2xl bg-white shadow-md p-6">
      <h2 className="text-lg font-semibold text-slate-800">Blood Requests per Day</h2>
      <div className="mt-4 h-72">
        <Line data={data} options={options} />
      </div>
    </section>
  );
}
