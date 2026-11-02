require('dotenv').config();
const bcrypt = require('bcryptjs');
const { sequelize, User, Event, TicketType } = require('./models');

const seedDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log('Connected to DB. Seeding data...');

    // 1. Create Admin User (if it doesn't already exist)
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash('Admin123!', salt);

    const [admin, adminCreated] = await User.findOrCreate({
      where: { email: 'admin@eventgo.com' },
      defaults: {
        full_name: 'System Admin',
        phone_number: '254700000000',
        password_hash: password_hash,
        role: 'admin'
      }
    });
    console.log('✅ Admin User ready: admin@eventgo.com | Password: Admin123!');

    // 2. Fetch all the events you just inserted via SQL
    const events = await Event.findAll();
    
    if (events.length === 0) {
      console.log('⚠️ No events found in DB. Please run the SQL script to add events first.');
      process.exit(0);
    }

    let ticketsCreated = 0;

    // 3. Loop through each event and add tickets if they don't exist
    for (const event of events) {
      // Check if this event already has ticket types
      const existingTickets = await TicketType.count({ where: { event_id: event.event_id } });
      
      if (existingTickets === 0) {
        await TicketType.bulkCreate([
          { event_id: event.event_id, name: 'Regular', price: 1500, quantity_total: 200 },
          { event_id: event.event_id, name: 'VIP', price: 5000, quantity_total: 50 }
        ]);
        ticketsCreated += 2;
      }
    }

    if (ticketsCreated > 0) {
      console.log(`🎟️ Created ${ticketsCreated} ticket types across all events.`);
    } else {
      console.log('✅ All events already have ticket types.');
    }

    console.log('🎉 Seeding complete!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
};

seedDatabase();