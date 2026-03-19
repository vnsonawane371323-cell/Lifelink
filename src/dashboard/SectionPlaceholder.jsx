import BaseLayout from '../layouts/BaseLayout';

export default function SectionPlaceholder({ title }) {
  return (
    <BaseLayout>
      <div className="rounded-2xl bg-white shadow-md p-8">
        <h1 className="text-2xl font-bold text-[#FF6B6B]">{title}</h1>
        <p className="mt-2 text-slate-600">This section is ready for module integration.</p>
      </div>
    </BaseLayout>
  );
}
