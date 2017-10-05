import React from 'react';
import {Link, browserHistory} from 'react-router'
import axios from 'axios';
import Upload from './Upload';
import PPView from './PPView';
import FriendStatus from './friendButton';

export default class friendProfile extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            currImg: 0
        };
        this.showImage = this.showImage.bind(this);
    }


    componentDidMount() {


        const {id} = this.props.params

        axios.get(`/api/user/${id}`)
        .then((res) => {
            console.log('data', res.data);
            if(res.data.redirect == true) {
                return browserHistory.push('/')
            }

            const {id, first, last, bio, image, email} = res.data.otherUser

            const {sender, receiver, status} = res.data.friendStatus;

            this.setState({id, first, last, bio, image, email, sender, receiver, status});

        })
        .catch((err) => {
                console.log(err)
        })
    }


    showImage() {
        this.setState({
            imageIsVisible: !this.state.imageIsVisible
        })
    }



    render() {
        console.log('something');

        return (
                <div>

                    <div className="friend-profile">

                        <div className="friend-pp-container">

                            <img  src={this.state.image} onClick={this.showImage} className="friend-pp-view" />

                        </div>

                        <div className="friend-name">

                            {this.state.first} {this.state.last}

                        </div>

                        <FriendStatus id={this.state.id} sender={this.state.sender} receiver={this.state.receiver} status={this.state.status} />

                    </div>



                    <div id="outer-circle">

                        <div id='mid-circle'>

                            <Link to='/profile'>
                                <div id="inner-circle">
                                    <div id="km">{this.state.bio}</div>
                                </div>
                            </Link>

                        </div>
                    </div>

                    <div id="tabs">

                        <div id="buddy-tab">FIND A BIKE BUDDY</div>
                        <div id="trails-tab">TRAILS</div>
                        <div id="photos-tab">PHOTOS</div>
                    </div>

                </div>
        )
    }
}
