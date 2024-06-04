// material-ui
import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  IconButton,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
  CircularProgress,
  Box
} from '@mui/material';

// ant-design icons
import { EditOutlined, DeleteOutlined, UserAddOutlined } from '@ant-design/icons';

// project import
import MainCard from 'components/MainCard';

// SWR for data fetching
import useSWR from 'swr';
import { get } from 'services';

export default function User({ baseUrl }) {
  const { data: users, error, mutate } = useSWR(baseUrl + '/users', get);

  const [open, setOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [userMock, setUserMock] = useState();

  useEffect(() => {
    setTimeout(() => {
      setUserMock([
        { id: 1, name: 'John Doe', email: 'john.doe@example.com' },
        { id: 2, name: 'Jane Smith', email: 'jane.smith@example.com' }
      ]);
    }, 500);
    return () => {};
  }, []);

  const handleClickOpen = (user) => {
    setEditingUser(user);
    setName(user ? user.name : '');
    setEmail(user ? user.email : '');
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingUser(null);
    setName('');
    setEmail('');
  };

  const handleSave = async () => {
    if (editingUser) {
      // Update user
      await fetch(baseUrl + '/users/' + editingUser.id, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email })
      });
    } else {
      // Create new user
      await fetch(baseUrl + '/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email })
      });
    }
    mutate(); // Refresh the data
    handleClose();
  };

  const handleDelete = async (id) => {
    await fetch(baseUrl + '/users/' + id, {
      method: 'DELETE'
    });
    mutate(); // Refresh the data
  };

  return (
    <MainCard title="User Management">
      <Typography variant="body2" gutterBottom>
        Manage your users below. You can create, edit, or delete users as needed. If you can't edit, delete, or create users, it means you
        don't have the necessary access permissions.
      </Typography>
      <Button variant="contained" color="primary" startIcon={<UserAddOutlined />} onClick={() => handleClickOpen(null)}>
        Create User
      </Button>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {!userMock ? (
            <TableRow>
              <TableCell colSpan={4} align="center">
                <Box display="flex" justifyContent="center" padding={5}>
                  <CircularProgress />
                </Box>
              </TableCell>
            </TableRow>
          ) : (
            userMock.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.id}</TableCell>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleClickOpen(user)}>
                    <EditOutlined />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(user.id)}>
                    <DeleteOutlined />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{editingUser ? 'Edit User' : 'Create User'}</DialogTitle>
        <DialogContent>
          <TextField autoFocus margin="dense" label="Name" type="text" fullWidth value={name} onChange={(e) => setName(e.target.value)} />
          <TextField margin="dense" label="Email" type="email" fullWidth value={email} onChange={(e) => setEmail(e.target.value)} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleSave} color="primary">
            {editingUser ? 'Save' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </MainCard>
  );
}
