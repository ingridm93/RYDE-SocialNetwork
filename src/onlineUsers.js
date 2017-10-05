import React from 'react';
import {connect} from 'react-redux';
import { Link } from 'react-router';
import getSocket from './socketIO';

class OnlineUsers extends React.Component {

    render () {

        const {onlineUsers} = this.props;

        if(!onlineUsers) {
            return null
        }

        const onlineFriends = (
            <div className="online-users">
                {onlineUsers.map(online => (
                    <li className="online-list">
                        <div className="online-pic-container">
                            <img className="online-pic" src={online.image}/>
                        </div>

                        <div className="online-name">{online.first} {online.last}</div>

                    </li>
                    )
                )}
            </div>
        )

        return (
            <div id="online-container">
                <h1>Friends Online</h1>
                {!onlineUsers.length && <div> No friends are available. </div>}
                {onlineUsers && onlineFriends}
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        onlineUsers: state.onlineUsers
    }
}

export default connect(mapStateToProps)(OnlineUsers);
