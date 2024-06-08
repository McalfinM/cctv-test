import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import { Snackbar, Alert } from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import Box from '@mui/material/Box';

// project import
import Search from './Search';
import Profile from './Profile';
import MobileSection from './MobileSection';

const socket = io('http://localhost:4000'); // Replace with your backend server address

export default function HeaderContent() {
  const downLG = useMediaQuery((theme) => theme.breakpoints.down('lg'));

  const [notifications, setNotifications] = useState([]);
  const [permission, setPermission] = useState(Notification.permission);

  useEffect(() => {
    if (Notification.permission !== 'granted') {
      Notification.requestPermission().then((perm) => {
        console.log('Notification permission:', perm); // Log the permission result
        setPermission(perm);
      });
    } else {
      setPermission(Notification.permission);
    }

    socket.on('connect', () => {
      console.log('Socket connected:', socket.id); // Log when socket connects
    });

    socket.on('receive-notification', (notification) => {
      console.log('Notification received:', notification); // Log received notification

      setNotifications((prevNotifications) => [
        ...prevNotifications,
        { ...notification, open: true }
      ]);

      if (permission === 'granted') {
        new Notification('New Notification', {
          body: notification.message,
          icon: '/path-to-your-icon/icon.png' // optional
        });
      }
    });

    socket.on('disconnect', () => {
      console.log('Socket disconnected'); // Log when socket disconnects
    });

    return () => {
      socket.disconnect(); // Clean up socket connection on unmount
    };
  }, [permission]);

  const handleClose = (index) => (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setNotifications((prevNotifications) =>
      prevNotifications.map((notification, i) =>
        i === index ? { ...notification, open: false } : notification
      )
    );
  };

  return (
    <>
      {!downLG && <Search />}
      {downLG && <Box sx={{ width: '100%', ml: 1 }} />}
      {!downLG && <Profile />}
      {downLG && <MobileSection />}

      {/* In-app Notifications */}
      {notifications.map((notification, index) => (
        <Snackbar
          key={index}
          open={notification.open}
          autoHideDuration={6000}
          onClose={handleClose(index)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <Alert severity="warning" onClose={handleClose(index)}>
            {notification.message}
          </Alert>
        </Snackbar>
      ))}
    </>
  );
}
