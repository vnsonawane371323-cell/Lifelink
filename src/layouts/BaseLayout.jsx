import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';

export default function BaseLayout({ children }) {
  return (
    <div className="min-h-screen bg-[#F9F9FB]">
      <Sidebar />
      <main className="md:ml-64 px-4 md:px-6 py-6">
        <Navbar />
        <div className="mt-6">{children}</div>
      </main>
    </div>
  );
}
