import React from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Container, Paper, Typography } from '@mui/material';
import { loginSuccess } from '../../store/slices/authSlice';
import {api} from "../../services/api.ts";
import { Link } from 'react-router-dom';

const Login: React.FC = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [formData, setFormData] = React.useState({
        email: '',
        password: '',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const loginResponse = await api.post('/auth/login', formData);
            const { accessToken } = loginResponse.data;

            localStorage.setItem('token', accessToken);

            const userResponse = await api.get('/users/me');
            const userData = userResponse.data;

            dispatch(loginSuccess({
                token: accessToken,
                user: {
                    id: userData.id,
                    email: userData.email,
                    fullName: userData.fullName
                }
            }));
            navigate('/');
        } catch (error) {
            console.error('Login failed:', error);
            alert('Login failed! Check console for details.');
        }
    };

    return (
        <Container component="main" maxWidth="xs">
            <Paper elevation={3} sx={{ padding: 4, marginTop: 8 }}>
                <Typography component="h1" variant="h5" align="center">
                    Sign In
                </Typography>
                <form onSubmit={handleSubmit}>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        label="Email Address"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        label="Password"
                        type="password"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="warning"
                        sx={{ mt: 3, mb: 2 }}
                    >
                        Sign In
                    </Button>

                    <Button
                        component={Link}
                        to="/register"
                        fullWidth
                        variant="text"
                        sx={{ mt: 1 }}
                    >
                        Don't have an account? Sign Up
                    </Button>
                </form>
            </Paper>
        </Container>
    );
};

export default Login;