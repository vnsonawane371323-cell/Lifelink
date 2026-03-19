import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

const markerIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

export default function DonorMarker({ donor }) {
  const position = [donor.lat, donor.lng];

  const requestBlood = () => {
    // Placeholder action hook for future request flow integration.
    window.alert(`Blood request initiated for ${donor.name}`);
  };

  return (
    <Marker position={position} icon={markerIcon}>
      <Popup>
        <div className="min-w-[180px]">
          <h3 className="text-sm font-semibold text-slate-800">{donor.name}</h3>
          <p className="text-xs text-slate-600 mt-1">Blood Group: {donor.bloodGroup}</p>
          <p className="text-xs text-slate-600">City: {donor.city || '-'}</p>
          <p className="text-xs text-slate-600">Phone: {donor.phone || '-'}</p>
          <button
            type="button"
            onClick={requestBlood}
            className="mt-3 rounded-lg bg-[#FF6B6B] px-3 py-1.5 text-xs font-semibold text-white hover:opacity-95"
          >
            Request Blood
          </button>
        </div>
      </Popup>
    </Marker>
  );
}
