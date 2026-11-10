// Help facilities: FAQ accordion (Bootstrap collapse).
import { Link } from 'react-router-dom';

const faqs = [
  ['How do I book tickets?', <>Open <Link to="/events">Browse Events</Link>, choose an event, set the quantity for Regular and/or VIP, then press <strong>Continue to Booking</strong>. You will be asked to log in or register if you haven't already.</>],
  ['How does M-Pesa payment work?', <>On the payment screen enter your Safaricom number and press <strong>Send STK Push</strong>. A prompt appears on your phone; enter your M-Pesa PIN. This page updates automatically once the payment is confirmed.</>],
  ['My payment failed or timed out. What now?', <>Check <Link to="/my-tickets">My Tickets</Link> for the latest status before trying again. If money left your account but the status has not updated, contact support before making another payment.</>],
  ['Where are my tickets?', <>Under <Link to="/my-tickets">My Tickets</Link>. Each seat has its own reference code and QR code. Show the QR code at the entrance.</>],
  ['Why did I get two payment prompts?', 'Each ticket type (Regular, VIP) is booked and paid separately. Buying both means two M-Pesa prompts, one after the other.'],
  ['I started a payment but did not finish. What now?', <>Open <Link to="/my-tickets">My Tickets</Link> to check whether the order is still pending, paid, or failed. You can start a new order from the event page if needed.</>],
  ['I forgot my password.', <>Use <Link to="/forgot-password">Forgot password</Link>. We email a time-limited link that lets you set a new password.</>],
  ['Can I change my profile details?', <>Your account details are visible under <Link to="/profile">My Profile</Link>. Editing them is not available through the current backend API.</>],
];

export default function Help() {
  return (
    <div className="mx-auto" style={{ maxWidth: 780 }}>
      <h2 className="mb-1">Help &amp; FAQ</h2>
      <p className="text-muted mb-4">Quick answers about booking, paying and using your tickets.</p>
      <div className="accordion" id="faq">
        {faqs.map(([q, a], i) => (
          <div className="accordion-item" key={q}>
            <h2 className="accordion-header">
              <button className={`accordion-button${i ? ' collapsed' : ''}`} type="button" data-bs-toggle="collapse" data-bs-target={`#faq${i}`}>{q}</button>
            </h2>
            <div id={`faq${i}`} className={`accordion-collapse collapse${i ? '' : ' show'}`} data-bs-parent="#faq">
              <div className="accordion-body">{a}</div>
            </div>
          </div>
        ))}
      </div>
      <p className="mt-4 text-muted small">Still stuck? Contact the EventGo support team.</p>
    </div>
  );
}
