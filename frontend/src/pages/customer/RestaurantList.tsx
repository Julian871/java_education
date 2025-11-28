import React, { useEffect, useState } from 'react';
import {
    Container,
    Card,
    CardContent,
    Typography,
    Button,
    Box,
    Chip
} from '@mui/material';
import { api } from '../../services/api';
import { Link } from 'react-router-dom';

interface DishResponseDto {
    id: number;
    name: string;
    description: string;
    price: number;
    imageUrl: string;
}

interface RestaurantResponseDto {
    id: number;
    name: string;
    cuisine: string;
    address: string;
    dishes: DishResponseDto[];
}

const RestaurantList: React.FC = () => {
    const [restaurants, setRestaurants] = useState<RestaurantResponseDto[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRestaurants = async () => {
            try {
                const response = await api.get('http://localhost:8082/restaurants');
                setRestaurants(response.data);
            } catch (error) {
                console.error('Error fetching restaurants:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchRestaurants();
    }, []);

    if (loading) {
        return (
            <Container sx={{ py: 4 }}>
                <Typography>Loading restaurants...</Typography>
            </Container>
        );
    }

    return (
        <Container sx={{ py: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom>
                🍽️ Restaurants
            </Typography>

            <Box sx={{
                display: 'grid',
                gridTemplateColumns: {
                    xs: '1fr',
                    sm: 'repeat(2, 1fr)',
                    md: 'repeat(3, 1fr)'
                },
                gap: 3
            }}>
                {restaurants.map(restaurant => (
                    <Card key={restaurant.id} sx={{
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',

                        borderRadius: 3,
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                        transition: 'all 0.3s ease-in-out',
                        border: '2px solid #f0f0f0',

                        '&:hover': {
                            transform: 'translateY(-8px)',
                            boxShadow: '0 12px 24px rgba(0,0,0,0.15)',
                            borderColor: '#4caf50'
                        }
                    }}>
                        <CardContent sx={{
                            flexGrow: 1,
                            padding: 3,
                            '&:last-child': { paddingBottom: 3 }
                        }}>

                            {/* Название ресторана */}
                            <Typography variant="h6" component="h2" gutterBottom sx={{
                                fontWeight: 'bold',
                                color: '#2c3e50'
                            }}>
                                {restaurant.name}
                            </Typography>

                            {/* Кухня */}
                            <Chip
                                label={restaurant.cuisine}
                                color='secondary'
                                size="small"
                                sx={{
                                    mb: 2,
                                    fontWeight: 'bold',
                                    borderRadius: 2
                                }}
                            />

                            {/* Адрес */}
                            <Typography variant="body2" color="textSecondary" gutterBottom sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 0.5
                            }}>
                                📍 {restaurant.address}
                            </Typography>

                            {/* Количество блюд */}
                            <Typography variant="body2" sx={{
                                mb: 2,
                                display: 'flex',
                                alignItems: 'center',
                                gap: 0.5
                            }}>
                                🍴 {restaurant.dishes?.length || 0} dishes available
                            </Typography>

                            {/* Кнопка просмотра меню */}
                            <Box sx={{ mt: 'auto' }}>
                                <Button
                                    variant="contained"
                                    color='success'
                                    fullWidth
                                    component={Link}
                                    to={`/restaurants/${restaurant.id}`}
                                    sx={{
                                        borderRadius: 2,
                                        textTransform: 'none',
                                        fontWeight: 'bold',
                                        padding: '8px 16px'
                                    }}
                                >
                                    View Menu
                                </Button>
                            </Box>
                        </CardContent>
                    </Card>
                ))}
            </Box>
        </Container>
    );
};

export default RestaurantList;