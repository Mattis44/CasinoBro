import { Avatar, Box, Divider, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useAuthContext } from '../../../auth/hooks';
import { useSocket } from '../../../contexts/socket/ws';

type Message = {
  username: string;
  id_user: string;
  message: string;
  timestamp: string;
};

export default function ChatPage() {
  const { user } = useAuthContext();
  const { socket } = useSocket();
  const [messages, setMessages] = useState<Message[] | undefined>(undefined);

  useEffect(() => {
    if (!socket) return;

    const handleMessage = (message: Message) => {
      setMessages((prevMessages) => {
        if (!prevMessages) return [message];
        return [...prevMessages, message];
      });
    };

    socket.on('chat:receive', handleMessage);

    return () => {
      socket.off('chat:receive', handleMessage);
    };
  }, []);
  return (
    <Box
      sx={{
        width: '100%',
        height: '100%',
        backgroundColor: (theme) => theme.palette.background.paper,
        borderRadius: 1,
      }}
    >
      <Box
        sx={{
          justifyContent: 'center',
          alignItems: 'center',
          display: 'flex',
          mt: 2,
        }}
      >
        <Typography variant="h4" component="h1">
          Chat
        </Typography>
      </Box>
      <Divider sx={{ my: 2 }} />
      <Box
        sx={{
          p: 2,
          height: 'calc(100% - 64px)',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
        }}
      >
        {messages?.map((message, index) => (
          <Box
            key={index}
            sx={{
              padding: 2,
              borderRadius: 1,
              backgroundColor: (theme) => theme.palette.background.default,
              maxWidth: '80%',
              alignSelf: user?.id_user === message.id_user ? 'flex-end' : 'flex-start',
              display: 'flex',
              gap: 1,
              alignItems: 'center',
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Avatar sx={{ width: 32, height: 32, mb: 1 }}>
                {message.username.charAt(0).toUpperCase()}
              </Avatar>
              <Typography variant="caption" component="span">
                {message.username}
              </Typography>
            </div>
            <div>
              <Typography variant="body1" component="p">
                {message.message}
              </Typography>
              <Typography variant="caption" component="span" color="textSecondary">
                {new Date(message.timestamp).toLocaleTimeString()}
              </Typography>
              <Box sx={{ height: '1px', backgroundColor: 'divider', mt: 1 }} />
            </div>
          </Box>
        ))}
      </Box>
    </Box>
  );
}
