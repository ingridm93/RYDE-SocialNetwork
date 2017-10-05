import React from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import {getFriends, accept, unfriend} from './actions';
import Accepted from './acceptedFriends';
import Pending from './pendingFriends';


class GetFriends extends React.Component {

    constructor(props) {
        super(props);
        this.state = {};
        this.dispatch = this.props.dispatch.bind(this);
    }


    componentDidMount() {
        this.props.dispatch(getFriends())
    }

    accept(id) {
        this.props.dispatch(accept(id));

    }

    unfriend(id) {
        this.props.dispatch(unfriend(id));

    }



    render() {
        const {friends} = this.props;
        if(!friends) {
            return null;
        }

        return (
            <div id="friend-list">
                <div className = 'pending-friends'>



                    {friends && <Pending friends={friends} unfriend={accept} />}


                </div>
                <div className="separator"></div>

                <div className = 'accepted-friends'>
                    
                    {friends && <Accepted friends={friends} accept={unfriend} />}
                </div>
            </div>
        )
    }
}

const mapStateToProps = function(state) {

    return {
        friends: state.friends
    }
}
export default connect(mapStateToProps)(GetFriends);
