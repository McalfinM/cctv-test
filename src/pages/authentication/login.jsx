import { Link, useNavigate } from 'react-router-dom';

// material-ui
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// project import
import AuthWrapper from './AuthWrapper';
import AuthLogin from './auth-forms/AuthLogin';
import { useEffect } from 'react';

// ================================|| LOGIN ||================================ //

export default function Login() {
  let user = localStorage.getItem('user');
  let token = user ? JSON.parse(user)?.token : '';
  console.log('🚀 ~ file: login.jsx:17 ~ Login ~ token:', token);
  const navigate = useNavigate();

  useEffect(() => {
    if (token) navigate('/dashboard');

    return () => {};
  }, []);

  return (
    <AuthWrapper>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Stack direction="row" justifyContent="space-between" alignItems="baseline" sx={{ mb: { xs: -0.5, sm: 0.5 } }}>
            <Typography variant="h3">Login</Typography>
            {/* <Typography component={Link} to="/register" variant="body1" sx={{ textDecoration: 'none' }} color="primary">
              Don&apos;t have an account?
            </Typography> */}
          </Stack>
        </Grid>
        <Grid item xs={12}>
          <AuthLogin />
        </Grid>
      </Grid>
    </AuthWrapper>
  );
}
