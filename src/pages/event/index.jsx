// material-ui
import React, { useState } from 'react';
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
import { EditOutlined, DeleteOutlined, CalendarOutlined } from '@ant-design/icons';

// project import
import MainCard from 'components/MainCard';

// SWR for data fetching
import useSWR from 'swr';
import { useEffect } from 'react';
import { get } from 'services';

export default function EventPage({ baseUrl }) {
  const { data: events, error, mutate } = useSWR(baseUrl + 'api/events', get);

  const [open, setOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [name, setName] = useState('');
  const [date, setDate] = useState('');
  const [eventMock, setEventMock] = useState();

  useEffect(() => {
    setTimeout(() => {
      setEventMock([
        { id: 1, name: 'Sample Event', date: '2024-06-15' },
        { id: 2, name: 'Sample Event 2', date: '2024-06-15' },
        { id: 3, name: 'Sample Event 3', date: '2024-06-15' },
        { id: 4, name: 'Sample Event 4', date: '2024-06-15' },
        { id: 5, name: 'Sample Event 5', date: '2024-06-15' },
        { id: 6, name: 'Sample Event 6', date: '2024-06-15' },
        { id: 7, name: 'Sample Event 7', date: '2024-06-15' }
      ]);
    }, 500);
    return () => {};
  }, []);

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

  //   if (error) return <div>Failed to load events</div>;

  return (
    <MainCard title="Event Management">
      <Typography variant="body2" gutterBottom>
        Manage your events below. You can create, edit, or delete events as needed. If you can't edit, delete, or create events, it means
        you don't have the necessary access permissions.
      </Typography>
      <Button variant="contained" color="primary" startIcon={<CalendarOutlined />} onClick={() => handleClickOpen(null)}>
        Create Event
      </Button>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Date</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {!eventMock ? (
            <TableRow>
              <TableCell colSpan={4} align="center">
                <Box display="flex" justifyContent="center" padding={5}>
                  <CircularProgress />
                </Box>
              </TableCell>
            </TableRow>
          ) : (
            eventMock.map((event) => (
              <TableRow key={event.id}>
                <TableCell>{event.id}</TableCell>
                <TableCell>{event.name}</TableCell>
                <TableCell>{event.date}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleClickOpen(event)}>
                    <EditOutlined />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(event.id)}>
                    <DeleteOutlined />
                  </IconButton>
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
          <Button onClick={handleSave} color="primary">
            {editingEvent ? 'Save' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </MainCard>
  );
}
