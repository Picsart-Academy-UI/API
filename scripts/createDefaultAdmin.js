const path = require('path');

require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const { connectDB, User, Team } = require('booking-db');

const [email, team_name] = process.argv.slice(2);

if (!email || !team_name){
  console.log('Please provide with email and team_name to create the default admin');
  process.exit(1);
}

const createDefaultAdmin = async () => {
  const team = await Team.create({
    team_name: team_name || 'Admin'
  });
  const admin = await User.create({
    first_name: 'Default',
    last_name: 'Admin',
    email,
    team_id: team._id,
    is_admin: true,
    position: 'Admin'
  });
  return admin;
};


connectDB(process.env.MONGO_URI).then(async (connection) => {
  try {
    const admin = await createDefaultAdmin();
    console.log(admin, 'Admin user was successfully created');
    process.exit(0);
  } catch (err){
    console.log('Error occurred while creating the default admin', err);
    process.exit(1);
  }
}).catch((err) => {
  console.log('Error occurred while connecting to DB', err);
  process.exit(1);
});
