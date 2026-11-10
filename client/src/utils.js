export const kes = (n) => `KSh ${Number(n).toLocaleString('en-KE')}`;
export const fmtDate = (d) => new Date(d).toLocaleString('en-KE', { dateStyle: 'medium', timeStyle: 'short' });
export const fmtShort = (d) => new Date(d).toLocaleDateString('en-KE', { day: 'numeric', month: 'short' });
export const minPrice = (ticketTypes = []) => (ticketTypes.length ? Math.min(...ticketTypes.map((t) => Number(t.price))) : null);
export const isEmail = (s) => /^\S+@\S+\.\S+$/.test(s);