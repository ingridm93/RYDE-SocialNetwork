import React from 'react';
import axios from 'axios';
import {Link} from 'react-router'

export default function(props) {

    return (
        <div id="dropdown-menu">

            <ul id="dropdown-menu-list" onClick={props.toggleDropdownMenu}>

                <Link className="dropdown-menu-links" to='/'>
                    <li className="ddmenu-links">Home</li>
                </Link>

                <Link className="dropdown-menu-links" to='/profile'>
                    <li className="ddmenu-links">Edit Profile</li>
                </Link>

                <Link className="dropdown-menu-links" to='/chat'>
                    <li className="ddmenu-links">Chat</li>
                </Link>

                <Link className="dropdown-menu-links" to='/friends'>
                    <li className="ddmenu-links">Friend List</li>
                </Link>

                <Link className="dropdown-menu-links" to='/online'>
                    <li className="ddmenu-links">Online Friends</li>
                </Link>

            </ul>

        </div>
    )
}
