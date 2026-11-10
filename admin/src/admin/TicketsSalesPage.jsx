import { useEffect, useMemo, useState } from 'react';
import { fetchOrders } from './api';

const formatMoney = (amount) =>
  new Intl.NumberFormat('en-KE', {
    style: 'currency',
    currency: 'KES',
  }).format(Number(amount || 0));

const formatDate = (date) =>
  date
    ? new Date(date).toLocaleString('en-KE', {
        dateStyle: 'medium',
        timeStyle: 'short',
      })
    : '—';

export default function TicketsSalesPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');

  async function loadOrders() {
    setLoading(true);
    setError('');

    try {
      const data = await fetchOrders();
      setOrders(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || 'Unable to load orders.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadOrders();
  }, []);

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const customer = order.User?.full_name || '';
      const event = order.TicketType?.Event?.title || '';
      const orderId = String(order.order_id);

      const matchesSearch = [customer, event, orderId]
        .some((value) =>
          value.toLowerCase().includes(search.toLowerCase())
        );

      const matchesStatus =
        status === 'all' || order.status === status;

      return matchesSearch && matchesStatus;
    });
  }, [orders, search, status]);

  const paidOrders = orders.filter(
    (order) => order.status === 'paid'
  );

  const totalRevenue = paidOrders.reduce(
    (sum, order) => sum + Number(order.total_amount || 0),
    0
  );

  const ticketsSold = paidOrders.reduce(
    (sum, order) => sum + Number(order.quantity || 0),
    0
  );

  const getBadgeClass = (value) => {
    const classes = {
      paid: 'sales-badge sales-badge--paid',
      pending: 'sales-badge sales-badge--pending',
      failed: 'sales-badge sales-badge--failed',
      cancelled: 'sales-badge sales-badge--cancelled',
    };

    return classes[value] || 'sales-badge';
  };

  return (
    <div className="admin-page">
      <div className="page-head">
        <div>
          <h1>Tickets & Sales</h1>
          <p className="muted">
            Monitor customer orders, ticket sales and payments.
          </p>
        </div>

        <button onClick={loadOrders} disabled={loading}>
          {loading ? 'Refreshing...' : 'Refresh orders'}
        </button>
      </div>

      <section className="stats">
        <div className="card stat">
          <span className="muted">Total Orders</span>
          <strong>{orders.length}</strong>
        </div>

        <div className="card stat">
          <span className="muted">Tickets Sold</span>
          <strong>{ticketsSold}</strong>
        </div>

        <div className="card stat">
          <span className="muted">Total Revenue</span>
          <strong>{formatMoney(totalRevenue)}</strong>
        </div>

        <div className="card stat">
          <span className="muted">Paid Orders</span>
          <strong>{paidOrders.length}</strong>
        </div>
      </section>

      <section className="card">
        <h2>Order Management</h2>

        <div className="sales-filters">
          <input
            type="search"
            placeholder="Search customer, event or order ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="all">All statuses</option>
            <option value="paid">Paid</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        {error && (
          <div className="alert alert--error" role="alert">
            {error}
          </div>
        )}

        {loading && <p className="muted">Loading orders...</p>}

        {!loading && !error && filteredOrders.length === 0 && (
          <p className="muted">No orders found.</p>
        )}

        {!loading && !error && filteredOrders.length > 0 && (
          <div className="sales-table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Event</th>
                  <th>Ticket Type</th>
                  <th>Quantity</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>M-Pesa Receipt</th>
                  <th>Date</th>
                </tr>
              </thead>

              <tbody>
                {filteredOrders.map((order) => (
                  <tr key={order.order_id}>
                    <td>#{order.order_id}</td>

                    <td>
                      <strong>
                        {order.User?.full_name || 'Unknown'}
                      </strong>
                      <small>{order.User?.email || '—'}</small>
                    </td>

                    <td>
                      {order.TicketType?.Event?.title || 'Unknown'}
                    </td>

                    <td>
                      {order.TicketType?.name || 'Unknown'}
                    </td>

                    <td>{order.quantity}</td>

                    <td>{formatMoney(order.total_amount)}</td>

                    <td>
                      <span className={getBadgeClass(order.status)}>
                        {order.status}
                      </span>
                    </td>

                    <td>
                      {order.Payments?.find(
                        (payment) => payment.status === 'success'
                      )?.mpesa_receipt || '—'}
                    </td>

                    <td>{formatDate(order.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}