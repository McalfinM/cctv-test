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
import { EditOutlined, DeleteOutlined, CalendarOutlined } from '@ant-design/icons';
import MainCard from 'components/MainCard';
import useSWR from 'swr';
import Storage from 'utils/storage';
import { post } from 'services';

export default function Event({ baseUrl }) {
  // const { data: events, error, mutate } = useSWR(post(baseUrl + '/events', { 'sasa': 'sasa' }));
  const [events, setEvents] = useState([]);
  const [open, setOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [name, setName] = useState('');
  const [date, setDate] = useState('');
  const [userAccess, setUserAccess] = useState(null);
  const user = Storage.get('user');
  const payload = {
    page: 1,
    pageSize: 10,
    iEventType: 97, // Opsional
    IdPanel: 0, // Opsional
    IdDoor: 0, // Opsional
    date: { // Opsional
      from: "",
      to: ""
    }
  };

  useEffect(() => {

    post(baseUrl + '/api/event/list', { page: payload.page, pageSize: payload.pageSize,  
      iEventType: 97, // Opsional
      IdPanel: 0, // Opsional
      IdDoor: 0, // Opsional
      date: { // Opsional
      from: "",
      to: ""
    } })
      .then(response => {
        console.log('Event created:', response);
        setEvents(response?.data ?? [])
      })
      .catch(error => {
        console.error('Error creating event:', error);
      });
  }, [])


  useEffect(() => {
    if (user?.userData?.acl?.length === 0) {
      setUserAccess({ canCreate: true, canEdit: true, canDelete: true });
      console.log('superadmin')
    } else if (user?.userData?.acl?.length) {
      console.log('admin')

      const access = user.userData.acl.find(menu => menu.menuName === 'event');
      setUserAccess(access);
    }
  }, []); // Empty dependency array ensures the effect runs only once


  const handleClickOpen = (event) => {
    setEditingEvent(event);
    setName(event ? event.name : '');
    setDate(event ? event.date : '');
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingEvent(null);
    setName('');
    setDate('');
  };

  const handleSave = async () => {
    if (editingEvent) {
      // Update event
      await fetch(baseUrl + '/events/' + editingEvent.id, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, date })
      });
    } else {
      // Create new event
      await fetch(baseUrl + '/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, date })
      });
    }
    mutate(); // Refresh the data
    handleClose();
  };

  const handleDelete = async (id) => {
    await fetch(baseUrl + '/events/' + id, {
      method: 'DELETE'
    });
    mutate(); // Refresh the data
  };

  return (
    <MainCard title="Event Management">
      <Typography variant="body2" gutterBottom>
        Manage your events below. You can create, edit, or delete events as needed. If you can't edit, delete, or create events, it means you don't have the necessary access permissions.
      </Typography>
      {(userAccess?.canCreate || userAccess?.canEdit || userAccess?.canDelete) && (
        <Button variant="contained" color="primary" startIcon={<CalendarOutlined />} onClick={() => handleClickOpen(null)}>
          Create Event
        </Button>
      )}
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Id Panel</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {!events && !userAccess ? (
            <TableRow>
              <TableCell colSpan={4} align="center">
                <Box display="flex" justifyContent="center" padding={5}>
                  <CircularProgress />
                </Box>
              </TableCell>
            </TableRow>
          ) : (
            events.map((event, index) => (
              <TableRow key={event.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{event.eventTypeString}</TableCell>
                <TableCell>{event.IdPanel}</TableCell>
                <TableCell>
                  {(userAccess?.canEdit || userAccess?.canDelete) && (
                    <>
                      <IconButton onClick={() => handleClickOpen(event)}>
                        <EditOutlined />
                      </IconButton>
                      <IconButton onClick={() => handleDelete(event.id)}>
                        <DeleteOutlined />
                      </IconButton>
                    </>
                  )}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{editingEvent ? 'Edit Event' : 'Create Event'}</DialogTitle>
        <DialogContent>
          <TextField autoFocus margin="dense" label="Name" type="text" fullWidth value={name} onChange={(e) => setName(e.target.value)} />
          <TextField
            margin="dense"
            label="Date"
            type="date"
            fullWidth
            value={date}
            onChange={(e) => setDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">
            Cancel
          </Button>
          {(userAccess?.canCreate || userAccess?.canEdit) && (
            <Button onClick={handleSave} color="primary">
              {editingEvent ? 'Save' : 'Create'}
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </MainCard>
  );
}