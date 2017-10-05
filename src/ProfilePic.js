import React from 'react';

export default function(props) {
    return (
        <div>
            <img className="profile-picture" src = {props.image} onClick = {props.showImage}/>
        </div>
    )
}
