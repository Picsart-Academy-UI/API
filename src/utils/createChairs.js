const {Chair} = require('booking-db');
const {BadRequest} = require('./errorResponse');


exports.createChairs = async (table) => {
    const {chairs_count} = table;
    const chairsArr = [];
    if (chairs_count > 30) throw new BadRequest(`Not allowed to create ${chairs_count} much chairs`);
    for (let i = 1; i <= chairs_count; i++ ){
        const chair = new Chair({
            table_id: table._id,
            number: i
        });
        chairsArr.push(chair);
    }
    const created = await Chair.insertMany(chairsArr);
    return created;
};
