import React from 'react';
import ReactDOM from 'react-dom';
import {Router, Route, Link, IndexRoute, hashHistory, browserHistory} from 'react-router';

import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import reduxPromise from 'redux-promise';
import reducer from './reducers';
import GetFriends from './FriendsList';
import OnlineUsers from './onlineUsers';
import Chat from './Chat';


export const store = createStore(reducer, applyMiddleware(reduxPromise));


store.subscribe(() => console.log(store.getState()));



import Welcome from './Welcome';
import Registration from './Registration';
import Login from './Login';
import Home from './Home';
import App from './App';
import Profile from './Profile';
import friendProfile from './friendProfile';



const preRouter = (
    <Router history={hashHistory}>
        <Route path='/' component={Welcome}>
            <IndexRoute component={Registration} />
            <Route path='/login' component={Login} />
        </Route>
    </Router>
);

const postRouter = (
    <Provider store={store}>
        <Router history={browserHistory}>
            <Route path='/' component={App}>
                <IndexRoute component={Home} />
                <Route path='profile' component={Profile} />
                <Route path='user/:id' component={friendProfile} />
                <Route path='friends' component={GetFriends} />
                <Route path='online' component={OnlineUsers}/>
                <Route path='chat' component={Chat}/>
            </Route>
        </Router>
    </Provider>
);




let path

if(location.pathname !== '/welcome') {
    path = postRouter
} else {
    path = preRouter;
}

ReactDOM.render(
    path,
    document.querySelector('main')
)
