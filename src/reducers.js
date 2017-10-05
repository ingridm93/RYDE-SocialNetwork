export default function (state = {}, action) {

    if (action.type === 'GET_SOCKET') {
        state = Object.assign({}, state, {
            socket: action.socket
        })
    }

    if (action.type === 'GET_FRIENDS') {
        state = Object.assign({}, state, {
            friends: action.friends
        })
    }

    if (action.type === 'ACCEPT_FRIEND') {
        state = Object.assign({}, state, {
            pending: state.friends.map((friend) => {
                if (action.id === friend.id) {
                    friend.status = 2
                }
                return friend
            })

        })

    }

    if (action.type === 'UNFRIEND_FRIEND') {
        state = Object.assign({}, state, {
            unfriend: state.friends.map((friend) => {
                if (action.id === friend.id) {
                    friend.status = 3
                }
                return friend
            })

        })

    }

    if (action.type === 'ONLINE_USERS') {
        state = Object.assign({}, state, {
            onlineUsers: action.users
        })
    }

    if (action.type === 'USER_JOINED') {
        if (state.onlineUsers && !state.onlineUsers.find(user => user.id == action.userJoin.id)) {

            state = Object.assign({}, state, {

                onlineUsers: [...state.onlineUsers, action.userJoin]
            });
        }

    }

    if (action.type === 'USER_LEFT') {

        state = Object.assign({}, state, {

            onlineUsers: state.onlineUsers.filter(user => user.id !== action.userLeft)
        })
    }

    if (action.type === 'GET_MESSAGES') {

        state = Object.assign({}, state, {

            chatMessages: action.messages
        })

    }

    if (action.type === 'NEW_MESSAGE') {

        state = Object.assign({}, state, {

            chatMessages: [...state.chatMessages, action.message]

        })
    }

    return state;
}
