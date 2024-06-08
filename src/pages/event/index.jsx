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
  Grid,
  Popover,
  FormControl,
  InputLabel
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

  const { data: listEventType } = useSWR(baseUrl + '/api/filter-helper/event-type', get);
  const { data: listPanel } = useSWR(baseUrl + '/api/filter-helper/panel', get);
  const { data: listReader } = useSWR(baseUrl + '/api/filter-helper/reader', get);
  const { data: listDepartment } = useSWR(baseUrl + '/api/filter-helper/department', get);
  // const { data: listDoor } = useSWR(baseUrl + '/api/filter-helper/door', get);


  const [events, setEvents] = useState([]);
  const [open, setOpen] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
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
    mutate();
    handleClose();
  };

  const handleDelete = async (id) => {
    await fetch(baseUrl + '/events/' + id, {
      method: 'DELETE'
    });
    mutate();
  };


  const [anchorEl, setAnchorEl] = useState(null);
  const [filters, setFilters] = useState({
    eventType: '',
    panel: '',
    reader: '',
    department: '',
    // door: ''
  });

  const handleFilterIconClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseFilter = () => {
    setAnchorEl(null);
  };

  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setFilters({
      ...filters,
      [name]: value
    });
  };

  const handleResetFilter = () => {
    setShowFilter(false)
  }


  return (
    <MainCard title="Event Management">
      <Typography variant="body2" gutterBottom>
        Manage your events below. You can create, edit, or delete events as needed. If you can't edit, delete, or create events, it means you don't have the necessary access permissions.
      </Typography>
      <Grid container justifyContent="space-between" alignItems="center" mb={2}>
        <Button disabled={!userAccess?.canCreate} variant="contained" color="primary" startIcon={<CalendarOutlined />} onClick={() => handleClickOpen(null)}>
          Create Event
        </Button>

        {!showFilter ?
          <IconButton onClick={() => setShowFilter(!showFilter)}>
            <FilterOutlined />
          </IconButton>
          :
          <Grid item style={{ flexGrow: 1 }}>
            <Grid container justifyContent="flex-end" alignItems="center" spacing={2}>
              {!showFilter ? (
                <IconButton onClick={() => setShowFilter(!showFilter)}>
                  <FilterOutlined />
                </IconButton>
              ) : (
                <>
                  <Grid item>
                    <FormControl fullWidth style={{ minWidth: 120 }}>
                      <InputLabel>Event Type</InputLabel>
                      <Select
                        name="eventType"
                        value={filters.eventType}
                        onChange={handleFilterChange}
                      >
                        {listEventType?.map((option, idx) => (
                          <MenuItem key={idx} value={option.value}>
                            {option.label}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item>
                    <FormControl fullWidth style={{ minWidth: 120 }}>
                      <InputLabel>Panel</InputLabel>
                      <Select
                        name="panel"
                        value={filters.panel}
                        onChange={handleFilterChange}
                      >
                        {listPanel?.map((option, idx) => (
                          <MenuItem key={idx} value={option.value}>
                            {option.label}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item>
                    <FormControl fullWidth style={{ minWidth: 120 }}>
                      <InputLabel>Reader</InputLabel>
                      <Select
                        name="reader"
                        value={filters.reader}
                        onChange={handleFilterChange}
                      >
                        {listReader?.map((option, idx) => (
                          <MenuItem key={idx} value={option.value}>
                            {option.label}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item>
                    <FormControl fullWidth style={{ minWidth: 120 }}>
                      <InputLabel>Department</InputLabel>
                      <Select
                        name="department"
                        value={filters.department}
                        onChange={handleFilterChange}
                      >
                        {listDepartment?.map((option, idx) => (
                          <MenuItem key={idx} value={option.id}>
                            {option.text}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid item>
                    <Button variant="contained" color="primary" onClick={handleClose}>
                      Apply
                    </Button>
                  </Grid>
                  <Grid item>
                    <Button variant="outlined" color="error" onClick={handleResetFilter}>
                      Reset
                    </Button>
                  </Grid>
                </>
              )}
            </Grid>
          </Grid>

        }
      </Grid>
      {/* <Popover
        id='eventFilter'
        open={showFilter}
        onClose={() => setShowFilter(false)}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        // transformOrigin={{
        //   vertical: 'top',
        //   horizontal: 'right',
        // }}
      >
        <Grid container spacing={2} style={{ padding: '16px', maxWidth: '300px' }}>
         
          <Grid item xs={12} style={{ textAlign: 'center' }}>
            <Button variant="contained" color="primary" onClick={handleClose}>
              Apply Filters
            </Button>
          </Grid>
        </Grid>
      </Popover> */}

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