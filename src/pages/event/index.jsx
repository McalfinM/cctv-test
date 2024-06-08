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
  Box,
  Toolbar,
  Select,
  Tooltip,
  MenuItem,
  Paper,
  Grid
} from '@mui/material';

import { EditOutlined, DeleteOutlined, CalendarOutlined, FilterOutlined } from '@ant-design/icons';
import MainCard from 'components/MainCard';
import useSWR from 'swr';
import { } from 'utils/storage';
import { adminAccess, checkMe, get, post, token, user } from 'services';
import { useNavigate } from 'react-router';
export default function Event({ baseUrl }) {

  useEffect(() => {
    if (!token) window.location.href = '/login'
  }, []);

  const userAccess = user?.userData?.acl?.find(menu => menu?.menuName === 'event') || adminAccess;

  const [events, setEvents] = useState([]);
  const [open, setOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [name, setName] = useState('');
  const [date, setDate] = useState('');
  const [filter, setFilter] = useState('');
  const [filteredEvents, setFilteredEvents] = useState(events);

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
    post(baseUrl + '/api/event/list', {
      page: payload.page, pageSize: payload.pageSize,
      iEventType: 97, // Opsional
      IdPanel: 0, // Opsional
      IdDoor: 0, // Opsional
      date: { // Opsional
        from: "",
        to: ""
      }
    }).then(response => {
      // console.log('Event created:', response);
      setEvents(response?.data ?? [])
    })
      .catch(error => {
        // console.log('Error creating event:', error);
      });
  }, [])

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



  // Function to handle filter change
  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  // Function to apply the filter
  const applyFilter = () => {
    if (filter) {
      setFilteredEvents(events.filter((event) => event.eventTypeString === filter));
    } else {
      setFilteredEvents(events);
    }
  };


  return (
    <MainCard title="Event Management">
      <Typography variant="body2" gutterBottom>
        Manage your events below. You can create, edit, or delete events as needed. If you can't edit, delete, or create events, it means you don't have the necessary access permissions.
      </Typography>
      <Grid container justifyContent="space-between" alignItems="center" mb={2}>
        <Button disabled={!userAccess?.canCreate} variant="contained" color="primary" startIcon={<CalendarOutlined />} onClick={() => handleClickOpen(null)}>
          Create Event
        </Button>
        <IconButton>
          <FilterOutlined />
        </IconButton>
      </Grid>

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
          {!events ? (
            <TableRow>
              <TableCell colSpan={4} align="center">
                <Box display="flex" justifyContent="center" padding={5}>
                  <CircularProgress />
                </Box>
              </TableCell>
            </TableRow>
          ) : (
            events.map((event, index) => (
              <TableRow key={index}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{event.eventTypeString}</TableCell>
                <TableCell>{event.IdPanel}</TableCell>
                <TableCell>
                  <IconButton disabled={!userAccess?.canEdit} onClick={() => handleClickOpen(event)}>
                    <EditOutlined />
                  </IconButton>
                  <IconButton disabled={!userAccess?.canDelete} onClick={() => handleDelete(event.id)}>
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