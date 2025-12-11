import React, { useEffect, useState, useRef } from 'react';
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
    Divider,
    Pagination,
    type SelectChangeEvent,
    InputAdornment
} from '@mui/material';
import { Link } from 'react-router-dom';
import { restaurantApi } from '../../services/restaurantApi';
import { Clear, Search } from '@mui/icons-material';

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

interface PageResponse<T> {
    content: T[];
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
}

const RestaurantList: React.FC = () => {
    const [pageData, setPageData] = useState<PageResponse<RestaurantResponseDto> | null>(null);
    const [restaurants, setRestaurants] = useState<RestaurantResponseDto[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Фильтры
    const [selectedCuisine, setSelectedCuisine] = useState<string>('All Cuisines');
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [searchValue, setSearchValue] = useState<string>(''); // Для дебаунса
    const [currentPage, setCurrentPage] = useState<number>(0);
    const [totalPages, setTotalPages] = useState<number>(0);

    // Ref для фокуса на поле поиска
    const searchInputRef = useRef<HTMLInputElement>(null);

    const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);

    // Загружаем рестораны при изменении фильтров или страницы
    useEffect(() => {
        fetchRestaurants();
    }, [currentPage, selectedCuisine, searchValue]);

    // Фокусируем поле поиска после загрузки ресторанов
    useEffect(() => {
        if (!loading && searchInputRef.current && searchQuery) {
            searchInputRef.current.focus();
        }
    }, [loading, searchQuery]);

    const fetchRestaurants = async () => {
        try {
            setLoading(true);

            // Формируем параметры запроса
            const params = new URLSearchParams();
            params.append('page', currentPage.toString());

            // Определяем что передавать в cuisine
            let cuisineParam: string | null = null;

            if (selectedCuisine !== 'All Cuisines') {
                // Если выбрана кухня из списка - используем ее
                cuisineParam = selectedCuisine;
            } else if (searchValue.trim()) {
                // Если нет выбранной кухни, но есть поиск - используем поиск
                cuisineParam = searchValue.trim();
            }

            // Добавляем параметр cuisine если есть
            if (cuisineParam) {
                params.append('cuisine', cuisineParam);
            }

            console.log('📡 Fetching restaurants with params:', params.toString());

            const response = await restaurantApi.get(`/restaurants?${params.toString()}`);

            // Проверяем структуру ответа
            console.log('✅ Response data:', response.data);

            if (!response.data) {
                throw new Error('No data received from server');
            }

            // Сохраняем полный объект пагинации
            setPageData(response.data);

            // Извлекаем массив ресторанов из content
            const restaurantsArray = response.data.content || [];
            setRestaurants(restaurantsArray);

            // Устанавливаем общее количество страниц
            setTotalPages(response.data.totalPages || 0);

            setError(null);

        } catch (error: any) {
            console.error('❌ Error fetching restaurants:', error);

            let errorMessage = 'Failed to load restaurants';
            if (error.response?.status === 404) {
                errorMessage = 'API endpoint not found';
            } else if (error.response?.data?.message) {
                errorMessage = error.response.data.message;
            }

            setError(errorMessage);
            setPageData(null);
            setRestaurants([]);
            setTotalPages(0);
        } finally {
            setLoading(false);
        }
    };

    const handleCuisineChange = (event: SelectChangeEvent) => {
        const cuisine = event.target.value;
        setSelectedCuisine(cuisine);
        setSearchQuery(''); // Очищаем поле поиска
        setSearchValue(''); // Очищаем значение для запроса
        setCurrentPage(0);
    };

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setSearchQuery(value); // Обновляем отображаемое значение

        // Используем дебаунс для отправки запроса
        const timeoutId = setTimeout(() => {
            setSearchValue(value); // Обновляем значение для запроса
            setCurrentPage(0); // Сбрасываем страницу
        }, 500);

        // Очищаем предыдущий таймаут
        return () => clearTimeout(timeoutId);
    };

    const handlePageChange = (_event: React.ChangeEvent<unknown>, page: number) => {
        setCurrentPage(page - 1);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleClearFilters = () => {
        setSelectedCuisine('All Cuisines');
        setSearchQuery('');
        setSearchValue('');
        setCurrentPage(0);

        // Фокусируем поле поиска после очистки
        setTimeout(() => {
            if (searchInputRef.current) {
                searchInputRef.current.focus();
            }
        }, 100);
    };

    const handleClearSearch = () => {
        setSearchQuery('');
        setSearchValue('');
        setCurrentPage(0);

        // Фокусируем поле поиска после очистки
        setTimeout(() => {
            if (searchInputRef.current) {
                searchInputRef.current.focus();
            }
        }, 100);
    };

    // Получаем список уникальных кухонь из данных
    const availableCuisines = restaurants && Array.isArray(restaurants)
        ? Array.from(new Set(restaurants.map(r => r.cuisine))).sort()
        : [];

    // Используем доступные кухни или предопределенный список
    const cuisineOptions = availableCuisines.length > 0
        ? ['All Cuisines', ...availableCuisines]
        : ['All Cuisines', 'Italian', 'Mexican', 'Japanese', 'Chinese', 'American', 'Indian', 'French', 'Thai'];

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

            {/* Заголовок и пагинация */}
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
                        inputRef={searchInputRef} // Добавляем ref
                        label="Search by cuisine..."
                        variant="outlined"
                        size="small"
                        value={searchQuery}
                        onChange={handleSearchChange}
                        fullWidth
                        sx={{ flex: 2 }}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Search fontSize="small" />
                                </InputAdornment>
                            ),
                            endAdornment: searchQuery && (
                                <IconButton
                                    size="small"
                                    onClick={handleClearSearch}
                                    edge="end"
                                >
                                    <Clear />
                                </IconButton>
                            )
                        }}
                        disabled={selectedCuisine !== 'All Cuisines'}
                    />

                    {/* Фильтр по кухне */}
                    <FormControl size="small" sx={{ flex: 1, minWidth: 200 }}>
                        <InputLabel>Cuisine Type</InputLabel>
                        <Select
                            value={selectedCuisine}
                            label="Cuisine Type"
                            onChange={handleCuisineChange}
                            disabled={!!searchQuery.trim()}
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
                                    label={`Selected cuisine: ${selectedCuisine}`}
                                    color="primary"
                                    size="small"
                                    onDelete={() => {
                                        setSelectedCuisine('All Cuisines');
                                        setCurrentPage(0);
                                    }}
                                />
                            )}
                            {searchQuery && (
                                <Chip
                                    label={`Searching: "${searchQuery}"`}
                                    color="secondary"
                                    size="small"
                                    onDelete={() => {
                                        setSearchQuery('');
                                        setSearchValue('');
                                        setCurrentPage(0);
                                        // Фокусируем поле поиска после удаления чипа
                                        setTimeout(() => {
                                            if (searchInputRef.current) {
                                                searchInputRef.current.focus();
                                            }
                                        }, 100);
                                    }}
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
            {restaurants.length > 0 ? (
                <>
                    <Grid container spacing={3}>
                        {restaurants.map(restaurant => (
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

                    {/* Пагинация и информация о страницах внизу */}
                    {pageData && totalPages > 0 && (
                        <Box sx={{ mt: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            {/* Информация о текущей странице */}
                            <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                                Page {currentPage + 1} of {totalPages}
                                {pageData.totalElements > 0 && ` • ${pageData.totalElements} total restaurants`}
                                {selectedCuisine !== 'All Cuisines' && ` • Cuisine: ${selectedCuisine}`}
                                {searchValue && ` • Search: "${searchValue}"`}
                            </Typography>

                            {/* Пагинация */}
                            <Pagination
                                count={totalPages}
                                page={currentPage + 1}
                                onChange={handlePageChange}
                                color="primary"
                                showFirstButton
                                showLastButton
                                sx={{ mt: 1 }}
                            />
                        </Box>
                    )}
                </>
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
                        {(!restaurants || restaurants.length === 0)
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
        </Container>
    );
};

export default RestaurantList;