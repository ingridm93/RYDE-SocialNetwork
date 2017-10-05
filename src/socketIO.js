import React from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import {store} from './start';
import axios from 'axios';
import {onlineUsers, userJoined, userLeft, getChatMessages, newMessage} from './actions';
import * as io from 'socket.io-client';
;


let socket;

export default function getSocket () {


    if(!socket) {

        return new Promise ((resolve, reject) => {


            const socket = io.connect();

            socket.on('connect', () => {
                axios.get(`/connected/${socket.id}`).then(() => {

                    if(err) {
                        reject(err);
                    } else {
                        console.log('resolving socket');
                        resolve(socket);
                    }
                })
            })


            socket.on('onlineUsers', (users) => {
                store.dispatch(onlineUsers(users.users))
            })

            socket.on('userJoined', (user) => {
                console.log('new user online', user);
                store.dispatch(userJoined(user.userJoined));
            });

            socket.on('userLeft', (user) => {
                console.log('user has left', user);
                store.dispatch(userLeft(user.userLeft));
            });

            socket.on('getChatMessages', (arr) => {
                console.log('all msgs coming');
                store.dispatch(getChatMessages(arr.chat));
            });

            socket.on('newMessage', (message) => {
                console.log('new msg coming', message);
                store.dispatch(newMessage(message.newMessage));
            });

            resolve(socket);

        });


    }
}
