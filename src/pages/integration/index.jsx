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
  Box,
  Tooltip
} from '@mui/material';

// ant-design icons
import { EditOutlined, DeleteOutlined, ApiOutlined, EyeOutlined } from '@ant-design/icons';

// project import
import MainCard from 'components/MainCard';

// SWR for data fetching
import useSWR from 'swr';
import { useEffect } from 'react';
import { getData } from 'services';

export default function Integration({ baseUrl }) {
  const { data: integration, error, mutate } = useSWR(baseUrl + '/api/integration/list', getData);

  const [open, setOpen] = useState(false);
  const [openDetails, setOpenDetails] = useState(false);
  const [selectedIntegration, setSelectedIntegration] = useState(null);
  const [editingIntegration, setEditingIntegration] = useState(null);
  const [cameraName, setCameraName] = useState('');
  const [rtspURL, setRtspURL] = useState('');
  const [panelId, setPanelId] = useState('');
  const [integrationMock, setIntegrationMock] = useState([]);

  useEffect(() => {
    if (integration) {
      setIntegrationMock(integration.integrations);
    }
  }, [integration]);

  const handleClickOpen = (integration) => {
    setEditingIntegration(integration);
    setCameraName(integration ? integration.cameraName : '');
    setRtspURL(integration ? integration.rtspURL : '');
    setPanelId(integration ? integration.panelId : '');
    setOpen(true);
  };

  const handleClickOpenDetails = (integration) => {
    setSelectedIntegration(integration);
    setOpenDetails(true);
  };

  const handleCloseDetails = () => {
    setOpenDetails(false);
    setSelectedIntegration(null);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingIntegration(null);
    setCameraName('');
    setRtspURL('');
    setPanelId('');
  };

  const handleSave = async () => {
    if (editingIntegration) {
      // Update integration
      await fetch(baseUrl + '/api/integration/' + editingIntegration.id, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cameraName, rtspURL, panelId })
      });
    } else {
      // Create new integration
      const auth = JSON.parse(localStorage.getItem('user'));
      const create = await fetch(baseUrl + '/api/integration', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + auth.token
        },
        body: JSON.stringify({ cameraName, rtspURL, panelId })
      });
      console.log(create, 'log')
    }
    mutate(); // Refresh the data
    handleClose();
  };

  const handleDelete = async (id) => {
    await fetch(baseUrl + '/integration/' + id, {
      method: 'DELETE'
    });
    mutate(); // Refresh the data
  };

  return (
    <MainCard title="Integration Management">
      <Typography variant="body2" gutterBottom>
        Manage your integration below. You can create, edit, or delete integration as needed. If you can't edit, delete, or create
        integration, it means you don't have the necessary access permissions.
      </Typography>
      <Button variant="contained" color="primary" startIcon={<ApiOutlined />} onClick={() => handleClickOpen(null)}>
        Create Integration
      </Button>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Camera Name</TableCell>
            <TableCell>Snapshot</TableCell>
            <TableCell>Panel ID</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {!integrationMock ? (
            <TableRow>
              <TableCell colSpan={5} align="center">
                <Box display="flex" justifyContent="center" padding={5}>
                  <CircularProgress />
                </Box>
              </TableCell>
            </TableRow>
          ) : (
            integrationMock.map((integration, index) => (
              <TableRow key={integration.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{integration.cameraName}</TableCell>
                <TableCell>{integration.isSnapShotActive === false ? 'Mati' : 'Hidup'}</TableCell>
                <TableCell>{integration.panelId}</TableCell>
                <TableCell>
                  <Tooltip title="Edit Integration">
                    <IconButton onClick={() => handleClickOpen(integration)}>
                      <EditOutlined />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete Integration">
                    <IconButton onClick={() => handleDelete(integration.id)}>
                      <DeleteOutlined />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="View Details">
                    <IconButton onClick={() => handleClickOpenDetails(integration)}>
                      <EyeOutlined />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{editingIntegration ? 'Edit Integration' : 'Create Integration'}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Camera Name"
            type="text"
            fullWidth
            value={cameraName}
            onChange={(e) => setCameraName(e.target.value)}
          />
          <TextField margin="dense" label="RTSP URL" type="text" fullWidth value={rtspURL} onChange={(e) => setRtspURL(e.target.value)} />
          <TextField margin="dense" label="Panel ID" type="number" fullWidth value={panelId} onChange={(e) => setPanelId(e.target.value)} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleSave} color="primary">
            {editingIntegration ? 'Save' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={openDetails} onClose={handleCloseDetails} maxWidth="md" fullWidth>
        <DialogTitle>Integration Details</DialogTitle>
        <DialogContent>
          {selectedIntegration && (
            <>
              <Typography variant="body1" gutterBottom>
                <strong>Camera Name:</strong> {selectedIntegration.cameraName}
              </Typography>
              <Typography variant="body1" gutterBottom>
                <strong>RTSP URL:</strong> {selectedIntegration.rtspURL}
              </Typography>
              <Typography variant="body1" gutterBottom>
                <strong>Panel ID:</strong> {selectedIntegration.panelId}
              </Typography>
              <Typography variant="body1" gutterBottom>
                <strong>Video Preview:</strong>
              </Typography>
              <Box mt={2}>
                <video width="100%" controls>
                  <source
                    src={`http://localhost:8080/stream?url=${encodeURIComponent(selectedIntegration.rtspURL)}`}
                    type="application/x-mpegURL"
                  />
                  Your browser does not support the video tag.
                </video>
              </Box>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDetails} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </MainCard>
  );
}
