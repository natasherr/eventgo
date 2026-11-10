import { useEffect, useState } from 'react';
import { Link, Navigate, useLocation } from 'react-router-dom';
import api, { errMsg } from '../api';
import { useAuth } from '../context/AuthContext';
import { kes } from '../utils';

const POLL_MS = 3000;
const MAX_POLLS = 40;

const normalizePhone = (value) => {
  const digits = value.replace(/\D/g, '');
  if (digits.startsWith('254')) return digits;
  if (digits.startsWith('0')) return `254${digits.slice(1)}`;
  return `254${digits}`;
};

const readOrderHistory = (key) => {
  try {
    const history = JSON.parse(localStorage.getItem(key) || '[]');
    return Array.isArray(history) ? history : [];
  } catch { return []; }
};

const responseStatus = (data) => String(
  data?.status ?? data?.paymentStatus ?? data?.payment_status ?? data?.order?.status ?? data?.data?.status ?? '',
).toLowerCase();

export default function Payment() {
  const { state } = useLocation();
  const { user } = useAuth();
  const event = state?.event;
  const items = state?.items;
  const [idx, setIdx] = useState(0);
  const [phase, setPhase] = useState('form');
  const [phone, setPhone] = useState(user?.phone_number || '');
  const [orderId, setOrderId] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const item = items?.[idx];
  const historyKey = `eventgo_orders_${user?.id ?? 'guest'}`;
  const grandTotal = items?.reduce((sum, line) => sum + Number(line.price) * line.quantity, 0) ?? 0;

  useEffect(() => {
    if (phase !== 'waiting' || !orderId) return undefined;
    let active = true;
    let attempts = 0;
    let timer;

    const checkStatus = async () => {
      attempts += 1;
      try {
        const { data } = await api.get(`/payments/status/${orderId}`);
        const status = responseStatus(data);
        if (['paid', 'success', 'successful', 'completed'].includes(status)) {
          clearInterval(timer);
          if (!active) return;
          if (idx + 1 < items.length) {
            setIdx((current) => current + 1);
            setOrderId('');
            setPhase('form');
          } else setPhase('done');
          return;
        }
        if (['failed', 'cancelled', 'canceled', 'expired'].includes(status)) {
          clearInterval(timer);
          if (active) setPhase('failed');
          return;
        }
      } catch {
        // A brief network error or a sleeping Render instance should not stop polling.
      }
      if (attempts >= MAX_POLLS) {
        clearInterval(timer);
        if (active) setPhase('timeout');
      }
    };

    timer = setInterval(checkStatus, POLL_MS);
    checkStatus();
    return () => { active = false; clearInterval(timer); };
  }, [phase, orderId, idx, items?.length]);

  if (!items?.length || !event) return <Navigate to="/events" replace />;

  const saveOrder = (id) => {
    const history = readOrderHistory(historyKey).filter((saved) => String(saved.orderId) !== String(id));
    history.unshift({
      orderId: id,
      event,
      item,
      savedAt: new Date().toISOString(),
    });
    localStorage.setItem(historyKey, JSON.stringify(history.slice(0, 30)));
  };

  const sendPush = async () => {
    setError('');
    const phoneNumber = normalizePhone(phone.trim());
    if (!/^254[17]\d{8}$/.test(phoneNumber)) return setError('Enter a valid Kenyan mobile number, e.g. 0712345678.');
    setBusy(true);
    try {
      const { data } = await api.post('/payments/stkpush', {
        ticketTypeId: item.ticketTypeId,
        quantity: item.quantity,
        phoneNumber,
      });
      const createdOrderId = data.orderId ?? data.order_id ?? data.order?.order_id;
      if (!createdOrderId) throw new Error('The payment service did not return an order ID. Please contact support before retrying.');
      setOrderId(String(createdOrderId));
      saveOrder(String(createdOrderId));
      setPhase('waiting');
    } catch (e) { setError(e.response ? errMsg(e) : (e.message || errMsg(e))); }
    finally { setBusy(false); }
  };

  if (phase === 'done') {
    return (
      <div className="mx-auto card card-body text-center" style={{ maxWidth: 480 }}>
        <i className="fa-solid fa-circle-check text-success display-4 mb-3" />
        <h3>Payment confirmed</h3>
        <p className="text-muted">Your tickets are ready. You can view them in My Tickets.</p>
        <Link to="/my-tickets" className="btn btn-eg">View My Tickets</Link>
      </div>
    );
  }

  return (
    <div className="mx-auto card card-body" style={{ maxWidth: 480 }}>
      <h3 className="mb-1">M-Pesa checkout</h3>
      <p className="small text-muted">{event.title} · Payment {idx + 1} of {items.length}</p>
      <div className="rounded p-3 mb-3" style={{ background: '#f5f3ee' }}>
        <div className="fw-semibold">{item.ticketName} × {item.quantity}</div>
        <div className="small text-muted">Order total: {kes(grandTotal)}</div>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {phase === 'form' && (
        <>
          <label className="form-label" htmlFor="payment-phone">M-Pesa phone number</label>
          <input id="payment-phone" className="form-control mb-3" placeholder="0712345678" value={phone} onChange={(e) => setPhone(e.target.value)} inputMode="tel" autoComplete="tel" />
          <p className="small text-muted">An STK prompt will be sent to this phone. Confirm the amount and enter your M-Pesa PIN on your phone.</p>
          <button className="btn btn-eg w-100 mb-2" onClick={sendPush} disabled={busy}>{busy ? 'Sending request…' : 'Send M-Pesa prompt'}</button>
          <Link className="btn btn-outline-secondary w-100" to={`/events/${event.event_id}`}>Back to event</Link>
        </>
      )}

      {phase === 'waiting' && (
        <div className="text-center">
          <div className="spinner-border text-success mb-3" />
          <p className="mb-1">Waiting for payment confirmation…</p>
          <p className="small text-muted">Approve the prompt on your phone. This page checks the order status every few seconds.</p>
          <p className="small text-muted">Order #{orderId}</p>
        </div>
      )}

      {phase === 'failed' && (
        <div className="text-center">
          <i className="fa-solid fa-circle-xmark text-danger display-5 mb-2" />
          <p>The payment was not completed. You can try again with the same or another number.</p>
          <button className="btn btn-eg me-2" onClick={() => { setError(''); setPhase('form'); }}>Try again</button>
          <Link className="btn btn-outline-secondary" to="/events">Back to events</Link>
        </div>
      )}

      {phase === 'timeout' && (
        <div className="text-center">
          <p>We have not received a result yet. Your order is saved, so check its status again before starting another payment.</p>
          <button className="btn btn-eg me-2" onClick={() => setPhase('waiting')}>Check status again</button>
          <Link className="btn btn-outline-secondary" to="/my-tickets">View My Tickets</Link>
        </div>
      )}
    </div>
  );
}
