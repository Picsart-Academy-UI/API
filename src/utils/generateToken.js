const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });
const jwt = require('jsonwebtoken');
const { User: UserModel } = require('booking-db');
const {connectDB} = require('booking-db');

const email = process.argv.slice(2);

async function generateToken(){
  let foundUser;
  try {
    await connectDB(process.env.MONGO_URI);
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
  }, process.env.JWT_SECRET);
  return token;
}

generateToken().then((result) => {
  console.log(result);
  process.exit(1);
});
