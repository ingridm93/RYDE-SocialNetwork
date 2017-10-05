import axios from 'axios';
import getSocket from './socketIO';

export function newUserOnline() {
    return getSocket().then((socket) => {
        return {
            type: 'GET_SOCKET',
            socket: socket
        }
    })
}

export function getFriends() {
    return axios.get('/friendList').then((result) => {
        return {
            type: 'GET_FRIENDS',
            friends: result.data.friends
        }
    })
}

export function accept(id) {
    return axios.post('/api/friendStatus/' + id).then(() => {
        return {
            type: 'ACCEPT_FRIEND',
            id
        }
    })
}

export function unfriend(id) {
    return axios.post('/api/friendStatus/' + id).then(() => {
        return {
            type: 'UNFRIEND_FRIEND',
            id
        }
    })
}

export function onlineUsers(users) {
    return {
        type: 'ONLINE_USERS',
        users
    }
}


export function userJoined(userJoin) {

    return {
        type: 'USER_JOINED',
        userJoin
    }

}


export function userLeft(userLeft) {

    return {
        type: 'USER_LEFT',
        userLeft
    }
}

export function getChatMessages(messages) {

    return {
        type: 'GET_MESSAGES',
        messages
    }
}

export function newMessage(message) {

    return {
        type: 'NEW_MESSAGE',
        message
    }
}
