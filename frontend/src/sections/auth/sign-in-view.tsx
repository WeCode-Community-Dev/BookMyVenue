import { useState, useCallback } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import InputAdornment from '@mui/material/InputAdornment';

import { AuthApiService } from 'src/api/auth';
import { useAuth } from 'src/context/auth/use-auth';
import { UserRole } from 'src/context/auth/auth.types';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

export function SignInView() {

  const { login, isAuthenticated, user } = useAuth();
  const navigate = useNavigate()

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('user@bmv.com');
  const [password, setPassword] = useState('password1234');
  const [isLoading, setIsLoading] = useState(false);

  const handleSignIn = useCallback(async () => {

    setIsLoading(true);

    try {
      const response = await AuthApiService.login({ email, password });
      login(
        {
          id: response.user.id,
          name: `${response.user.firstName} ${response.user.lastName}`,
          email,
          role: response.user.role,
        },
        {
          accessToken: response.accessToken,
          refreshToken: response.refreshToken,
        },
      );
      switch (response.user.role) {
        case UserRole.ADMIN:
          navigate('/admin');
          break;

        case UserRole.VENUE_OWNER:
          navigate('/owner');
          break;

        default:
          navigate('/');
          break;
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }

    return;

  }, [email, password, login]);
  const renderForm = (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'flex-end',
        flexDirection: 'column',
      }}
    >
      <TextField
        fullWidth
        name="email"
        label="Email address"
        defaultValue="user@bmv.com"
        onChange={(event) => setEmail(event.target.value)}
        sx={{ mb: 3 }}
        slotProps={{
          inputLabel: { shrink: true },
        }}
      />

      <Link variant="body2" color="inherit" sx={{ mb: 1.5 }}>
        Forgot password?
      </Link>

      <TextField
        fullWidth
        name="password"
        label="Password"
        defaultValue="password1234"
        onChange={(event) => setPassword(event.target.value)}
        type={showPassword ? 'text' : 'password'}
        slotProps={{
          inputLabel: { shrink: true },
          input: {
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                  <Iconify icon={showPassword ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
                </IconButton>
              </InputAdornment>
            ),
          },
        }}
        sx={{ mb: 3 }}
      />

      <Button
        fullWidth
        size="large"
        type="submit"
        color="inherit"
        variant="contained"
        onClick={handleSignIn}
      >
        Sign in
      </Button>
    </Box>
  );

  if (isAuthenticated) {
    switch (user?.role) {
      case UserRole.ADMIN:
        return <Navigate to="/admin" />;
      case UserRole.VENUE_OWNER:
        return <Navigate to="/owner" />;
      default:
        return <Navigate to="/" />;
    }
  }

  return (
    <>
      <Box
        sx={{
          gap: 1.5,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          mb: 5,
        }}
      >
        <Typography variant="h5">Sign in</Typography>
        <Typography
          variant="body2"
          sx={{
            color: 'text.secondary',
          }}
        >
          Don’t have an account?
          <Link variant="subtitle2" sx={{ ml: 0.5 }}>
            Get started
          </Link>
        </Typography>
      </Box>
      {renderForm}
      <Divider sx={{ my: 3, '&::before, &::after': { borderTopStyle: 'dashed' } }}>
        <Typography
          variant="overline"
          sx={{ color: 'text.secondary', fontWeight: 'fontWeightMedium' }}
        >
          OR
        </Typography>
      </Divider>
      <Box
        sx={{
          gap: 1,
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <IconButton color="inherit">
          <Iconify width={22} icon="socials:google" />
        </IconButton>
        <IconButton color="inherit">
          <Iconify width={22} icon="socials:github" />
        </IconButton>
        <IconButton color="inherit">
          <Iconify width={22} icon="socials:twitter" />
        </IconButton>
      </Box>
    </>
  );
}
