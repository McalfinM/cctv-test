import React from 'react';
import { Alert, Typography } from '@mui/material';

const MessageDisplay = ({ error }) => {
  return (
    <>
      {error?.message ? (
        <Alert style={{ marginBottom: 10 }} severity="error">
          {error.message}
        </Alert>
      ) : (
        <Typography variant="body2" gutterBottom>
          Manage your events below. You can create, edit, or delete events as needed. If you can't edit, delete, or create events, it means you don't have the necessary access permissions.
        </Typography>
      )}
    </>
  );
};

export default MessageDisplay;