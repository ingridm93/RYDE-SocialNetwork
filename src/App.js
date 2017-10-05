import React from 'react';
import axios from 'axios';
import {Link} from 'react-router'
import ProfilePic from './ProfilePic';
import Home from './Home';
import PPView from './PPView';
import DropdownMenu from './DropdownMenu';
import Profile from './Profile';
import OnlineUsers from './onlineUsers';
import {connect} from 'react-redux'
import {newUserOnline} from './actions';

class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            currImg: 0
        };
        this.showImage = this.showImage.bind(this);
        this.nextImg = this.nextImg.bind(this);
        this.toggleDropdownMenu = this.toggleDropdownMenu.bind(this);
        this.showImage = this.showImage.bind(this);

    }


    componentDidMount() {
        axios.get('/api/').then((userData) => {

            this.setState(userData.data.user);
        });
        this.props.newUserOnline();
    }

    showImage() {
        this.setState({
            imageIsVisible: !this.state.imageIsVisible
        })
    }

    toggleDropdownMenu() {
        this.setState({
            ddMenuIsVisible: !this.state.ddMenuIsVisible
        })
    }

    nextImg() {

        if(this.state.currImg === this.state.images.length-1) {
            this.setState({
                currImg: 0
            })
        } else {
            this.setState({
                currImg: this.state.currImg + 1

            })
        }

    }


    render() {
        const children = React.cloneElement(this.props.children, {
            userData: this.state,
            nextImg: this.nextImg,
            currImg: this.state.currImg,
            showDropdownMenu: this.showDropdownMenu
        });
        return (
            <div onClick={e => {
                this.setState({
                    ddMenuIsVisible: false
                })
            }}>

                <div id='nav-bar'>

                    <h1 id="logo">
                        <Link className="dropdown-menu-links" to='/'>.RYDE.</Link>
                    </h1>

                    <div id="nav-user">

                        <ProfilePic showImage={this.showImage} first={this.state.first} last={this.state.last} image={this.state.image}/>

                        <Link className="dropdown-menu-links" to='/'><div id="user-name"> {this.state.first} {this.state.last} </div></Link>

                    </div>

                    <img id="menu" src = '/menu.png' onClick={e => {
                        this.toggleDropdownMenu(e)
                        e.stopPropagation();
                        }
                    }/>

                </div>

                {this.state.ddMenuIsVisible && <DropdownMenu toggleDropdownMenu={this.toggleDropdownMenu} />}


                {children}

                {this.state.imageIsVisible && <PPView image={this.state.images[this.state.currImg]} id={this.state.id} nextImg={this.nextImg} showImage={this.showImage}/> }


            </div>
        )
    }
}

function mapStateToProps(state){
    return {
        socket: state.socket
    }
}

export default connect(mapStateToProps, {newUserOnline})(App)
