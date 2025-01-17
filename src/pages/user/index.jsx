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
import { get, post } from 'services';

export default function User({ baseUrl }) {
  const [open, setOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [groupId, setGroupId] = useState('');
  const [userMock, setUserMock] = useState();

  const payload = {
    page: 1,
    pageSize: 10,
    
  };
  

  useEffect(() => {
    post(baseUrl + '/api/employee/list', {
      page: payload.page,
      pageSize: payload.pageSize,
    })
      .then(response => {
        console.log(response, 'ress');
        setUserMock(response?.data ?? []);
      })
      .catch(error => {
        console.error('Error fetching users:', error);
      });
  }, []);

  const handleClickOpen = (user) => {
    setEditingUser(user);
    setUsername(user ? user.tFirstName : '');
    setEmail(user ? user.email : '');
    setPassword('');
    setGroupId(user ? user.groupId : '');
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingUser(null);
    setUsername('');
    setEmail('');
    setPassword('');
    setGroupId('');
  };

  const handleSave = async () => {
    if (editingUser) {
      // Update user
      await fetch(baseUrl + '/users/' + editingUser.id, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, groupId })
      });
    } else {
      // Create new user
      await post(baseUrl + '/api/auth/register', {
        username, password, email, groupId: Number(groupId)
      });
    }
    // Refresh the data
    post(baseUrl + '/api/employee/list', {
      page: payload.page,
      pageSize: payload.pageSize,
    })
      .then(response => {
        setUserMock(response?.data ?? []);
      })
      .catch(error => {
        console.error('Error fetching users:', error);
      });
    handleClose();
  };

  const handleDelete = async (id) => {
    await fetch(baseUrl + '/users/' + id, {
      method: 'DELETE'
    });
    // Refresh the data
    post(baseUrl + '/api/employee/list', {
      page: payload.page,
      pageSize: payload.pageSize,
    })
      .then(response => {
        setUserMock(response?.data ?? []);
      })
      .catch(error => {
        console.error('Error fetching users:', error);
      });
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
            <TableCell>Department</TableCell>
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
            userMock.map((user, index) => (
              <TableRow key={user.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{user.tFirstName + ' ' + user.tLastName}</TableCell>
                <TableCell>{user.tblDepartment.tDescDepartment}</TableCell>
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
          <TextField autoFocus margin="dense" label="Username" type="text" fullWidth value={username} onChange={(e) => setUsername(e.target.value)} />
          <TextField margin="dense" label="Email" type="email" fullWidth value={email} onChange={(e) => setEmail(e.target.value)} />
          <TextField margin="dense" label="Password" type="password" fullWidth value={password} onChange={(e) => setPassword(e.target.value)} />
          <TextField margin="dense" label="Group ID" type="text" fullWidth value={groupId} onChange={(e) => setGroupId(e.target.value)} />
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
