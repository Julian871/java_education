import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../../store';
import {
    Container,
    Card,
    CardContent,
    Typography,
    Button,
    Box,
    Chip,
    Alert,
    Grid,
    Paper,
    TextField,
    MenuItem,
    FormControl,
    InputLabel,
    Select,
    Stack,
    IconButton,
    CircularProgress,
    Divider, type SelectChangeEvent
} from '@mui/material';
import { Link } from 'react-router-dom';
import { restaurantApi } from '../../services/restaurantApi';
import { Clear } from '@mui/icons-material';

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

// Список кухонь (можно расширить)
const CUISINE_TYPES = [
    'All Cuisines',
    'Italian',
    'Mexican',
    'Japanese',
    'Chinese',
    'American',
    'Indian',
    'French',
    'Thai',
    'Mediterranean',
    'Vegetarian',
    'Fast Food',
    'Seafood',
    'Steakhouse',
    'Other'
];

const RestaurantList: React.FC = () => {
    const [restaurants, setRestaurants] = useState<RestaurantResponseDto[]>([]);
    const [filteredRestaurants, setFilteredRestaurants] = useState<RestaurantResponseDto[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Фильтры
    const [selectedCuisine, setSelectedCuisine] = useState<string>('All Cuisines');
    const [searchQuery, setSearchQuery] = useState<string>('');

    const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);

    // Загружаем рестораны
    useEffect(() => {
        fetchRestaurants();
    }, []);

    // Применяем фильтры при изменении данных
    useEffect(() => {
        applyFilters();
    }, [restaurants, selectedCuisine, searchQuery]);

    const fetchRestaurants = async () => {
        try {
            setLoading(true);
            // 👇 Отправляем запрос без фильтра (получаем все рестораны)
            const response = await restaurantApi.get('/restaurants');
            setRestaurants(response.data);
        } catch (error) {
            console.error('Error fetching restaurants:', error);
            setError('Failed to load restaurants');
        } finally {
            setLoading(false);
        }
    };

    // 👇 Функция для фильтрации на клиенте
    const applyFilters = () => {
        let filtered = [...restaurants];

        // Фильтр по кухне
        if (selectedCuisine !== 'All Cuisines') {
            filtered = filtered.filter(restaurant =>
                restaurant.cuisine.toLowerCase() === selectedCuisine.toLowerCase()
            );
        }

        // Фильтр по поиску (название или адрес)
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(restaurant =>
                restaurant.name.toLowerCase().includes(query) ||
                restaurant.address.toLowerCase().includes(query) ||
                restaurant.cuisine.toLowerCase().includes(query)
            );
        }

        setFilteredRestaurants(filtered);
    };

    const handleCuisineChange = (event: SelectChangeEvent) => {
        const cuisine = event.target.value;
        setSelectedCuisine(cuisine);
    };

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(event.target.value);
    };

    const handleClearFilters = () => {
        setSelectedCuisine('All Cuisines');
        setSearchQuery('');
    };

    // Получаем список уникальных кухонь из данных
    const availableCuisines = Array.from(
        new Set(restaurants.map(r => r.cuisine))
    ).sort();

    // Используем доступные кухни или предопределенный список
    const cuisineOptions = availableCuisines.length > 0
        ? ['All Cuisines', ...availableCuisines]
        : CUISINE_TYPES;

    if (loading) {
        return (
            <Container sx={{
                py: 4,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '50vh'
            }}>
                <Box sx={{ textAlign: 'center' }}>
                    <CircularProgress size={60} />
                    <Typography variant="h6" sx={{ mt: 2 }}>
                        Loading restaurants...
                    </Typography>
                </Box>
            </Container>
        );
    }

    return (
        <Container sx={{ py: 4 }}>

            {/* Сообщение для гостей */}
            {!isAuthenticated && (
                <Alert severity="info" sx={{ mb: 4 }}>
                    <Typography variant="body1">
                        👋 Welcome! Browse restaurants or <Link to="/login" style={{ color: '#1976d2', fontWeight: 'bold' }}>sign in</Link> to place orders.
                    </Typography>
                </Alert>
            )}

            {/* Заголовок */}
            <Box sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 3,
                flexWrap: 'wrap',
                gap: 2
            }}>
                <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
                    🍽️ Restaurants
                </Typography>
            </Box>

            {/* Панель фильтров */}
            <Paper
                elevation={2}
                sx={{
                    width: '50%',
                    p: 2,
                    mb: 3,
                    borderRadius: 3,
                    background: '#f8f9fa'
                }}
            >
                <Stack
                    direction={{ xs: 'column', sm: 'row' }}
                    spacing={2}
                    alignItems={{ xs: 'stretch', sm: 'center' }}
                >

                    {/* Поиск */}
                    <TextField
                        label="Search restaurants..."
                        variant="outlined"
                        size="small"
                        value={searchQuery}
                        onChange={handleSearchChange}
                        fullWidth
                        sx={{ flex: 2 }}
                        InputProps={{
                            endAdornment: searchQuery && (
                                <IconButton
                                    size="small"
                                    onClick={() => setSearchQuery('')}
                                >
                                    <Clear />
                                </IconButton>
                            )
                        }}
                    />

                    {/* Фильтр по кухне */}
                    <FormControl size="small" sx={{ flex: 1, minWidth: 200 }}>
                        <InputLabel>Cuisine Type</InputLabel>
                        <Select
                            value={selectedCuisine}
                            label="Cuisine Type"
                            onChange={handleCuisineChange}
                        >
                            {cuisineOptions.map((cuisine) => (
                                <MenuItem key={cuisine} value={cuisine}>
                                    {cuisine}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    {/* Кнопка сброса */}
                    {(selectedCuisine !== 'All Cuisines' || searchQuery) && (
                        <Button
                            variant="outlined"
                            color="secondary"
                            onClick={handleClearFilters}
                            startIcon={<Clear />}
                            sx={{ height: 40 }}
                        >
                            Clear Filters
                        </Button>
                    )}
                </Stack>

                {/* Активные фильтры */}
                {(selectedCuisine !== 'All Cuisines' || searchQuery) && (
                    <Box sx={{ mt: 2 }}>
                        <Divider sx={{ mb: 1 }} />
                        <Stack direction="row" spacing={1} flexWrap="wrap">
                            {selectedCuisine !== 'All Cuisines' && (
                                <Chip
                                    label={`Cuisine: ${selectedCuisine}`}
                                    color="primary"
                                    size="small"
                                    onDelete={() => setSelectedCuisine('All Cuisines')}
                                />
                            )}
                            {searchQuery && (
                                <Chip
                                    label={`Search: "${searchQuery}"`}
                                    color="secondary"
                                    size="small"
                                    onDelete={() => setSearchQuery('')}
                                />
                            )}
                        </Stack>
                    </Box>
                )}
            </Paper>

            {/* Ошибки */}
            {error && (
                <Alert severity="error" sx={{ mb: 3 }}>
                    {error}
                </Alert>
            )}

            {/* Рестораны */}
            {filteredRestaurants.length > 0 ? (
                <Grid container spacing={3}>
                    {filteredRestaurants.map(restaurant => (
                        <Grid item xs={12} sm={6} md={4} key={restaurant.id}>
                            <Card sx={{
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
                                    <Typography variant="h6" component="h2" gutterBottom sx={{
                                        fontWeight: 'bold',
                                        color: '#2c3e50'
                                    }}>
                                        {restaurant.name}
                                    </Typography>

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

                                    <Typography variant="body2" color="textSecondary" gutterBottom sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 0.5
                                    }}>
                                        📍 {restaurant.address}
                                    </Typography>

                                    <Typography variant="body2" sx={{
                                        mb: 2,
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 0.5
                                    }}>
                                        🍴 {restaurant.dishes?.length || 0} dishes available
                                    </Typography>

                                    <Box sx={{ mt: 'auto' }}>
                                        <Button
                                            variant="contained"
                                            color="success"
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
                        </Grid>
                    ))}
                </Grid>
            ) : (
                <Paper
                    elevation={0}
                    sx={{
                        p: 4,
                        textAlign: 'center',
                        border: '2px dashed #e0e0e0',
                        borderRadius: 3
                    }}
                >
                    <Typography variant="h5" color="textSecondary" gutterBottom>
                        🍽️ No restaurants found
                    </Typography>
                    <Typography variant="body1" color="textSecondary" sx={{ mb: 3 }}>
                        {restaurants.length === 0
                            ? "There are no restaurants available at the moment."
                            : "No restaurants match your filters. Try changing your search criteria."}
                    </Typography>

                    {(selectedCuisine !== 'All Cuisines' || searchQuery) && (
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleClearFilters}
                            startIcon={<Clear />}
                        >
                            Clear All Filters
                        </Button>
                    )}
                </Paper>
            )}

            {/* Статистика */}
            {filteredRestaurants.length > 0 && (
                <Box sx={{ mt: 4, textAlign: 'center' }}>
                    <Typography variant="body2" color="textSecondary">
                        Showing {filteredRestaurants.length} of {restaurants.length} restaurants
                    </Typography>
                </Box>
            )}
        </Container>
    );
};

export default RestaurantList;