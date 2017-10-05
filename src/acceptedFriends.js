import React from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import {getFriends, accept, unfriend} from './actions';




class Accepted extends React.Component {
    render() {
        console.log('friend', this.props.friends);
        const {friends, unfriend} = this.props;

        if(!friends) {
            return null;
        }

        const acceptedFriends = (
            <div className="online-users">
                <h3>Friends</h3>
                {friends.map(friend => (
                    <li className="online-list">
                        <div className="online-pic-container ">
                            <img className="online-pic" src={friend.image} />
                        </div>

                        <div className="online-name">{friend.first} {friend.last}</div>

                        <button className="friend-button list-button" onClick={() => unfriend(friend.id)}> Unfriend </button>
                    </li>
                    )
                )}
            </div>
        );

        return (
            <div>
                {!friends.length && <div> You have no friends!</div>}
                {friends && acceptedFriends}
            </div>
        )
    }
}

export default connect(function(state) {
    return {
        friends: state.friends && state.friends.filter((friend) => {
            if(friend.status === 2) {
                return friend
            }
        })
    }
}, function(dispatch) {
    return {
        unfriend: function(id) {
            dispatch(unfriend(id));
        }
    }
})(Accepted);
