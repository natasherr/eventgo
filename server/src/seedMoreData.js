require('dotenv').config();
const { sequelize, User, Event, TicketType, Category } = require('./models');
const bcrypt = require('bcryptjs');

const seedMoreData = async () => {
  try {
    await sequelize.authenticate();
    console.log('Connected to DB. Adding more events and users...');

    // 1. Create more generic African users
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash('User123!', salt);

    const newUsers = [
      { full_name: 'Amina Odhiambo', email: 'amina.odhiambo@gmail.com', phone_number: '254720100001' },
      { full_name: 'Brian Onyango', email: 'brian.onyango@gmail.com', phone_number: '254720100002' },
      { full_name: 'Cynthia Wambui', email: 'cynthia.wambui@gmail.com', phone_number: '254720100003' },
      { full_name: 'David Kiprop', email: 'david.kiprop@gmail.com', phone_number: '254720100004' },
      { full_name: 'Esther Achieng', email: 'esther.achieng@gmail.com', phone_number: '254720100005' },
      { full_name: 'Faisal Mohamed', email: 'faisal.mohamed@gmail.com', phone_number: '254720100006' },
      { full_name: 'Grace Muthoni', email: 'grace.muthoni@gmail.com', phone_number: '254720100007' },
      { full_name: 'Hassan Abdi', email: 'hassan.abdi@gmail.com', phone_number: '254720100008' },
      { full_name: 'Irene Chebet', email: 'irene.chebet@gmail.com', phone_number: '254720100009' },
      { full_name: 'James Omondi', email: 'james.omondi@gmail.com', phone_number: '254720100010' },
      { full_name: 'Khadija Ali', email: 'khadija.ali@gmail.com', phone_number: '254720100011' },
      { full_name: 'Lilian Atieno', email: 'lilian.atieno@gmail.com', phone_number: '254720100012' },
      { full_name: 'Martin Kariuki', email: 'martin.kariuki@gmail.com', phone_number: '254720100013' },
      { full_name: 'Nancy Wairimu', email: 'nancy.wairimu@gmail.com', phone_number: '254720100014' },
      { full_name: 'Oscar Mwangi', email: 'oscar.mwangi@gmail.com', phone_number: '254720100015' },
      { full_name: 'Purity Nyambura', email: 'purity.nyambura@gmail.com', phone_number: '254720100016' },
      { full_name: 'Quinter Akinyi', email: 'quinter.akinyi@gmail.com', phone_number: '254720100017' },
      { full_name: 'Robert Wafula', email: 'robert.wafula@gmail.com', phone_number: '254720100018' },
      { full_name: 'Sylvia Nasimiyu', email: 'sylvia.nasimiyu@gmail.com', phone_number: '254720100019' },
      { full_name: 'Timothy Kilonzo', email: 'timothy.kilonzo@gmail.com', phone_number: '254720100020' }
    ];

    for (const u of newUsers) {
      await User.findOrCreate({
        where: { email: u.email },
        defaults: { ...u, password_hash, role: 'user' }
      });
    }
    console.log('✅ 20 new users created.');

    // 2. Fetch existing categories
    const categories = await Category.findAll();
    const catMap = {};
    categories.forEach(c => catMap[c.name] = c.category_id);

    // 3. New Events (using real venues and dates from research)
    const newEvents = [
      // Tech
      { title: 'Africa Internet Summit 2026', category_id: catMap['Technology'], venue: 'Nairobi, Kenya', event_date: '2026-06-22 09:00:00', description: 'Africa\'s Internet community for technical exchange and policy dialogue.' },
      { title: 'Africa Blockchain Festival 2026', category_id: catMap['Technology'], venue: 'Nairobi, Kenya', event_date: '2026-10-15 09:00:00', description: 'Bringing together blockchain and AI leaders from Africa and beyond.' },
      { title: 'AfricArena Nairobi Summit 2026', category_id: catMap['Technology'], venue: 'Radisson Blu Hotel, Nairobi Upper Hill', event_date: '2026-09-15 09:00:00', description: 'Two-day summit connecting startups, investors, and corporates.' },
      { title: 'MindTech Conference Nairobi 2026', category_id: catMap['Technology'], venue: 'Embakasi, Nairobi', event_date: '2026-08-10 09:00:00', description: 'Exploring the intersection of technology and mental health.' },
      { title: 'Spirit of Africa Festival 2026', category_id: catMap['Technology'], venue: 'Nairobi, Kenya', event_date: '2026-10-06 09:00:00', description: 'Live music, cultural performances, and immersive VR/AR experiences.' },
      // Music
      { title: 'Festival of Sound and Art', category_id: catMap['Music'], venue: 'Sarit Rooftop Garden, Nairobi', event_date: '2026-08-02 18:00:00', description: 'A month of live performances every Sunday.' },
      { title: 'Haus of Kühl Nairobi 2026', category_id: catMap['Music'], venue: 'Sk8City at Diamond Plaza 2, Nairobi', event_date: '2026-09-26 18:00:00', description: 'South African and Kenyan DJs and dancers.' },
      { title: 'Don Carlos Reggae Showcase', category_id: catMap['Music'], venue: 'Carnivore Grounds, Nairobi', event_date: '2026-10-09 20:00:00', description: 'Jamaican reggae legend Don Carlos live in Nairobi.' },
      { title: 'ONE NIGHT ONLY MAY 2026', category_id: catMap['Music'], venue: 'Sarit Expo Centre, Nairobi', event_date: '2026-05-31 18:00:00', description: 'A Festival of AfroPop, Soul and Jazz.' },
      { title: 'MachokaAt50 Grand Concert', category_id: catMap['Music'], venue: 'Nairobi, Kenya', event_date: '2026-10-10 20:00:00', description: 'Koffi Olomide headlines this grand concert.' },
      { title: 'Dala Festival 2026', category_id: catMap['Music'], venue: 'Nairobi, Kenya', event_date: '2026-12-12 18:00:00', description: 'Ferré Gola performs at this Jamhuri Day festival.' },
      // Culture & Arts
      { title: 'Imbalu Festival 2026', category_id: catMap['Culture & Arts'], venue: 'Sang\'alo Cultural Centre, Bungoma', event_date: '2026-08-11 10:00:00', description: 'A five-day cultural festival featuring traditional music and dance.' },
      { title: 'Piny Luo Cultural Festival', category_id: catMap['Culture & Arts'], venue: 'Kisumu, Kenya', event_date: '2026-12-14 10:00:00', description: 'The 6th edition celebrating Luo cultural heritage.' },
      { title: 'Iteso Cultural Celebrations', category_id: catMap['Culture & Arts'], venue: 'Kenya/Uganda border region', event_date: '2026-10-29 10:00:00', description: 'Over 50,000 visitors expected for cultural displays and entertainment.' },
      { title: 'iToka Chapter 2', category_id: catMap['Culture & Arts'], venue: 'Eva\'s Garden in Redhill, Limuru', event_date: '2026-08-29 10:00:00', description: 'A multidisciplinary cultural festival of art, music, and fashion.' },
      { title: 'Nairobi Litfest 2026', category_id: catMap['Culture & Arts'], venue: 'McMillan Memorial Library, Nairobi', event_date: '2026-05-08 10:00:00', description: 'Blending literature, music, and cultural conversations.' },
      { title: 'Lake Turkana Festival', category_id: catMap['Culture & Arts'], venue: 'Loiyangalani, Marsabit County', event_date: '2026-05-25 10:00:00', description: 'A unique cultural festival near Sibiloi National Park.' },
      // Sports
      { title: 'Eldoret City Marathon 2026', category_id: catMap['Sports'], venue: 'Eldoret, Uasin Gishu County', event_date: '2026-04-26 07:00:00', description: 'The seventh edition of this iconic marathon.' },
      { title: 'Standard Chartered Nairobi Marathon', category_id: catMap['Sports'], venue: 'Uhuru Gardens, Nairobi', event_date: '2026-10-25 06:00:00', description: 'Kenya\'s flagship road race with 42km, 21km, and 10km categories.' },
      { title: 'Nairobi City Marathon 2026', category_id: catMap['Sports'], venue: 'City Hall to Uhuru Park, Nairobi', event_date: '2026-06-07 06:00:00', description: 'Over 17,000 runners expected in this 5th edition.' },
      // Business
      { title: 'EAC MSME Trade Fair 2026', category_id: catMap['Business'], venue: 'Kigali, Rwanda', event_date: '2026-10-30 09:00:00', description: 'Showcasing MSMEs and investment opportunities across East Africa.' },
      { title: 'INDUSMACH KENYA 2026', category_id: catMap['Business'], venue: 'KICC, Nairobi', event_date: '2026-06-03 09:00:00', description: 'The largest international trade exhibition for industrial manufacturing.' },
      { title: 'China Trade Week (CTW) Kenya 2026', category_id: catMap['Business'], venue: 'KICC, Nairobi', event_date: '2026-07-22 09:00:00', description: 'East Africa\'s leading international trade exhibition.' },
      { title: 'Africa Technology Show (AFTS) 2026', category_id: catMap['Business'], venue: 'KICC, Nairobi', event_date: '2026-07-22 09:00:00', description: 'Co-located with China Trade Week, focusing on technology.' },
      { title: 'Africa Build Show Kenya 2026', category_id: catMap['Business'], venue: 'KICC, Nairobi', event_date: '2026-07-22 09:00:00', description: 'The 4th edition of this construction and energy exhibition.' },
      { title: 'MEGAWATT Africa Kenya 2026', category_id: catMap['Business'], venue: 'KICC, Nairobi', event_date: '2026-07-22 09:00:00', description: 'The 3rd edition focusing on power and energy.' }
    ];

    const admin = await User.findOne({ where: { role: 'admin' } });

    for (const ev of newEvents) {
      const [event, created] = await Event.findOrCreate({
        where: { title: ev.title },
        defaults: { ...ev, created_by: admin.user_id, status: 'published' }
      });

      if (created) {
        await TicketType.bulkCreate([
          { event_id: event.event_id, name: 'Regular', price: 1000, quantity_total: 300 },
          { event_id: event.event_id, name: 'VIP', price: 3500, quantity_total: 50 }
        ]);
      }
    }
    console.log('✅ 25 new events created with ticket types.');

    console.log('🎉 Seeding complete! Your database is now fully populated.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
};

seedMoreData();