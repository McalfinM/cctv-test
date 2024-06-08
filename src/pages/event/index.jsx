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
import { get, getAdminAccess, getToken, getUser, post } from 'services';
import { useNavigate } from 'react-router';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import MessageDisplay from 'components/MessageDisplay';

export default function Event({ baseUrl }) {

  useEffect(() => {
    if (!getToken()) window.location.href = '/login';
  }, []);

  const userAccess = getUser()?.userData?.acl?.find(menu => menu?.menuName === 'event') || getAdminAccess();

  const { data: listEventType } = useSWR(baseUrl + '/api/filter-helper/event-type', get);
  const { data: listPanel } = useSWR(baseUrl + '/api/filter-helper/panel', get);
  // const { data: listReader } = useSWR(baseUrl + '/api/filter-helper/reader', get);
  // const { data: listDepartment } = useSWR(baseUrl + '/api/filter-helper/department', get);
  const { data: listDoor } = useSWR(baseUrl + '/api/filter-helper/door', get);


  const [events, setEvents] = useState([]);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [name, setName] = useState('');
  const [date, setDate] = useState('');
  const [loading, setLoading] = useState(false);

  const [dateSelected, setDateSelected] = useState({
    from: null,
    to: null
  });
  const [filters, setFilters] = useState({
    page: 1,
    pageSize: 10,
    iEventType: '',
    IdPanel: '',
    IdDoor: '',
    date: {
      from: null,
      to: null
    }
  });

  useEffect(() => {
    getEvent(filters)
  }, [])

  const getEvent = (payload) => {
    setLoading(true)
    post(baseUrl + '/api/event/list', payload)
      .then(response => {
        setEvents(response?.data ?? [])
      })
      .catch(error => {
        setEvents([])
        setError(error)
        // console.log('Error creating event:', error);
      }).finally(() => {
        setLoading(false)
      })
  }

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

  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setFilters({
      ...filters,
      [name]: value
    });
  };

  const handleResetFilter = () => {
    let resetPayload = {
      page: 1,
      pageSize: 10,
      iEventType: '',
      IdPanel: '',
      IdDoor: '',
      date: {
        from: null,
        to: null
      }
    }
    setDateSelected({
      from: null,
      to: null
    })
    setFilters(resetPayload)
    setShowFilter(false)
    getEvent(resetPayload)
  }
  const handleApplyFilter = () => {
    setShowFilter(false)
    getEvent(filters)
  }

  const handleDateChange = (date, name) => {
    const formattedDate = new Date(date).toISOString().split('T')[0];
    setFilters({
      ...filters,
      date: {
        ...filters.date,
        [name]: formattedDate
      }
    });

    setDateSelected({
      ...dateSelected,
      [name]: date
    });
  };

  return (
    <MainCard title="Event Management">
      <MessageDisplay error={error} />
      <Grid container justifyContent="space-between" alignItems="center" mb={2}>

        <Button disabled={!userAccess?.canCreate} variant="contained" color="primary" startIcon={<CalendarOutlined />} onClick={() => handleClickOpen(null)}>
          Create Event
        </Button>

        <IconButton onClick={() => setShowFilter(!showFilter)}>
          <FilterOutlined />
        </IconButton>
      </Grid>

      {showFilter ?

        <Grid container justifyContent="flex-end" alignItems="center" mb={2} gap={1} style={{ flexGrow: 1 }}>
          <Grid item>
            <FormControl fullWidth style={{ minWidth: 120 }}>
              <InputLabel>Event Type</InputLabel>
              <Select
                name="iEventType"
                value={filters.iEventType}
                onChange={handleFilterChange}
              >
                {listEventType?.map((option, idx) => (
                  <MenuItem key={idx} value={option.id}>
                    {option.text}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item>
            <FormControl fullWidth style={{ minWidth: 120 }}>
              <InputLabel>Panel</InputLabel>
              <Select
                name="IdPanel"
                value={filters.IdPanel}
                onChange={handleFilterChange}
              >
                {listPanel?.map((option, idx) => (
                  <MenuItem key={idx} value={option.id}>
                    {option.text}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item>
            <FormControl fullWidth style={{ minWidth: 120 }}>
              <InputLabel>Door</InputLabel>
              <Select
                name="IdDoor"
                value={filters.IdDoor}
                onChange={handleFilterChange}
              >
                {listDoor?.map((option, idx) => (
                  <MenuItem key={idx} value={option.id}>
                    {option.text}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item>
            <FormControl fullWidth style={{ width: filters.date.from ? 150 : 125 }}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Start Date"
                  value={dateSelected.from}
                  onChange={(date) => handleDateChange(date, 'from')}
                  renderInput={(params) => <FormControl fullWidth {...params} />}
                />
              </LocalizationProvider>
            </FormControl>
          </Grid>
          <Grid item>
            <FormControl fullWidth style={{ width: filters.date.to ? 150 : 125 }}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="End Date"
                  value={dateSelected.to}
                  onChange={(date) => handleDateChange(date, 'to')}
                  renderInput={(params) => <FormControl fullWidth {...params} />}
                />
              </LocalizationProvider>
            </FormControl>
          </Grid>
          <Grid item>
            <Button variant="contained" color="primary" onClick={handleApplyFilter}>
              Apply
            </Button>
          </Grid>
          <Grid item>
            <Button variant="outlined" color="error" onClick={handleResetFilter}>
              Reset
            </Button>
          </Grid>
        </Grid>
        : null
      }
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
          {loading ? (
            <TableRow>
              <TableCell colSpan={4} align="center">
                <Box display="flex" justifyContent="center" padding={5}>
                  <CircularProgress />
                </Box>
              </TableCell>
            </TableRow>
          ) : (
            events?.length ? (
              events?.map((event, index) => (
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
            ) : (
              <TableRow>
                <TableCell colSpan={10} align="center">
                  No data available
                </TableCell>
              </TableRow>
            )
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
    </MainCard >
  );
}