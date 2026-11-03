require('dotenv').config();
const { sequelize, User, Event, TicketType, Order, Payment, Ticket } = require('./models');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const seedSales = async () => {
  try {
    await sequelize.authenticate();
    console.log('Connected to DB. Generating fake sales data...');

    // 1. Create 5 dummy users
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash('User123!', salt);

    const usersData = [
      { full_name: 'Brian Kamau', email: 'brian@gmail.com', phone_number: '254711000001' },
      { full_name: 'Mercy Wanjiku', email: 'mercy@gmail.com', phone_number: '254711000002' },
      { full_name: 'David Ochieng', email: 'david@gmail.com', phone_number: '254711000003' },
      { full_name: 'Sarah Njeri', email: 'sarah@gmail.com', phone_number: '254711000004' },
      { full_name: 'Kevin Mutua', email: 'kevin@gmail.com', phone_number: '254711000005' }
    ];

    const users = [];
    for (const u of usersData) {
      const [user] = await User.findOrCreate({
        where: { email: u.email },
        defaults: { ...u, password_hash, role: 'user' }
      });
      users.push(user);
    }
    console.log('✅ 5 dummy users ready (Password: User123!)');

    // 2. Get all ticket types
    const ticketTypes = await TicketType.findAll();
    if (ticketTypes.length === 0) {
      console.log('❌ No ticket types found. Run seed.js first.');
      process.exit(1);
    }

    // 3. Generate 50 random orders
    let paidCount = 0;
    let pendingCount = 0;

    for (let i = 0; i < 50; i++) {
      // Pick a random user, ticket type, and quantity (1 to 3)
      const user = users[Math.floor(Math.random() * users.length)];
      const ticketType = ticketTypes[Math.floor(Math.random() * ticketTypes.length)];
      const quantity = Math.floor(Math.random() * 3) + 1;
      const totalAmount = parseFloat(ticketType.price) * quantity;
      
      // 80% chance the order is paid, 20% chance pending
      const isPaid = Math.random() < 0.8; 
      const status = isPaid ? 'paid' : 'pending';

      // Create Order
      const order = await Order.create({
        user_id: user.user_id,
        ticket_type_id: ticketType.ticket_type_id,
        quantity,
        total_amount: totalAmount,
        status
      });

      // Create Payment
      await Payment.create({
        order_id: order.order_id,
        phone_number: user.phone_number,
        amount: totalAmount,
        checkout_request_id: `ws_CO_${crypto.randomBytes(8).toString('hex')}`,
        mpesa_receipt: isPaid ? `MOCK${crypto.randomBytes(3).toString('hex').toUpperCase()}` : null,
        status: isPaid ? 'success' : 'pending',
        paid_at: isPaid ? new Date() : null
      });

      // If paid, create the tickets
      if (isPaid) {
        const ticketsData = [];
        for (let j = 0; j < quantity; j++) {
          const refCode = `TKT-${crypto.randomBytes(3).toString('hex').toUpperCase()}`;
          const qrCode = await require('qrcode').toDataURL(refCode);
          ticketsData.push({
            order_id: order.order_id,
            reference_code: refCode,
            qr_code: qrCode,
            status: 'valid'
          });
        }
        await Ticket.bulkCreate(ticketsData);
        paidCount++;
      } else {
        pendingCount++;
      }
    }

    console.log(`🎉 Successfully generated 50 orders! (${paidCount} paid, ${pendingCount} pending)`);
    console.log('Your Admin Dashboard should now look amazing.');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
};

seedSales();