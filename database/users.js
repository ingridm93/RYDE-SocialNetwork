const spicedPg = require('spiced-pg');
const secrets = require('../secrets.json');

const db = spicedPg(`postgres:${secrets.dbuser}:${secrets.dbpassword}@localhost:5432/socialmedia`);


var bcrypt = require('bcryptjs');


module.exports.hashPassword = function (plainTextPassword) {
    return new Promise(function (resolve, reject) {
        bcrypt.genSalt(function (err, salt) {
            if (err) {
                return reject(err);
            }
            console.log(plainTextPassword, salt);
            bcrypt.hash(plainTextPassword, salt, function (err, hash) {
                if (err) {
                    return reject(err);
                }
                resolve(hash);
            });
        });
    });
};

module.exports.checkPassword = function (textEnteredInLoginForm, hashedPasswordFromDatabase) {
    return new Promise(function (resolve, reject) {
        bcrypt.compare(textEnteredInLoginForm, hashedPasswordFromDatabase, function (err, doesMatch) {
            if (err) {
                reject(err);
            } else {
                resolve(doesMatch);
            }
        });
    });
};

module.exports.addUser =  function (first, last, email, password) {
    const insert = `INSERT INTO users (first, last, email, password) VALUES ($1, $2, $3, $4) RETURNING id, first, last, email, bio`;
    return db.query(insert, [first, last, email, password]);
};

module.exports.getUserProfileByEmail = function (email) {
    const select = `SELECT users.id, users.email, users.password, users.first, users.last, users.bio, propic.image FROM users
                    LEFT OUTER JOIN propic ON users.id = propic.user_id
                    WHERE email = $1 ORDER BY created_at DESC`;
    const result = db.query(select, [email]);
    return result;
};


module.exports.getUserProfileById = function (id) {
    const select = `SELECT users.id, users.email, users.first, users.last, users.bio, propic.image FROM users
                    LEFT OUTER JOIN propic ON users.id = propic.user_id
                    WHERE users.id = $1 ORDER BY created_at DESC`;
    const result = db.query(select, [id]);
    return result;
};

module.exports.addProfilePicture = function (user_id, image) {
    const insert = `INSERT INTO propic (user_id, image) VALUES ($1, $2)`;
    const result = db.query(insert, [user_id, image]);
    return result;

};

module.exports.getProfilePictures = function (user_id) {
    const insert = `SELECT * FROM  propic WHERE user_id = $1 ORDER BY created_at DESC`;
    const result = db.query(insert, [user_id]);
    return result;

};



module.exports.addBio = function (bio, email) {
    const insert = `UPDATE users SET bio = $1 WHERE email = $2`;
    const result = db.query(insert, [bio, email]);
    return result;
};

module.exports.getOnlineUsersById = function (ids) {
    const select = `SELECT first, last, image FROM users  JOIN propic ON users.id = propic.user_id WHERE users.id = ANY($1) ORDER BY created_at DESC`
    const result = db.query(select, [ids]);
    return result;

}
