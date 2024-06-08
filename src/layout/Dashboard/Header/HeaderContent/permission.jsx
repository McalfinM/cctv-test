import React, { useEffect, useState } from 'react';

export default function NotificationExample() {
  const [permission, setPermission] = useState(Notification.permission);

  useEffect(() => {
    if (Notification.permission !== 'granted') {
      Notification.requestPermission().then((permission) => {
        setPermission(permission);
      });
    }
  }, []);

  const showNotification = (message) => {
    if (permission === 'granted') {
      new Notification('New Notification', {
        body: message,
        icon: '' // optional
      });
    } else {
      alert('Notifications are not enabled.');
    }
  };

  return (
    <div>
      <button onClick={() => showNotification('This is a test notification')}>
        Show Notification
      </button>
    </div>
  );
}