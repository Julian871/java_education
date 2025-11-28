import React from 'react';
import {Link, useNavigate} from 'react-router-dom';
import { useDispatch } from 'react-redux';
import {
    TextField,
    Button,
    Container,
    Paper,
    Typography,
    Alert,
} from '@mui/material';
import { api } from '../../services/api';
import { loginSuccess } from '../../store/slices/authSlice';

const Register: React.FC = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [formData, setFormData] = React.useState({
        email: '',
        password: '',
        fullName: '',
    });
    const [errors, setErrors] = React.useState<{ [key: string]: string }>({});
    const [loading, setLoading] = React.useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrors({});
        setLoading(true);

        try {
            const response = await api.post('/auth/register', formData);
            const userData = response.data;

            // autologin after registration
            dispatch(loginSuccess({
                token: userData.accessToken,
                user: {
                    id: userData.id,
                    email: userData.email,
                    fullName: userData.fullName
                }
            }));
            navigate('/');
        } catch (error: any) {
            console.error('Registration failed:', error);

            if (error.response?.data?.messages) {
                setErrors(error.response.data.messages);
            } else if (error.response?.data?.message) {
                setErrors({ general: error.response.data.message });
            } else if (error.code === 'ERR_NETWORK') {
                setErrors({ general: 'Network error. Please check if server is running.' });
            } else {
                setErrors({ general: 'Registration failed. Please try again.' });
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container component="main" maxWidth="xs">
            <Paper elevation={3} sx={{ padding: 4, marginTop: 8 }}>
                <Typography component="h1" variant="h5" align="center">
                    Sign Up
                </Typography>
                {errors.general && (
                    <Alert severity="error" sx={{ mt: 2 }}>
                        {errors.general}
                    </Alert>
                )}

                <form onSubmit={handleSubmit}>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        label="Full Name"
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        error={!!errors.fullName}
                        helperText={errors.fullName}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        label="Email Address"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        error={!!errors.email}
                        helperText={errors.email}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        label="Password"
                        type="password"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        error={!!errors.password}
                        helperText={errors.password}
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="warning"
                        sx={{ mt: 3, mb: 2 }}
                        disabled={loading}
                    >
                        {loading ? 'Creating Account...' : 'Sign Up'}
                    </Button>

                    <Button
                        component={Link}
                        to="/login"
                        fullWidth
                        variant="text"
                        sx={{ mt: 1 }}
                    >
                        Do you have an account? Sign In
                    </Button>
                </form>
            </Paper>
        </Container>
    );
};

export default Register;