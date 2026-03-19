import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import DonorMarker from './DonorMarker';
import 'leaflet/dist/leaflet.css';

const userIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

function RecenterMap({ center }) {
  const map = useMap();
  map.setView(center, map.getZoom());
  return null;
}

export default function MapView({ center, donors }) {
  return (
    <div className="rounded-2xl bg-white shadow-md p-3 md:p-4">
      <div className="h-[60vh] min-h-[420px] overflow-hidden rounded-2xl">
        <MapContainer center={center} zoom={11} className="h-full w-full" scrollWheelZoom>
          <RecenterMap center={center} />
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <Marker position={center} icon={userIcon}>
            <Popup>Your current location</Popup>
          </Marker>

          {donors.map((donor) => (
            <DonorMarker key={donor._id} donor={donor} />
          ))}
        </MapContainer>
      </div>
    </div>
  );
}
