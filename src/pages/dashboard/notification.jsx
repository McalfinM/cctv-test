import React from 'react';

const Notification = ({ message, type }) => {
  const notificationStyle = {
    position: 'fixed',
    top: 20,
    right: 20,
    padding: 10,
    backgroundColor: type === 'error' ? 'red' : 'green',
    color: 'white',
    zIndex: 100,
  };

  return <div style={notificationStyle}>{message}</div>;
};

export default Notification;