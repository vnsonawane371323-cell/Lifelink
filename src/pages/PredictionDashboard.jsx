import { useEffect, useState } from 'react';
import { FaBrain } from 'react-icons/fa';
import BaseLayout from '../layouts/BaseLayout';
import PredictionCard from '../components/PredictionCard';
import PredictionChart from '../components/PredictionChart';
import api from '../services/api';

export default function PredictionDashboard() {
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPredictions = async () => {
      try {
        setLoading(true);
        setError('');
        const res = await api.get('/api/predictions');
        setPredictions(res?.data?.data || []);
      } catch (err) {
        setError(err?.response?.data?.message || 'Failed to load prediction data.');
      } finally {
        setLoading(false);
      }
    };

    fetchPredictions();
  }, []);

  const highCount   = predictions.filter((p) => p.level === 'High').length;
  const mediumCount = predictions.filter((p) => p.level === 'Medium').length;
  const lowCount    = predictions.filter((p) => p.level === 'Low').length;

  return (
    <BaseLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-start gap-4">
          <div className="h-12 w-12 rounded-2xl bg-[#FF6B6B]/10 text-[#FF6B6B] flex items-center justify-center text-xl flex-shrink-0">
            <FaBrain />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-[#FF6B6B]">Blood Demand Predictions</h1>
            <p className="mt-1 text-slate-600">
              AI-powered forecast based on blood request patterns over the last 30 days.
            </p>
          </div>
        </div>

        {/* Error banner */}
        {error && (
          <div className="rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 shadow-sm p-4">
            {error}
          </div>
        )}

        {loading ? (
          <div className="rounded-2xl bg-white shadow-md p-8 text-center text-slate-500">
            Analyzing blood request data...
          </div>
        ) : (
          <>
            {/* Summary strip */}
            {predictions.length > 0 && (
              <div className="grid grid-cols-3 gap-4">
                <div className="rounded-2xl bg-red-50 shadow-md p-4 text-center">
                  <p className="text-2xl font-extrabold text-red-600">{highCount}</p>
                  <p className="text-sm text-red-500 font-medium mt-0.5">High Demand</p>
                </div>
                <div className="rounded-2xl bg-yellow-50 shadow-md p-4 text-center">
                  <p className="text-2xl font-extrabold text-yellow-600">{mediumCount}</p>
                  <p className="text-sm text-yellow-500 font-medium mt-0.5">Medium Demand</p>
                </div>
                <div className="rounded-2xl bg-green-50 shadow-md p-4 text-center">
                  <p className="text-2xl font-extrabold text-emerald-600">{lowCount}</p>
                  <p className="text-sm text-emerald-500 font-medium mt-0.5">Low Demand</p>
                </div>
              </div>
            )}

            {/* Prediction cards grid */}
            {predictions.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {predictions.map((p) => (
                  <PredictionCard
                    key={p.bloodGroup}
                    bloodGroup={p.bloodGroup}
                    requestCount={p.requestCount}
                    level={p.level}
                  />
                ))}
              </div>
            ) : (
              <div className="rounded-2xl bg-white shadow-md p-8 text-center text-slate-500">
                No prediction data available yet.
              </div>
            )}

            {/* Chart */}
            {predictions.length > 0 && <PredictionChart data={predictions} />}
          </>
        )}
      </div>
    </BaseLayout>
  );
}
