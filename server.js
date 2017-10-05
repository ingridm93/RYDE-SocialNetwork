const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const compression = require('compression');
const dbQuery = require('./database/users');
const dbStatus = require('./database/friends');
const bodyParser = require('body-parser');
const multer = require('multer');
const uidSafe = require('uid-safe');
const path = require('path');
const s3Url = require('./config.json').s3Url;
const knox = require('knox');



if (process.env.NODE_ENV != 'production') {
    // app.use(require('./build'));
    app.use('/bundle.js', require('http-proxy-middleware')({
        target: 'http://localhost:8081'
    }));
}


var cookieSession = require('cookie-session');

app.use(cookieSession({
    secret: 'nobody will ever figure this out',
    maxAge: 1000 * 60 * 60 * 24 * 14
}));

app.use(require('cookie-parser')());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));


const diskStorage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, __dirname + '/uploads');
    },
    filename: function (req, file, callback) {
        uidSafe(24).then(function (uid) {
            callback(null, uid + path.extname(file.originalname));
        });
    }

});

const uploader = multer({
    storage: diskStorage,
    limits: {
        filesize: 20197152
    }
});

app.use(express.static(__dirname + '/public'));

app.use(compression());

if (process.env.NODE_ENV != 'production') {
    app.use(require('./build'));
}


app.get('/welcome', (req, res) => {
    if (req.session.user) {
        res.redirect('/');
    }
    res.sendFile(__dirname + '/index.html');
});

app.get('/api/', (req, res) => {

    dbQuery.getProfilePictures(req.session.user.id)
    .then((imgs) => {

        const images = imgs.rows.map((obj) => {

            obj.image = s3Url + obj.image

            return obj.image
        });


        const { id, first, last, email, image, bio } = req.session.user;


        var dbUser = {
            id: id,
            first: first,
            last: last,
            email: email,
            image: image,
            bio: bio,
            images: images

        };
        res.json({
            user: dbUser
        });

    });

});



app.post('/register', (req, res) => {

    const { first, last, email, password } = req.body;

    dbQuery.hashPassword(password)
    .then((hash) => {

        return dbQuery.addUser(first, last, email, hash)

    })
    .then((result) => {

        req.session.user = {
            id: result.rows[0].id,
            first: result.rows[0].first,
            last: result.rows[0].last,
            email: result.rows[0].email
        };

        res.json({
            success: true
        })
    })
    .catch((err) => {
        console.log(err);
    });
});

app.get('/api/user/:id', (req, res) => {
    console.log('other profile');

    const {id} = req.session.user;

    if (id == req.params.id) {
        res.status(200).json({
            success: false,
            redirect: true
        });
    } else {
        Promise.all([
            dbStatus.getFriendStatus(req.session.user.id, req.params.id),
            dbQuery.getUserProfileById(req.params.id)
        ])
        .then((result) => {

            var friendshipStatus = result[0].rows[0];
            var info = result[1];

            if (!result[0].rows.length) {

                const { id, first, last, email, image, bio } = info.rows[0];

                res.json({
                    friendStatus: {
                        sender: req.session.user.id,
                        receiver: req.params.id,
                        status: 0
                    },
                    otherUser: {
                        id: id,
                        first: first,
                        last: last,
                        email: email,
                        image: s3Url + image,
                        bio: bio
                    }

                });
            } else {

                const { id, first, last, email, image, bio } = info.rows[0];

                const { sender_id, rec_id, status } = friendshipStatus;

                res.json({
                    sucess: true,
                    friendStatus: {
                        sender: sender_id,
                        receiver: rec_id,
                        status: status
                    },
                    otherUser: {
                        id: id,
                        first: first,
                        last: last,
                        email: email,
                        image: s3Url + image,
                        bio: bio
                    }
                });
            }
        })
        .catch((err) => {
            console.log(err);
            res.json({
                success: false
            });
        });
    }
});


app.post('/login', (req, res) => {
    const { email, password } = req.body;

    dbQuery.getUserProfileByEmail(email)
    .then((result) => {

        return dbQuery.checkPassword(password, result.rows[0].password)
        .then((doesMatch) => {
            if (!doesMatch) {
                throw 'Password is incorrect.'
            } else {
                var rows = result.rows;

                const {id, first, last, email, image, bio } = rows[0];

                const images = rows.map((obj) => {

                    obj.image = s3Url + obj.image

                    return obj.image
                })

                req.session.user = {id, first, last, email, image, bio, images};

                res.json({
                    success: true
                })
            }
        }).catch((err) => {
            console.log(err);
        })
    })
    .catch((err) => {
        console.log(err);
        res.json({
            success: false
        })
    })
});

app.post('/edit', (req, res) => {


    const { bio } = req.body;

    if (bio) {
        dbQuery.addBio(bio, req.session.user.email)
        .then(() => {
            req.session.user.bio = bio;

            res.json({
                success: true,
                bio: bio

            })
        })
        .catch((err) => {
            console.log(err)
        })
    }

});


app.post('/upload', uploader.single('file'), uploadToS3, (req, res) => {
    const { id } = req.session.user;

    console.log(req.file.filename);

    if (req.file) {


        dbQuery.addProfilePicture(id, req.file.filename)
        .then((arr) => {

            req.session.user.image = s3Url + req.file.filename


            res.json({
                success: true,
                url: s3Url + req.file.filename
            });
        })
        .catch((err) => {
            console.log(err);
            res.json({
                success: false

            });
        })

    } else {
        res.json({
            success: false
        });
    }
});



let secrets;
if (process.env.NODE_ENV == 'production') {
    secrets = process.env;
} else {
    secrets = require('./secrets');
}
const client = knox.createClient({
    key: secrets.awsKey,
    secret: secrets.awsSecret,
    bucket: 'spicedling'
});


function uploadToS3(req, res, next) {

    const s3Request = client.put(req.file.filename, {
        'Content-Type': req.file.mimetype,
        'Content-Length': req.file.size,
        'x-amz-acl': 'public-read'
    });


    const fs = require('fs');
    const readStream = fs.createReadStream(req.file.path);
    readStream.pipe(s3Request);

    s3Request.on('response', s3Response => {
        const wasSuccessful = s3Response.statusCode == 200;

        if (wasSuccessful) {
            next();

        } else {
            res.json({
                success: false
            });
        }
    });
}
const pending = 1,
    accepted = 2,
    cancelled = 3,
    rejected = 4,
    terminated = 5;

app.post('/api/friendStatus/:id', (req, res) => {

    const params_id = req.params.id;
    const user_id = req.session.user.id;


    dbStatus.getFriendStatus(req.session.user.id, req.params.id)

    .then((result) => {

        if (!result.rows.length) {
            dbStatus.addFriendStatus(user_id, params_id, 1)
            .then((result) => {

                res.json({
                    success: true,
                    sender: user_id,
                    receiver: params_id,
                    status: result.rows[0].status
                });
            });

        } else if (result.rows[0].status === 3 || result.rows[0].status === 4 || result.rows[0].status === 5) {

            const { id, status, sender_id, rec_id } = result.rows[0];

            dbStatus.updateFriendStatus(1, user_id, params_id, id)
            .then((result) => {

                res.json({
                    success: true,
                    sender: result.rows[0].sender_id,
                    receiver: result.rows[0].rec_id,
                    status: result.rows[0].status
                });
            });

        } else {

            const { status, sender_id, rec_id, id } = result.rows[0];

            if (sender_id == user_id && status === 1) {
                console.log("UPDATE TO CANCEL");
                dbStatus.updateFriendStatus(3, user_id, params_id, id)
                .then((result) => {
                    res.json({
                        success: true,
                        sender: result.rows[0].sender_id,
                        receiver: result.rows[0].rec_id,
                        status: result.rows[0].status

                    });
                })

            } else if (rec_id === user_id && status === 1) {
                console.log('UPDATE TO ACCEPTED')
                dbStatus.updateFriendStatus(2, user_id, params_id, id)
                .then((result) => {
                    res.json({
                        success: true,
                        sender: result.rows[0].sender_id,
                        receiver: result.rows[0].rec_id,
                        status: result.rows[0].status
                    });
                })
            } else {
                console.log('UPDATE TO terminated')
                dbStatus.updateFriendStatus(4, user_id, params_id, id)
                .then((result) => {
                    res.json({
                        success: true,
                        sender: result.rows[0].sender_id,
                        receiver: result.rows[0].rec_id,
                        status: result.rows[0].status
                    });
                })
            }
        }

    })
    .catch((err) => {
        console.log(err);
    });
});


app.post('/api/RejectRequest/:id', (req, res) => {
    const params_id = req.params.id;
    const user_id = req.session.user.id;

    dbStatus.getFriendStatus(req.session.user.id, req.params.id)
    .then((result) => {

        const { status, sender_id, rec_id, id } = result.rows[0];

        if (rec_id === user_id && status === 1) {

            return dbStatus.updateFriendStatus(5, user_id, params_id, id)
        }

        res.json({
            success: true,
            sender: result.rows[0].sender_id,
            receiver: result.rows[0].rec_id,
            status: result.rows[0].status

        });
    });
});

app.get('/friendList', (req, res) => {

    dbStatus.getFriendList(req.session.user.id)
    .then((result) => {
        console.log(req.session.user.id);
        console.log(result.rows);

        const friends = result.rows.map((user) => {
            user.image = s3Url + user.image;
            return user;
        })

        res.json({
            friends: friends
        })
    }).catch((err) => {
        console.log(err);
        res.json({
            success: false
        });
    });

});

let online = [];
let chat = [];

app.get('/connected/:socketID', (req, res) => {

    const socketID = req.params.socketID;
    const userID = req.session.user.id;
    const socketAlreadyThere = online.find(socket => socket.socketID === socketID);
    const userAlreadyThere = online.find(user => user.userID === userID);

    console.log('CHECK', online);

    if (!io.sockets.sockets[socketID]) {
        return;
    };

    if (!userID) {
        return;
    }

    online.push({
        userID,
        socketID
    });

    dbQuery.getUserProfileById(userID)
    .then((result) => {

        const user = {
            id: result.rows[0].id,
            first: result.rows[0].first,
            last: result.rows[0].first,
            image: s3Url + result.rows[0].image
        }
        io.sockets.emit('userJoined', {
            userJoined: user
        });
    });


    dbQuery.getOnlineUsersById(online.map((user) => user.userID))
    .then((result) => {
        console.log('getting online users', result.rows[0]);

        const usersArr = [];

        const users = {
            id: result.rows[0].id,
            first: result.rows[0].first,
            last: result.rows[0].last,
            image: s3Url + result.rows[0].image
        }

        usersArr.push(users);

        io.sockets.sockets[socketID].emit('onlineUsers', {
            users: usersArr
        });


    }).catch((err) => {
        console.log(err);
    });
});

io.on('connection', (socket) => {

    console.log(`socket with the id ${socket.id} is now connected`);

    socket.on('disconnect', function () {

        console.log(`socket with the id ${socket.id} is now disconnected`);

        const socketLeft = online.filter(user => user.socketID === socket.id)[0];

        const userIndex = online.indexOf(socketLeft);

        online.splice(userIndex, 1);

        const userSockets = online.filter(user => user.userID === socketLeft.userID);

        if (userSockets.length == 0) {
            io.sockets.emit('userLeft', {
                userLeft: socketLeft.userID
            })
        }
        console.log('user left');
    });

    socket.emit('getChatMessages', {

        chat: chat
    })

    socket.on('newMessage', (msg) => {

        console.log(`user with the id ${socket.id} just sent a message`);

        const socketSender = online.filter(user => user.socketID === socket.id)[0];
        const userIndex = online.indexOf(socketSender);
        const userID = socketSender.userID;

        console.log('chatMessage const', socketSender, userIndex, userID);

        dbQuery.getUserProfileById(userID)
        .then((result) => {
            console.log(result);

            const { id, first, last, image } = result.rows[0]

            const newMessage = {
                message: msg,
                id: id,
                first: first,
                last: last,
                image: s3Url + image,
                date: new Date("Month dd, yyyy hh:mm:ss")
            }

            chat.push(newMessage);

            chat.length > 10 && chat.shift()

            io.emit('newMessage', {
                newMessage: newMessage
            })

        }).catch((err) => {

            console.log(err);
        })

    })

});



app.get('*', function (req, res) {

    if (!req.session.user && req.url != '/welcome') {

        res.redirect('/welcome')
    }

    res.sendFile(__dirname + '/index.html');
});


app.get('/', function (req, res) {
    res.sendStatus(200);
});


server.listen(8080);
