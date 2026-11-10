import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api, { errMsg } from '../api';
import { useAuth } from '../context/AuthContext';
import { fmtDate } from '../utils';

const readOrders = (userId) => {
  try {
    const value = JSON.parse(localStorage.getItem(`eventgo_orders_${userId}`) || '[]');
    return Array.isArray(value) ? value : [];
  } catch { return []; }
};

const normalizeStatus = (data) => String(
  data?.status ?? data?.paymentStatus ?? data?.payment_status ?? data?.order?.status ?? data?.data?.status ?? '',
).toLowerCase();

const extractTickets = (data) => data?.tickets ?? data?.Tickets ?? data?.order?.tickets ?? data?.order?.Tickets ?? data?.data?.tickets ?? [];

export default function MyTickets() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    const history = user?.id ? readOrders(user.id) : [];
    if (!history.length) { setOrders([]); setLoading(false); return () => { active = false; }; }

    setLoading(true);
    Promise.all(history.map(async (saved) => {
      try {
        const { data } = await api.get(`/payments/status/${saved.orderId}`);
        const status = normalizeStatus(data);
        const tickets = extractTickets(data);
        return { ...saved, status, tickets: Array.isArray(tickets) ? tickets : [], statusData: data };
      } catch (e) {
        return { ...saved, status: 'unavailable', tickets: [], error: errMsg(e) };
      }
    })).then((result) => {
      if (active) {
        setOrders(result);
        if (result.some((order) => order.status === 'unavailable')) setError('Some order statuses could not be loaded. Try refreshing when the server is available.');
      }
    }).finally(() => { if (active) setLoading(false); });

    return () => { active = false; };
  }, [user?.id]);

  if (loading) return <div className="text-center py-5"><div className="spinner-border text-primary" /></div>;

  const hasTickets = orders.some((order) => ['paid', 'success', 'successful', 'completed'].includes(order.status) && order.tickets.length > 0);

  return (
    <>
      <div className="d-flex flex-wrap justify-content-between align-items-end gap-2 mb-3">
        <div><h2 className="mb-1">My Tickets</h2><p className="text-muted mb-0">Your recent orders and ticket details.</p></div>
        <Link to="/events" className="btn btn-outline-primary btn-sm">Browse events</Link>
      </div>
      {error && <div className="alert alert-warning">{error}</div>}
      {!orders.length && <div className="eg-empty"><i className="fa-solid fa-ticket" /><strong>Your next memory is waiting.</strong><span>Tickets from your orders will appear here.</span><Link to="/events" className="btn btn-eg mt-2">Explore events</Link></div>}

      <div className="d-grid gap-3">
        {orders.map((order) => {
          const paid = ['paid', 'success', 'successful', 'completed'].includes(order.status);
          const failed = ['failed', 'cancelled', 'canceled', 'expired'].includes(order.status);
          return (
            <section className="card" key={order.orderId}>
              <div className="card-body">
                <div className="d-flex flex-wrap justify-content-between align-items-start gap-2 mb-3">
                  <div>
                    <h5 className="mb-1">{order.event?.title || 'Event order'}</h5>
                    <div className="small text-muted">{order.event?.event_date ? fmtDate(order.event.event_date) : order.event?.venue}</div>
                    <div className="small text-muted">{order.item?.ticketName} × {order.item?.quantity} · Order #{order.orderId}</div>
                  </div>
                  <span className={`badge ${paid ? 'bg-success' : failed ? 'bg-danger' : 'bg-warning text-dark'}`}>
                    {paid ? 'Paid' : failed ? 'Payment failed' : order.status === 'unavailable' ? 'Status unavailable' : 'Payment pending'}
                  </span>
                </div>
                {paid && order.tickets.length > 0 ? (
                  <div className="row g-3">
                    {order.tickets.map((ticket, index) => (
                      <div className="col-12 col-md-6" key={ticket.ticket_id ?? ticket.reference_code ?? `${order.orderId}-${index}`}>
                        <div className="eg-ticket card h-100"><div className="card-body d-flex justify-content-between align-items-center gap-3">
                          <div>
                            <strong>{order.item?.ticketName || 'Ticket'}</strong>
                            <div className="small text-muted">{order.event?.venue}</div>
                            <span className={`badge mt-2 ${ticket.status === 'valid' ? 'bg-success' : 'bg-secondary'}`}>{ticket.status || 'issued'}</span>
                            {ticket.reference_code && <div className="small mt-2">Reference: <strong>{ticket.reference_code}</strong></div>}
                          </div>
                          {ticket.qr_code && <img className="eg-qr" src={ticket.qr_code} alt={`Ticket QR code ${ticket.reference_code || ''}`} />}
                        </div></div>
                      </div>
                    ))}
                  </div>
                ) : paid ? <p className="small text-muted mb-0">Payment is confirmed. Ticket details will appear when the order status includes them.</p>
                  : !failed && <p className="small text-muted mb-0">If you approved the M-Pesa prompt, refresh to check for confirmation.</p>}
              </div>
            </section>
          );
        })}
      </div>
      {orders.length > 0 && !hasTickets && <p className="small text-muted mt-3">Your order list is saved on this device. You may need this browser to see orders you started here.</p>}
      {orders.length > 0 && hasTickets && <p className="small text-muted mt-3">Order history on this device is saved locally so you can find the associated tickets.</p>}
    </>
  );
}
