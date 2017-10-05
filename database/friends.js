const spicedPg = require('spiced-pg');
const secrets = require('../secrets.json');

const db = spicedPg(`postgres:${secrets.dbuser}:${secrets.dbpassword}@localhost:5432/socialmedia`);



module.exports.getFriendStatus = function (sender_id, rec_id) {

    const select = `SELECT * FROM friendStatus WHERE (sender_id = $1 AND rec_id = $2) OR (rec_id = $1 AND sender_id = $2)`;
    const result = db.query(select, [sender_id, rec_id]);
    return result;
}


module.exports.addFriendStatus = function (sender_id, rec_id, status) {

    const insert = `INSERT INTO friendStatus (sender_id, rec_id, status) VALUES ($1, $2, $3) returning sender_id, status, rec_id`;
    const result = db.query(insert, [sender_id, rec_id, status]);
    return result;

}

module.exports.updateFriendStatus = function (status, sender_id, rec_id, id) {

    const update = `UPDATE friendStatus SET status = $1, sender_id=$2, rec_id=$3 WHERE id = $4 RETURNING sender_id, rec_id, status`;
    const result = db.query(update, [status, sender_id, rec_id, id]);
    return result;

}

module.exports.getFriendList = function (user) {

    const select = `SELECT users.id, status, first, last, image FROM friendStatus JOIN users
                    ON (users.id = rec_id AND sender_id = $1 AND status = 2)
                    OR (users.id = sender_id AND rec_id = $1 AND status = 2)
                    OR (sender_id = users.id AND rec_id = $1 AND status = 1)
                    LEFT OUTER JOIN propic ON users.id = propic.user_id`;
    const result = db.query(select, [user]);
    return result;
}
