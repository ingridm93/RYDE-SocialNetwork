import React,{Component} from 'react'
import {connect} from 'react-redux'
// import getSocket from './socketIO'

class Chat extends Component {

    constructor(props){
        super(props)
        this.state = {}

        this.handleSendButton = this.handleSendButton.bind(this)
        this.emitMessage = this.emitMessage.bind(this)
    }

    handleChange(e) {

        this.setState({
            message : e.target.value
        });
    }

    emitMessage(e) {

        if(e.key === 'Enter') {

            e.preventDefault();


            this.props.socket.emit('newMessage', this.state.message
            );
            e.target.value = ''
        }
    }



    handleSendButton(e) {

        this.props.socket.emit('newMessage', this.state.message);

            e.target.value = ''

    }

    componentDidUpdate(){
       this.messageBox.scrollTop = this.messageBox.scrollHeight;
   }


    render () {
        const {chatMessages} = this.props;

        if(!chatMessages) { return null }

        const messages = (
            <div id="message-box" ref={elem => this.messageBox = elem}>
                {chatMessages.map(message => (
                    <li id="message">
                        <div id="chat-userinfo"><img id="chat-img" src={message.image}/> {message.first} {message.last}</div>

                        <p id="chat-message">{message.message}</p>

                    </li>
                    )
                )}
            </div>
        );

        return (
            <div>
                <h1 id="chat-title">Chat Messages</h1>

                {chatMessages && messages}
                <textarea id="chat-text-area" name="typeMessage" placeholder="Type a message here" onChange={e => this.handleChange(e)} onKeyPress={this.emitMessage}></textarea>

                <button id="chat-send-btn" onClick={this.handleSendButton}>Send</button>

            </div>
        )

    }
}

function mapStateToProps(state){
    return {
        chatMessages: state.chatMessages,
        socket: state.socket
    }
}

export default connect(mapStateToProps)(Chat)
