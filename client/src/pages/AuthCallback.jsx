import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Box, CircularProgress, Typography, Alert } from '@mui/material';
import { loginSuccess } from '../store/authSlice';

const AuthCallback = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState('processing'); // processing, success, error

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const token = searchParams.get('token');
        const error = searchParams.get('error');

        if (error) {
          console.error('OAuth error:', error);
          setStatus('error');
          setTimeout(() => {
            navigate('/login?error=oauth_failed');
          }, 3000);
          return;
        }

        if (!token) {
          console.error('No token received');
          setStatus('error');
          setTimeout(() => {
            navigate('/login?error=no_token');
          }, 3000);
          return;
        }

        // Store token in localStorage
        localStorage.setItem('token', token);

        // Get user profile with the token
        const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/auth/profile`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error('Failed to get user profile');
        }

        const data = await response.json();
        
        // Dispatch login success with user data
        dispatch(loginSuccess({
          token,
          user: data.user
        }));

        setStatus('success');
        
        // Redirect to dashboard after a short delay
        setTimeout(() => {
          navigate('/dashboard');
        }, 1000);

      } catch (error) {
        console.error('Callback handling error:', error);
        localStorage.removeItem('token');
        setStatus('error');
        setTimeout(() => {
          navigate('/login?error=callback_failed');
        }, 3000);
      }
    };

    handleCallback();
  }, [searchParams, dispatch, navigate]);

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="100vh"
      bgcolor="grey.50"
      px={3}
    >
      {status === 'processing' && (
        <>
          <CircularProgress size={48} sx={{ mb: 3 }} />
          <Typography variant="h6" gutterBottom>
            Completing sign in...
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Please wait while we finish setting up your account
          </Typography>
        </>
      )}

      {status === 'success' && (
        <>
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: '50%',
              bgcolor: 'success.main',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mb: 3
            }}
          >
            ✓
          </Box>
          <Typography variant="h6" gutterBottom color="success.main">
            Sign in successful!
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Redirecting to your dashboard...
          </Typography>
        </>
      )}

      {status === 'error' && (
        <>
          <Alert severity="error" sx={{ mb: 3, maxWidth: 400 }}>
            <Typography variant="body2">
              Something went wrong during sign in. You'll be redirected to the login page.
            </Typography>
          </Alert>
        </>
      )}
    </Box>
  );
};

export default AuthCallback;