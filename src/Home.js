import React from 'react';
import {Link} from 'react-router'
import axios from 'axios';

export default function(props){
    return (
        <div id="home-data">
            <div id="outer-circle">
                <div id='mid-circle'>
                    <Link to='/profile'>
                        <div id="inner-circle">
                            <div id="km">{props.userData.bio}</div>
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
