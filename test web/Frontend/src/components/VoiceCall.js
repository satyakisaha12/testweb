import React, { useRef, useEffect } from 'react';
import socket from '../socket';

function VoiceCall({ callId }) {
    const localStreamRef = useRef(null);
    const remoteStreamRef = useRef(null);
    const peerConnection = new RTCPeerConnection();

    useEffect(() => {
        navigator.mediaDevices.getUserMedia({ audio: true, video: true }).then((stream) => {
            localStreamRef.current.srcObject = stream;
            stream.getTracks().forEach((track) => peerConnection.addTrack(track, stream));
        });

        peerConnection.ontrack = (event) => {
            remoteStreamRef.current.srcObject = event.streams[0];
        };

        socket.on('signal', async (data) => {
            if (data.signal.type === 'offer') {
                await peerConnection.setRemoteDescription(new RTCSessionDescription(data.signal));
                const answer = await peerConnection.createAnswer();
                await peerConnection.setLocalDescription(answer);
                socket.emit('signal', { signal: answer, to: data.from });
            } else if (data.signal.type === 'answer') {
                await peerConnection.setRemoteDescription(new RTCSessionDescription(data.signal));
            }
        });

        return () => {
            peerConnection.close();
        };
    }, [callId]);

    return (
        <div>
            <video ref={localStreamRef} autoPlay muted />
            <video ref={remoteStreamRef} autoPlay />
        </div>
    );
}

export default VoiceCall;
