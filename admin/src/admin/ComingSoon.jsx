// client/src/admin/ComingSoon.jsx
// Placeholder "shell" for pages whose backend endpoints don't exist yet.
export default function ComingSoon({ title, note = 'This section is waiting on a backend update.' }) {
  return (
    <div className="admin-page">
      <h1>{title}</h1>
      <section className="card">
        <p className="muted">{note}</p>
      </section>
    </div>
  );
}
