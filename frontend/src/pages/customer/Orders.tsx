import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Container,
    Paper,
    Typography,
    Box,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Chip,
    Alert,
    CircularProgress,
    IconButton,
    Tooltip,
} from '@mui/material';
import {
    ArrowBack,
    ShoppingCart,
    Refresh,
} from '@mui/icons-material';
import { orderApi } from '../../services/orderApi';
import { restaurantApi } from '../../services/restaurantApi';
import { format } from 'date-fns';

interface OrderItemResponseDto {
    id: number;
    dishId: number;
    dishName: string;
    quantity: number;
    price: number;
}

interface PaymentResponseDto {
    id: number;
    amount: number;
    status: string;
    method: string;
    paymentDate: string;
}

interface RestaurantResponseDto {
    id: number;
    name: string;
    cuisine: string;
    address: string;
    dishes: any[];
}

interface OrderResponseDto {
    id: number;
    status: string;
    orderDate: string;
    userId: number;
    restaurantId: number;
    restaurantName?: string;
    totalPrice: number;
    orderItems: OrderItemResponseDto[];
    payment: PaymentResponseDto;
}

interface RestaurantCache {
    [key: number]: RestaurantResponseDto;
}

const Orders: React.FC = () => {
    const navigate = useNavigate();
    const [orders, setOrders] = useState<OrderResponseDto[]>([]);
    const [restaurantCache, setRestaurantCache] = useState<RestaurantCache>({});
    const [loading, setLoading] = useState(true);
    const [loadingRestaurants, setLoadingRestaurants] = useState<Set<number>>(new Set());
    const [error, setError] = useState<string | null>(null);

    // Загружаем список заказов и названия ресторанов
    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const response = await orderApi.get('/orders');
            const ordersData = response.data;
            console.log(ordersData);
            setOrders(ordersData);

            // Загружаем названия ресторанов для всех заказов
            await fetchRestaurantNames(ordersData);
        } catch (error: any) {
            console.error('❌ Error fetching orders:', error);
            setError('Failed to load orders');
        } finally {
            setLoading(false);
        }
    };

    // Функция для загрузки названий ресторанов
    const fetchRestaurantNames = async (ordersData: OrderResponseDto[]) => {
        const uniqueRestaurantIds = [...new Set(ordersData.map(order => order.restaurantId))];

        // Фильтруем те ID, которые еще не загружены
        const idsToLoad = uniqueRestaurantIds.filter(id =>
            !restaurantCache[id] && !loadingRestaurants.has(id)
        );

        if (idsToLoad.length === 0) return;

        // Добавляем ID в loading state
        setLoadingRestaurants(prev => new Set([...prev, ...idsToLoad]));

        try {
            const promises = idsToLoad.map(async (restaurantId) => {
                try {
                    const response = await restaurantApi.get(`/restaurants/${restaurantId}`);
                    return response.data;
                } catch (error) {
                    console.error(`❌ Error fetching restaurant ${restaurantId}:`, error);
                    return {
                        id: restaurantId,
                        name: `Restaurant ${restaurantId}`,
                        cuisine: 'Unknown',
                        address: 'Unknown'
                    };
                }
            });

            const restaurants = await Promise.all(promises);

            // Обновляем кэш
            const newCache = { ...restaurantCache };
            restaurants.forEach(restaurant => {
                newCache[restaurant.id] = restaurant;
            });
            setRestaurantCache(newCache);

            // Обновляем имена ресторанов в заказах
            setOrders(prevOrders =>
                prevOrders.map(order => ({
                    ...order,
                    restaurantName: newCache[order.restaurantId]?.name || `Restaurant ${order.restaurantId}`
                }))
            );

        } catch (error) {
            console.error('❌ Error fetching restaurant names:', error);
        } finally {
            // Удаляем ID из loading state
            setLoadingRestaurants(prev => {
                const newSet = new Set(prev);
                idsToLoad.forEach(id => newSet.delete(id));
                return newSet;
            });
        }
    };

    // Функция для получения названия ресторана
    const getRestaurantName = (restaurantId: number) => {
        if (restaurantCache[restaurantId]) {
            return restaurantCache[restaurantId].name;
        }

        // Если ресторан загружается, показываем спиннер
        if (loadingRestaurants.has(restaurantId)) {
            return 'Loading...';
        }

        return `Restaurant ${restaurantId}`;
    };

    // Функция для получения дополнительной информации о ресторане
    const getRestaurantInfo = (restaurantId: number) => {
        const restaurant = restaurantCache[restaurantId];
        if (!restaurant) return null;

        return {
            cuisine: restaurant.cuisine,
            address: restaurant.address,
            dishCount: restaurant.dishes?.length || 0
        };
    };

    const handleBack = () => {
        navigate('/profile');
    };

    const handleRefresh = () => {
        fetchOrders();
    };

    // Форматирование даты
    const formatDate = (dateString: string) => {
        try {
            return format(new Date(dateString), 'dd.MM.yyyy HH:mm');
        } catch {
            return dateString;
        }
    };

    // Получение цвета для статуса
    const getStatusColor = (status: string) => {
        switch (status.toUpperCase()) {
            case 'PLACED': return 'warning';
            case 'COOKING': return 'secondary';
            case 'READY': return 'primary';
            case 'DELIVERED': return 'success';
            case 'CANCELLED': return 'error';
            default: return 'default';
        }
    };

    // Форматирование цены
    const formatPrice = (price: number) => {
        return `$${price.toFixed(2)}`;
    };

    if (loading) {
        return (
            <Container maxWidth="lg" sx={{ py: 4, display: 'flex', justifyContent: 'center' }}>
                <CircularProgress />
            </Container>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
                {/* Заголовок и кнопки */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Button
                            startIcon={<ArrowBack />}
                            onClick={handleBack}
                            sx={{ mr: 2 }}
                        >
                            Back to profile
                        </Button>
                        <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
                            <ShoppingCart sx={{ mr: 2, verticalAlign: 'middle' }} />
                            Orders
                        </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Typography variant="body1" color="textSecondary">
                            Total orders: {orders.length}
                        </Typography>
                        <Tooltip title="Refresh orders">
                            <IconButton onClick={handleRefresh} color="primary">
                                <Refresh />
                            </IconButton>
                        </Tooltip>
                    </Box>
                </Box>

                {/* Сообщения об ошибках */}
                {error && (
                    <Alert severity="error" sx={{ mb: 3 }}>
                        {error}
                    </Alert>
                )}

                {/* Таблица заказов */}
                <TableContainer component={Paper} variant="outlined">
                    <Table>
                        <TableHead sx={{ bgcolor: 'primary.dark' }}>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>Date</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>Restaurant</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>Status</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>Total</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>Status payment</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>Payment</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {orders.map((order) => {
                                const restaurantInfo = getRestaurantInfo(order.restaurantId);
                                const isRestaurantLoading = loadingRestaurants.has(order.restaurantId);

                                return (
                                    <TableRow key={order.id} hover>
                                        <TableCell>
                                            <Typography variant="body2">
                                                {formatDate(order.orderDate)}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Box>
                                                <Typography variant="body1" fontWeight="bold">
                                                    {isRestaurantLoading ? (
                                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                            <CircularProgress size={16} />
                                                            Loading...
                                                        </Box>
                                                    ) : (
                                                        getRestaurantName(order.restaurantId)
                                                    )}
                                                </Typography>
                                                {restaurantInfo && (
                                                    <Typography variant="caption" color="textSecondary">
                                                        {restaurantInfo.cuisine} • {restaurantInfo.address}
                                                    </Typography>
                                                )}
                                            </Box>
                                        </TableCell>
                                        <TableCell>
                                            <Chip
                                                label={order.status}
                                                color={getStatusColor(order.status) as any}
                                                size="small"
                                                sx={{
                                                    fontWeight: 'bold',
                                                    borderRadius: 2
                                                }}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body1" fontWeight="bold">
                                                {formatPrice(order.totalPrice)}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Chip
                                                label={order.payment?.status || 'N/A'}
                                                color={order.payment?.status === 'PAID' ? 'success' : 'warning'}
                                                size="small"
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Chip
                                                label={order.payment.method}
                                                size="small"
                                            />
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </TableContainer>

                {orders.length === 0 && !loading && (
                    <Alert severity="info" sx={{ mt: 3 }}>
                        No orders found.
                    </Alert>
                )}
            </Paper>
        </Container>
    );
};

export default Orders;