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
  Tooltip,
  Snackbar,
  Alert
} from '@mui/material';

// ant-design icons
import { EditOutlined, DeleteOutlined, ApiOutlined, EyeOutlined } from '@ant-design/icons';

// project import
import MainCard from 'components/MainCard';

// SWR for data fetching
import useSWR from 'swr';
import { useEffect } from 'react';
import { get, post, token } from 'services';
import StreamPage from './video';
import VideoFeed from './vidsec';
import { useNavigate } from 'react-router';

export default function Integration({ baseUrl }) {
 
  useEffect(() => {
    if(!token){
      window.location.href = '/login'
    }
  }, []);
  const { data: integration, error, mutate } = useSWR(baseUrl + '/api/integration/list', post);

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
    } else if (error) {
      console.error('SWR Error:', error.message);
    }
  }, [integration, error]);

  const handleClickOpen = async (integration) => {
    if (integration) {
      const details = await fetchIntegrationDetails(integration.id);
      
      if (details) {
        setEditingIntegration(details);
        setCameraName(details.cameraName);
        setRtspURL(details.rtspURL);
        setPanelId(details.panelId);
      }
    } else {
      setEditingIntegration(null);
      setCameraName('');
      setRtspURL('');
      setPanelId('');
    }
    setOpen(true);
  };

  const fetchIntegrationDetails = async (integrationId) => {
    try {
      const response = await get(baseUrl + `/api/integration/${integrationId}`);
      return response.integration;
    } catch (error) {
      console.error('Error fetching integration details:', error);
      return null;
    }
  };


  const handleClickOpenDetails = async (integration) => {
    if (integration) {
      const details = await fetchIntegrationDetails(integration.id);
      if (details) {
        setSelectedIntegration(details)
      }
    } else {
      setSelectedIntegration(integration);
    
    }
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
      await fetch(baseUrl + '/api/integration', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + auth.token
        },
        body: JSON.stringify({
          cameraName: cameraName,
          rtspURL: rtspURL,
          panelId: Number(panelId) // Pastikan panelId adalah number
        })
      }).then(async (res) => {
        if (!res.ok) {
          const errorData = await res.json();

          alert(errorData.message);
        } else {
          alert('Data ditambahkan');
        }
      });
    }
    mutate(); // Refresh the data
    handleClose();
  };

  console.log(selectedIntegration, 'selll')
  const handleDelete = async (id) => {
    await fetch(baseUrl + '/integration/' + id, {
      method: 'DELETE'
    });
    mutate(); // Refresh the data
  };

  return (
    <MainCard title="Integration Management">
       {
        error?.message ? ( 
        <>
        <Alert severity="error">
          {error.message}
        </Alert>
        </> 
        ) : (<></>)
      }
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
              <VideoFeed src={selectedIntegration.rtspURL} />
              {/* <StreamPage/> */}
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
