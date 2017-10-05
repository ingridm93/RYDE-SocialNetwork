import React from 'react';

export default function (props) {

    return (
        <div id="welcome">
            <h3>WELCOME TO</h3>

            <h1 id="ryde">RYDE</h1>

            {props.children}

        </div>

    )
}
