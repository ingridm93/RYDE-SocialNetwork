import React from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import {getFriends, accept, unfriend} from './actions';



class Pending extends React.Component {
    render() {
        const {friends, accept} = this.props;

        if(!friends) {
            return null;
        }

        const pendingFriends = (
            <div className="online-users">
                <h3>Pending Requests</h3>
                {friends.map(friend => (
                    <li className="online-list">
                        <div className="online-pic-container">
                            <img className="online-pic" src={friend.image} />
                        </div>
                        <div className="online-name">{friend.first} {friend.last}</div>
                        <button className="friend-button list-button" onClick={() => accept(friend.id)}> Accept Friend Request </button>
                    </li>
                    )
                )}
            </div>
        );

        return (
            <div id="online-container">
                {!friends.length && <div> You have no friends!</div>}
                {friends && pendingFriends}

            </div>
        )
    }
}

export default connect(function(state) {
    return {
        friends: state.friends && state.friends.filter((friend) => {
            if(friend.status === 1) {
                return friend
            }
        })
    }
}, function(dispatch) {
    return {
        accept: function(id) {
            dispatch(accept(id));
        }
    }
})(Pending);
