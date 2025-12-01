import React, { useState } from 'react';
import {
    Container,
    Paper,
    Typography,
    Box,
    Button,
    Grid,
    Card,
    CardContent,
    CardActions,
    Divider,
    Alert
} from '@mui/material';
import {
    Restaurant,
    Fastfood,
    Add,
    List
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const AdminPanel: React.FC = () => {
    const navigate = useNavigate();
    const [error, setError] = useState<string | null>(null);

    const handleCreateRestaurant = () => {
        navigate('/admin/restaurants/create');
        console.log('Navigate to create restaurant');
    };

    const handleManageRestaurants = () => {
        navigate('/admin/restaurants');
    };

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
                {/* Заголовок */}
                <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
                    🛠️ Admin Panel
                </Typography>

                <Typography variant="body1" color="textSecondary" paragraph>
                    Manage restaurants, dishes, and orders
                </Typography>

                <Divider sx={{ my: 3 }} />

                {/* Сообщения об ошибках */}
                {error && (
                    <Alert severity="error" sx={{ mb: 3 }}>
                        {error}
                    </Alert>
                )}

                {/* Основные функции администратора */}
                <Grid container spacing={3}>
                    {/* Управление ресторанами */}
                    <Grid item xs={12} sm={6} md={4}>
                        <Card sx={{
                            height: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            transition: '0.3s',
                            '&:hover': {
                                transform: 'translateY(-4px)',
                                boxShadow: 6
                            }
                        }}>
                            <CardContent sx={{ flexGrow: 1 }}>
                                <Box sx={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    mb: 2
                                }}>
                                    <Restaurant sx={{ fontSize: 60, color: 'info.main' }} />
                                </Box>
                                <Typography variant="h6" component="h2" align="center" gutterBottom>
                                    Manage Restaurants
                                </Typography>
                                <Typography variant="body2" color="textSecondary" align="center">
                                    View, edit, or delete restaurants
                                </Typography>
                            </CardContent>
                            <CardActions sx={{ justifyContent: 'center', pb: 2 }}>
                                <Button
                                    variant="outlined"
                                    startIcon={<List />}
                                    color='success'
                                    onClick={handleManageRestaurants}
                                    fullWidth
                                    sx={{ mx: 2 }}
                                >
                                    Manage
                                </Button>
                            </CardActions>
                        </Card>
                    </Grid>
                </Grid>
            </Paper>
        </Container>
    );
};

export default AdminPanel;