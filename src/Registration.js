import React from 'react';
import axios from 'axios';
import {Link} from 'react-router'


export default class Register extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    handleChange(e) {

        this.setState({
            [e.target.name] : e.target.value
        });
    }

    handleSubmit(e) {
        const {first, last, email, password} = this.state;

        if (first && last && email && password) {

            axios.post('/register', {
                first, last, email, password
            })
            .then((res) => {
                console.log(res);
                const data = res.data;
                if(!data.success) {
                    error: true
                } else {
                    location.replace('/');
                }
            })
            .catch((err) => {
                console.log(err);
            })
        } else {
            alert('Something went wrong. Please try again.');
        }

    }

    render() {
        return (
            <div className="reg-input-container">

                <h3 className="signup-title">PLEASE SIGN UP</h3>
                    <input className="reg-input" name="first" placeholder="First Name" onChange={e => this.handleChange(e)}/>
                    <input className="reg-input" name="last" placeholder="Last Name" onChange={e => this.handleChange(e)}/>
                    <input className="reg-input" name="email" placeholder="E-mail" onChange={e => this.handleChange(e)}/>
                    <input className="reg-input" name="password" placeholder="Password" type="password" onChange={e => this.handleChange(e)}/>
                    <button className="reg-button" onClick={e => this.handleSubmit(e)}> Submit </button>
                    <Link className="wel-links" to='/login'>Login</Link>
            </div>

        )
    }
}
