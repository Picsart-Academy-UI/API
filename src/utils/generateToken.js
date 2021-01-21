const jwt = require('jsonwebtoken');
const { User: UserModel } = require('booking-db');
const {connectDB} = require('booking-db');

const email = process.argv.slice(2);

async function generateToken(){
  let foundUser;
  try {
    await connectDB('mongodb://localhost:27017/?readPreference=primary&appname=MongoDB%20Compass&ssl=false');
     foundUser = await UserModel.findOne({email}).lean().exec();
  } catch (err){
    console.log(err);
    process.exit(1);
  }
  if (!foundUser) {
    process.exit(0);
    return console.log(`user with email ${email} does not exist`);
  }
  const token = await jwt.sign({
    _id: foundUser._id,
    email: foundUser.email,
    team_id: foundUser.team_id,
    is_admin: foundUser.is_admin
  }, 'Picsart2020');
  return token;
}

generateToken().then((result) => {
  console.log(result);
  process.exit(1);
});
