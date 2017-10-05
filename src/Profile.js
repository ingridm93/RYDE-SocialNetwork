import React from 'react';
import {Link} from 'react-router'
import axios from 'axios';
import Upload from './Upload';

export default class Profile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.setImage = this.setImage.bind(this);
        this.showImage = this.showImage.bind(this);
        this.showUploader = this.showUploader.bind(this);
    }


    handleChange(e) {

      this.setState({
          [e.target.name] : e.target.value
      });
    }

    handleSubmit(e) {
        const {bio} = this.state

        if(bio) {

            axios.post('/edit', {
                bio
            })
            .then((res) => {
                const data = res.data;
                if(!data.success) {
                    error: true
                } else {
                    var newBio = this.props.userData.bio;
                    this.setState({
                        bio: newBio
                    })
                    location.replace('/');
                }
            })
        } else {
            alert('No description was entered. Please try again!');
        }
    }

    showImage() {
        this.setState({
            imageIsVisible: true
        })
    }

    showUploader() {

        this.setState({
             uploaderIsVisible: true
        })
     }


    setImage(img){
        console.log('image is clicked on')
        this.setState({
            uploaderIsVisible: false,
            image: img
        });
    }


    render() {

        return (
            <div id="edit-profile">
                <div id="edit-profile-container">

                    <h2 className="profile-greetings"> Hi {this.props.userData.first} :D</h2>


                    <h3 id="km-update"> Update your Km travelled. </h3>

                    <div id="outer-square">
                        <div id='mid-square'>
                            <textarea id="km-text" name="bio" placeholder="Type here.." cols="30" rows="5" onChange={e => this.handleChange(e)}></textarea>
                        </div>
                    </div>

                    <button className="submit-button" onClick={e => this.handleSubmit(e)}> Submit </button>

                    <div id="upload-container">
                        <h1 className="changepp-title">Change Profile Picture </h1>
                        <button className="upload-button" onClick={e => this.showUploader(e)}> Change Profile Picture </button>
                        {this.state.uploaderIsVisible && <Upload setImage = {this.setImage}/>}
                    </div>
                </div>
            </div>

        )
    }
}
