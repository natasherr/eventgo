require('dotenv').config();
const bcrypt = require('bcryptjs');
const { sequelize, User, Category, Event, TicketType } = require('./models');

const seedDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log('Connected to DB. Seeding data...');

    // 1. Create Admin User
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
    console.log('Admin User ready: admin@eventgo.com | Password: Admin123!');

    // 2. Create Categories
    const [musicCat] = await Category.findOrCreate({ where: { name: 'Music' }, defaults: { description: 'Concerts and gigs' } });
    const [techCat] = await Category.findOrCreate({ where: { name: 'Technology' }, defaults: { description: 'Tech conferences' } });

    // 3. Create an Event
    const [event, eventCreated] = await Event.findOrCreate({
      where: { title: 'Nairobi Tech Summit' },
      defaults: {
        category_id: techCat.category_id,
        created_by: admin.user_id,
        description: 'The biggest tech event of the year.',
        venue: 'KICC, Nairobi',
        event_date: new Date('2026-12-15T09:00:00'),
        status: 'published'
      }
    });

    // 4. Create Ticket Types for the Event
    if (eventCreated) {
      await TicketType.bulkCreate([
        { event_id: event.event_id, name: 'Regular', price: 2000, quantity_total: 100 },
        { event_id: event.event_id, name: 'VIP', price: 5000, quantity_total: 20 }
      ]);
      console.log('Created sample event with Regular and VIP tickets.');
    }

    console.log('Seeding complete!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
};

seedDatabase();