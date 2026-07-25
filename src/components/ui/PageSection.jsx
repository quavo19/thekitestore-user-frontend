export function PageSection({ title, description, children }) {
  return (
    <section className="space-y-2">
      <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
      {description && <p className="text-gray-600">{description}</p>}
      {children}
    </section>
  );
}
