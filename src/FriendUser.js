import React from 'react';

export default function Friend ({friend, accept, end}) {
    return (
        <div>
            <img src={friend.image} />
            {friend.first} {friend.last}
            <div>
                {friend.status === 1 && <button onClick={() => accept(friend.id)}>Accept Friend Request</button>}
                {(friend.status === 2 && <button onClick={() => unfriend(friend.id)}> Unfriend </button>)}
            </div>
        </div>
    )
}
