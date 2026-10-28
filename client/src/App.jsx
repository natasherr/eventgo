import { useEffect, useState } from 'react';

export default function App() {
  const [status, setStatus] = useState('checking...');

  useEffect(() => {
    fetch('/api/health')
      .then((r) => r.json())
      .then((d) => setStatus(d.status))
      .catch(() => setStatus('server unreachable'));
  }, []);

  return <h1>EventGo — API status: {status}</h1>;
}