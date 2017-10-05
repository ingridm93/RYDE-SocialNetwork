import React from 'react';
import {Link} from 'react-router'
import axios from 'axios';

export default class FriendStatus extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            sender: this.props.sender,
            receiver: this.props.receiver,
            status: this.props.status
        }
    }

    updateStatus() {
        axios.post(`/api/FriendStatus/${this.props.id}`)
        .then((result) => {

            var status = result.data.status;

            this.setState({
                status: status
            })
        })
    }

    rejectFriendRequest () {

        axios.post(`/api/RejectRequest/${this.props.id}`)
        .then((result) => {

            var status = result.data.status;

            this.setState({
                status: status
            })
        })
    }

    render () {
       var buttonStatus;
       var reject;

       if(this.state.receiver === this.props.id  && this.state.status == 1) {
            buttonStatus = 'Accept Friend Request';
        } else if (this.state.receiver !== this.props.id  && this.state.status == 1) {
            buttonStatus = 'Cancel Friend Request'
            reject = <button onClick={e => this.rejectFriendRequest(e)}>Reject Friend Request</button>
        } else if (this.state.status == 2) {
            buttonStatus = 'Unfriend'
        } else {
            buttonStatus = 'Add Friend'
        }

        return (
            <div>

                <button className="friend-button" onClick = {e => this.updateStatus(e)} > {buttonStatus}  </button>
                {reject}
            </div>
        );
    }

}
