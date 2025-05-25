import PropTypes from 'prop-types';
import { createContext, useContext, useEffect, useMemo, useRef } from 'react';
import { io } from 'socket.io-client';
import { useAuthContext } from 'src/auth/hooks';


const SocketContext = createContext({ socket: null });

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
    const socketRef = useRef(null);
    const { user } = useAuthContext();

    useEffect(() => {
        const socket = io("http://localhost:3000", {
            auth: {
                token: user?.access_token,
                oauthType: localStorage.getItem("connection_type") || "classic",
            }
        })
        socketRef.current = socket;

        socket.on("connect", () => {
            console.log("Socket connected:", socket.id);
        });

        return () => {
            if (socketRef.current) {
                socketRef.current.disconnect();
                console.log("Socket disconnected");
            }
        };
    })


    const socketValue = useMemo(() => ({ socket: socketRef.current }), []);

    return (
        <SocketContext.Provider value={socketValue}>
            {children}
        </SocketContext.Provider>
    );
}

SocketProvider.propTypes = {
    children: PropTypes.node.isRequired,
};