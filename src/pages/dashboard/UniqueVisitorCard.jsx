import { useState, useEffect } from 'react';

// material-ui
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

// project import
import MainCard from 'components/MainCard';
import IncomeAreaChart from './IncomeAreaChart';

// Fungsi untuk meminta izin notifikasi
const requestNotificationPermission = () => {
  if (!('Notification' in window)) {
    console.log('Browser ini tidak mendukung notifikasi desktop');
    return;
  }
  if (Notification.permission === 'granted') {
    console.log('Izin untuk notifikasi sudah diberikan');
  } else if (Notification.permission !== 'denied') {
    Notification.requestPermission().then(permission => {
      if (permission === 'granted') {
        console.log('Izin untuk notifikasi diberikan');
      } else {
        console.log('Izin untuk notifikasi tidak diberikan');
      }
    });
  } else {
    console.log('Izin untuk notifikasi telah ditolak sebelumnya');
  }
};

// Fungsi untuk menampilkan notifikasi
const showNotification = (title, options) => {
  if (Notification.permission === 'granted') {
    new Notification(title, options);
  } else {
    console.log('Izin untuk notifikasi belum diberikan');
  }
};

// ==============================|| DEFAULT - UNIQUE VISITOR ||============================== //

export default function UniqueVisitorCard() {
  const [slot, setSlot] = useState('week');

  useEffect(() => {
    // Meminta izin notifikasi saat komponen dimuat
    requestNotificationPermission();
  }, []);

  const handleButtonClick = (newSlot) => {
    setSlot(newSlot);

    // Menampilkan notifikasi saat tombol "Month" diklik
    if (newSlot === 'month') {
      const options = {
        body: 'Anda telah memilih tampilan data per bulan',
        icon: 'https://via.placeholder.com/128',
      };
      showNotification('Pilihan Tampilan Data', options);
    }
  };

  const handleTestNotificationClick = () => {
    const options = {
      body: 'Ini adalah notifikasi tes',
      icon: 'https://via.placeholder.com/128',
    };
    showNotification('Notifikasi Tes', options);
  };

  return (
    <>
      <Grid container alignItems="center" justifyContent="space-between">
        <Grid item>
          <Typography variant="h5">Unique Visitor</Typography>
        </Grid>
        <Grid item>
          <Stack direction="row" alignItems="center" spacing={0}>
            <Button
              size="small"
              onClick={() => handleButtonClick('month')}
              color={slot === 'month' ? 'primary' : 'secondary'}
              variant={slot === 'month' ? 'outlined' : 'text'}
            >
              Month
            </Button>
            <Button
              size="small"
              onClick={() => handleButtonClick('week')}
              color={slot === 'week' ? 'primary' : 'secondary'}
              variant={slot === 'week' ? 'outlined' : 'text'}
            >
              Week
            </Button>
          </Stack>
        </Grid>
      </Grid>
      <MainCard content={false} sx={{ mt: 1.5 }}>
        <Box sx={{ pt: 1, pr: 2 }}>
          <IncomeAreaChart slot={slot} />
        </Box>
      </MainCard>
      <Button variant="contained" color="secondary" onClick={handleTestNotificationClick} sx={{ mt: 2 }}>
        Test Notification
      </Button>
    </>
  );
}
