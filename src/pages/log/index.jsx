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
import { get, getAdminAccess, getToken, getUser } from 'services';
import MessageDisplay from 'components/MessageDisplay';

export default function Log({ baseUrl }) {

  useEffect(() => {
    if (!getToken()) window.location.href = '/login';
  }, []);

  const userAccess = getUser()?.userData?.acl?.find(menu => menu?.menuName === 'log') || getAdminAccess();

  const { data: logs, error, mutate, isLoading } = useSWR(baseUrl + '/logs', get, {
    revalidateOnFocus: false,
  });

  const [open, setOpen] = useState(false);
  const [editingLog, setEditingLog] = useState(null);
  const [logData, setLogData] = useState('');
  const [logMock, setLogMock] = useState();

  useEffect(() => {
    // setTimeout(() => {
    //   // Mock data
    //   setLogMock([
    //     { id: 1, logData: 'Log 1 data' },
    //     { id: 2, logData: 'Log 2 data' },
    //     { id: 3, logData: 'Log 3 data' },
    //     { id: 4, logData: 'Log 4 data' },
    //     { id: 5, logData: 'Log 5 data' }
    //   ]);
    // }, 500);
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
      <MessageDisplay error={error} />
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
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={3} align="center">
                <Box display="flex" justifyContent="center" padding={5}>
                  <CircularProgress />
                </Box>
              </TableCell>
            </TableRow>
          ) : (
            logs?.length ? (
              logs?.map((log) => (
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
