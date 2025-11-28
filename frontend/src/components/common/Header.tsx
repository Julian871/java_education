import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import type {RootState} from '../../store';
import { logout } from '../../store/slices/authSlice';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';

const Header: React.FC = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
    const user = useSelector((state: RootState) => state.auth.user);

    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
    };

    return (
        <AppBar position="static">
            <Toolbar>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>
                        Food Delivery
                    </Link>
                </Typography>

                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                    {isAuthenticated ? (
                        <>
                            {/* 👇 Outlined кнопка */}
                            <Button
                                variant="outlined"
                                color="inherit"
                                component={Link}
                                to="/restaurants"
                                sx={{ borderColor: 'rgba(255,255,255,0.3)' }}
                            >
                                🍽️ Restaurants
                            </Button>

                            <Button color="inherit" component={Link} to="/profile">
                                👤 {user.fullName}
                            </Button>

                            {/* 👇 Contained кнопка */}
                            <Button variant="contained" color="warning" onClick={handleLogout}>
                                Logout
                            </Button>
                        </>
                    ) : (
                        <>
                            <Button color="inherit" component={Link} to="/login">
                                Login
                            </Button>
                            <Button
                                variant="outlined"
                                color="inherit"
                                component={Link}
                                to="/register"
                                sx={{ borderColor: 'rgba(255,255,255,0.3)' }}
                            >
                                Register
                            </Button>
                        </>
                    )}
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default Header;