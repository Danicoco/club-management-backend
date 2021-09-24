const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('hutcacti', 'hutcacti', 'RLkQ14u0SUPRgZg42QUeCsahyRU5naeQ',{
  host: 'fanny.db.elephantsql.com',
  pool: {
    max: 5,
    min: 0,
    idle: 10000,
    acquire: 100000
  },
  dialect: 'postgres'
});

const authenticate = async () => {
  try {
    await sequelize.authenticate();
    console.log(`DB connected`);
    // const syncDB = await sequelize.sync({ force: true }); //remove in production
    // console.log(`All models were successfully synchronized ${syncDB}`);
  } catch (error) {
    console.log(error.message);
    console.log('Unable to connect to the database');
  }
}

authenticate();

module.exports = {
  sequelize
}