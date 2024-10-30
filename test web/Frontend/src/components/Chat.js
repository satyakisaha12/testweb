import React, { useState, useEffect } from 'react';
import socket from '../socket';

function Chat({ room }) {
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState('');

    useEffect(() => {
        socket.emit('join-room', room);

        socket.on('message', (message) => {
            setMessages((prevMessages) => [...prevMessages, message]);
        });
    }, [room]);

    const sendMessage = () => {
        socket.emit('message', { room, message });
        setMessage('');
    };

    return (
        <div>
            <div>
                {messages.map((msg, index) => <div key={index}>{msg}</div>)}
            </div>
            <input value={message} onChange={(e) => setMessage(e.target.value)} />
            <button onClick={sendMessage}>Send</button>
        </div>
    );
}

export default Chat;
