require('dotenv').config();
const app = require('./app');
const { sequelize } = require('./models'); // Changed this line

const PORT = process.env.PORT || 5000;

(async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connected successfully via Sequelize.');
    
    // Optional: Sync models (DON'T use { force: true } in production, but okay for local testing if you want)
    // await sequelize.sync(); 
    
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  } catch (err) {
    console.error('Unable to connect to the database:', err.message);
    process.exit(1);
  }
})();