import React from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
    TextField, Button, Container, Paper, Typography,
    Alert, Snackbar, Box, CircularProgress
} from '@mui/material';
import { loginSuccess } from '../../store/slices/authSlice';
import { api } from "../../services/api.ts";
import { Link } from 'react-router-dom';

interface Role {
    id: number;
    name: string;
}

interface AuthResponseDto {
    accessToken: string;
    refreshToken: string;
    roles: Role[];
    fullName: string;
}

const Login: React.FC = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [formData, setFormData] = React.useState({
        email: '',
        password: '',
    });

    const [loading, setLoading] = React.useState(false);
    const [errors, setErrors] = React.useState<{[key: string]: string}>({});
    const [snackbar, setSnackbar] = React.useState({
        open: false,
        message: '',
        severity: 'error' as 'error' | 'success'
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault(); // 👈 ВАЖНО: предотвращаем перезагрузку страницы

        // 👇 Очищаем предыдущие ошибки
        setErrors({});

        // 👇 Валидация
        const validationErrors: {[key: string]: string} = {};

        if (!formData.email.trim()) {
            validationErrors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            validationErrors.email = 'Please enter a valid email address';
        }

        if (!formData.password) {
            validationErrors.password = 'Password is required';
        } else if (formData.password.length < 6) {
            validationErrors.password = 'Password must be at least 6 characters';
        }

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);

            // 👇 Показываем первую ошибку в snackbar
            const firstError = Object.values(validationErrors)[0];
            setSnackbar({
                open: true,
                message: firstError,
                severity: 'error'
            });
            return;
        }

        setLoading(true);

        try {
            console.log('🔄 Attempting login with:', { email: formData.email });

            const response = await api.post('/auth/login', formData);
            const authData: AuthResponseDto = response.data;

            console.log('✅ Login successful:', {
                fullName: authData.fullName,
                roles: authData.roles
            });

            dispatch(loginSuccess({
                token: authData.accessToken,
                user: {
                    fullName: authData.fullName,
                    roles: authData.roles || [],
                    email: formData.email
                }
            }));

            // 👇 Успешное уведомление
            setSnackbar({
                open: true,
                message: `Welcome back, ${authData.fullName}!`,
                severity: 'success'
            });

            // 👇 Небольшая задержка чтобы показать сообщение
            setTimeout(() => {
                const redirectPath = localStorage.getItem('redirectAfterLogin');
                if (redirectPath) {
                    localStorage.removeItem('redirectAfterLogin');
                    navigate(redirectPath);
                } else {
                    navigate('/');
                }
            }, 1500);

        } catch (error: any) {
            console.error('❌ Login failed:', error);

            let errorMessage = 'Login failed. Please try again.';
            let fieldErrors: {[key: string]: string} = {};

            if (error.code === 'ERR_NETWORK') {
                errorMessage = 'Network error. Please check if server is running.';
            } else if (error.response?.status === 401) {
                errorMessage = 'Invalid email or password';
                fieldErrors.general = errorMessage;
            } else if (error.response?.status === 400) {
                errorMessage = 'Invalid request data';
            } else if (error.response?.status === 404) {
                errorMessage = 'Service not available';
            } else if (error.response?.data?.message) {
                errorMessage = error.response.data.message;
            } else if (error.response?.data?.messages) {
                // 👇 Обрабатываем валидационные ошибки с бэкенда
                fieldErrors = error.response.data.messages;
                errorMessage = 'Please fix the errors below';
            }

            setErrors(fieldErrors);
            setSnackbar({
                open: true,
                message: errorMessage,
                severity: 'error'
            });

        } finally {
            setLoading(false);
        }
    };

    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !loading) {
            handleSubmit(e as any);
        }
    };

    return (
        <Container component="main" maxWidth="xs">
            <Paper elevation={3} sx={{
                padding: 4,
                marginTop: 8,
                position: 'relative',
                overflow: 'hidden'
            }}>
                {loading && (
                    <Box sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: 'rgba(255,255,255,0.8)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 10,
                        borderRadius: 1
                    }}>
                        <Box sx={{ textAlign: 'center' }}>
                            <CircularProgress />
                            <Typography variant="body2" sx={{ mt: 2, color: 'text.secondary' }}>
                                Signing in...
                            </Typography>
                        </Box>
                    </Box>
                )}

                <Typography component="h1" variant="h5" align="center" gutterBottom>
                    Sign In
                </Typography>

                <Typography variant="body2" color="textSecondary" align="center" sx={{ mb: 3 }}>
                    Enter your credentials to access your account
                </Typography>

                {/* 👇 Общая ошибка */}
                {errors.general && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {errors.general}
                    </Alert>
                )}

                <form onSubmit={handleSubmit}>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        label="Email Address"
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={(e) => {
                            setFormData({ ...formData, email: e.target.value });
                            if (errors.email) setErrors({...errors, email: ''});
                        }}
                        error={!!errors.email}
                        helperText={errors.email}
                        disabled={loading}
                        autoComplete="email"
                        autoFocus
                        onKeyPress={handleKeyPress}
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        label="Password"
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={(e) => {
                            setFormData({ ...formData, password: e.target.value });
                            if (errors.password) setErrors({...errors, password: ''});
                        }}
                        error={!!errors.password}
                        helperText={errors.password}
                        disabled={loading}
                        autoComplete="current-password"
                        onKeyPress={handleKeyPress}
                        sx={{ mb: 1 }}
                    />

                    <Box sx={{ textAlign: 'right', mt: 1, mb: 2 }}>
                        <Typography
                            variant="body2"
                            color="primary"
                            sx={{
                                cursor: 'pointer',
                                '&:hover': { textDecoration: 'underline' },
                                fontWeight: 500
                            }}
                            onClick={() => {
                                if (!loading) {
                                    setSnackbar({
                                        open: true,
                                        message: 'Password reset feature coming soon!',
                                        severity: 'success'
                                    });
                                }
                            }}
                        >
                            Forgot password?
                        </Typography>
                    </Box>

                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="warning"
                        sx={{
                            mt: 2,
                            mb: 2,
                            py: 1.5,
                            fontWeight: 'bold',
                            fontSize: '1rem'
                        }}
                        disabled={loading}
                        size="large"
                    >
                        {loading ? 'Signing In...' : 'Sign In'}
                    </Button>

                    <Box sx={{ textAlign: 'center', mt: 3 }}>
                        <Typography variant="body2" color="textSecondary">
                            Don't have an account?
                        </Typography>
                        <Button
                            component={Link}
                            to="/register"
                            variant="text"
                            sx={{ mt: 1 }}
                            disabled={loading}
                        >
                            Create New Account
                        </Button>
                    </Box>
                </form>
            </Paper>

            {/* 👇 Snackbar для уведомлений */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={5000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert
                    onClose={handleCloseSnackbar}
                    severity={snackbar.severity}
                    sx={{
                        width: '100%',
                        boxShadow: 3,
                        '& .MuiAlert-icon': {
                            fontSize: '1.25rem'
                        }
                    }}
                    variant="filled"
                >
                    <Typography variant="body1" fontWeight={500}>
                        {snackbar.message}
                    </Typography>
                </Alert>
            </Snackbar>
        </Container>
    );
};

export default Login;