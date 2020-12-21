const {User: UserModel} = require('booking-db');
const mailer = require('../utils/mailer');

exports.update_user = function (email, user_to_be_updated){
    return UserModel.findOneAndUpdate({email}, user_to_be_updated, {new : true});
}

exports.find_one_user = function (parameter){
    return UserModel.findOne({[parameter]: parameter})
}

exports.create_user = async function(user){

    let createdUser;
    let mailResponse;

    try{

        createdUser = await UserModel.create(user);

        mailResponse = await mailer(user.email);

    }catch (err){

        throw err;

    }


    return createdUser;
}
