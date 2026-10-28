// client/src/admin/useEvents.js
// Shared by the Dashboard and the Manage Events page so both read the same data.
import { useCallback, useEffect, useState } from 'react';
import { fetchEvents } from './api';

export function useEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const reload = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      setEvents(await fetchEvents());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  return { events, loading, error, reload };
}

// Real numbers the dashboard CAN show today (derived from GET /api/events).
// Tickets sold and revenue have no endpoint yet, so those stay as placeholders.
export function eventStats(events) {
  const now = Date.now();
  const in30Days = now + 30 * 24 * 60 * 60 * 1000;
  const upcoming = events.filter((e) => {
    const t = new Date(e.event_date).getTime();
    return t >= now && t <= in30Days;
  });
  return { totalEvents: events.length, upcomingCount: upcoming.length };
}

export function formatDate(iso) {
  return new Date(iso).toLocaleDateString('en-KE', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}
