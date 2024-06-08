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
  Typography,
  CircularProgress,
  Box,
  TextField
} from '@mui/material';

// ant-design icons
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';

// project import
import MainCard from 'components/MainCard';

// SWR for data fetching
import useSWR from 'swr';
import { useEffect } from 'react';
import { adminAccess, get, token, user } from 'services';

export default function Log({ baseUrl }) {

  useEffect(() => {
    if (!token) window.location.href = '/login'
  }, []);

  const userAccess = user?.userData?.acl?.find(menu => menu?.menuName === 'log') || adminAccess;

  const { data: logs, error, mutate } = useSWR(baseUrl + '/logs', get);

  const [open, setOpen] = useState(false);
  const [editingLog, setEditingLog] = useState(null);
  const [logData, setLogData] = useState('');
  const [logMock, setLogMock] = useState();

  useEffect(() => {
    setTimeout(() => {
      // Mock data
      setLogMock([
        { id: 1, logData: 'Log 1 data' },
        { id: 2, logData: 'Log 2 data' },
        { id: 3, logData: 'Log 3 data' },
        { id: 4, logData: 'Log 4 data' },
        { id: 5, logData: 'Log 5 data' }
      ]);
    }, 500);
    return () => { };
  }, []);

  const handleClickOpen = (log) => {
    setEditingLog(log);
    setLogData(log ? log.logData : '');
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingLog(null);
    setLogData('');
  };

  const handleSave = async () => {
    if (editingLog) {
      // Update log
      await fetch(baseUrl + '/logs/' + editingLog.id, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ logData })
      });
    } else {
      // Create new log
      await fetch(baseUrl + '/logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ logData })
      });
    }
    mutate(); // Refresh the data
    handleClose();
  };

  const handleDelete = async (id) => {
    await fetch(baseUrl + '/logs/' + id, {
      method: 'DELETE'
    });
    mutate(); // Refresh the data
  };

  return (
    <MainCard title="Log Management">
      <Typography variant="body2" gutterBottom>
        Manage your logs below. You can create, edit, or delete logs as needed. If you can't edit, delete, or create logs, it means you
        don't have the necessary access permissions.
      </Typography>
      <Button disabled={!userAccess?.canCreate} variant="contained" color="primary" onClick={() => handleClickOpen(null)}>
        Create Log
      </Button>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Log Data</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {!logMock ? (
            <TableRow>
              <TableCell colSpan={3} align="center">
                <Box display="flex" justifyContent="center" padding={5}>
                  <CircularProgress />
                </Box>
              </TableCell>
            </TableRow>
          ) : (
            logMock.map((log) => (
              <TableRow key={log.id}>
                <TableCell>{log.id}</TableCell>
                <TableCell>{log.logData}</TableCell>
                <TableCell>
                  <IconButton disabled={!userAccess?.canEdit} onClick={() => handleClickOpen(log)}>
                    <EditOutlined />
                  </IconButton>
                  <IconButton disabled={!userAccess?.canDelete} onClick={() => handleDelete(log.id)}>
                    <DeleteOutlined />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{editingLog ? 'Edit Log' : 'Create Log'}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Log Data"
            type="text"
            fullWidth
            value={logData}
            onChange={(e) => setLogData(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleSave} color="primary">
            {editingLog ? 'Save' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </MainCard>
  );
}
