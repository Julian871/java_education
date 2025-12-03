import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
    IconButton,
    Chip,
    Alert,
    CircularProgress,
    Dialog,
    DialogTitle,
    DialogContent,
    FormControl,
    Select,
    MenuItem,
    Tooltip, type SelectChangeEvent
} from '@mui/material';
import {
    ArrowBack,
    ShoppingCart,
    AccessTime,
    Paid,
    Refresh,
    ArrowDropDown,
    Restaurant
} from '@mui/icons-material';
import { format } from 'date-fns';

// API
import { orderApi } from '../../services/orderApi';
import { restaurantApi } from '../../services/restaurantApi';

// Типы данных
interface OrderItemResponseDto {
    id: number;
    dishId: number;
    quantity: number;
    price: number;
}

interface PaymentResponseDto {
    id: number;
    method: string;
    amount: number;
    status: string;
    orderId: number;
}

interface OrderResponseDto {
    id: number;
    status: string;
    orderDate: string;
    userId: number;
    restaurantId: number;
    totalPrice: number;
    orderItems: OrderItemResponseDto[];
    payment: PaymentResponseDto;
}

interface RestaurantCache {
    [key: number]: string; // restaurantId -> restaurantName
}

// Статусы заказов
const ORDER_STATUSES = [
    'PLACED',
    'COOKING',
    'READY',
    'DELIVERED',
    'CANCELLED'
];

const ManageOrders: React.FC = () => {
    const { userId } = useParams<{ userId: string }>();
    const navigate = useNavigate();

    const [orders, setOrders] = useState<OrderResponseDto[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [selectedOrder] = useState<OrderResponseDto | null>(null);
    const [restaurantCache, setRestaurantCache] = useState<RestaurantCache>({});
    const [loadingRestaurants, setLoadingRestaurants] = useState<Set<number>>(new Set());

    // Загружаем заказы пользователя
    useEffect(() => {
        if (userId) {
            fetchOrders();
        }
    }, [userId]);

    const fetchOrders = async () => {
        if (!userId) return;

        try {
            setLoading(true);
            setError(null);

            // Получаем заказы пользователя
            const response = await orderApi.get(`/orders/user/${userId}`);
            const ordersData = response.data;
            setOrders(ordersData);

            // Загружаем названия ресторанов
            await fetchRestaurantNames(ordersData);

        } catch (error: any) {
            console.error('❌ Error fetching orders:', error);
            setError(`Failed to load orders: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    // Загружаем названия ресторанов
    const fetchRestaurantNames = async (ordersData: OrderResponseDto[]) => {
        const uniqueRestaurantIds = [...new Set(ordersData.map(order => order.restaurantId))];

        // Фильтруем те ID, которые еще не загружены
        const idsToLoad = uniqueRestaurantIds.filter(id =>
            !restaurantCache[id] && !loadingRestaurants.has(id)
        );

        if (idsToLoad.length === 0) return;

        setLoadingRestaurants(prev => new Set([...prev, ...idsToLoad]));

        try {
            const promises = idsToLoad.map(async (restaurantId) => {
                try {
                    const response = await restaurantApi.get(`/restaurants/${restaurantId}`);
                    return { id: restaurantId, name: response.data.name };
                } catch (error) {
                    console.error(`❌ Error fetching restaurant ${restaurantId}:`, error);
                    return { id: restaurantId, name: `Restaurant ${restaurantId}` };
                }
            });

            const restaurants = await Promise.all(promises);
            const newCache = { ...restaurantCache };
            restaurants.forEach(restaurant => {
                newCache[restaurant.id] = restaurant.name;
            });
            setRestaurantCache(newCache);
        } catch (error) {
            console.error('❌ Error fetching restaurant names:', error);
        } finally {
            setLoadingRestaurants(prev => {
                const newSet = new Set(prev);
                idsToLoad.forEach(id => newSet.delete(id));
                return newSet;
            });
        }
    };

    // Получаем название ресторана
    const getRestaurantName = (restaurantId: number) => {
        if (restaurantCache[restaurantId]) {
            return restaurantCache[restaurantId];
        }
        if (loadingRestaurants.has(restaurantId)) {
            return 'Loading...';
        }
        return `Restaurant ${restaurantId}`;
    };

    // Изменение статуса заказа
    const handleStatusChange = async (orderId: number, newStatus: string) => {
        try {
            // Отправляем PATCH запрос на изменение статуса
            await orderApi.patch(`orders/${orderId}/status?status=${encodeURIComponent(newStatus)}`);

            // Обновляем локальное состояние
            setOrders(prevOrders =>
                prevOrders.map(order =>
                    order.id === orderId ? { ...order, status: newStatus } : order
                )
            );
        } catch (error: any) {
            console.error('❌ Error updating order status:', error);
            setError(`Failed to update order status: ${error.message}`);
        }
    };

    const handleBack = () => {
        navigate('/admin/users');
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

    // Форматирование цены
    const formatPrice = (price: number) => {
        return `$${price.toFixed(2)}`;
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

    // Получение цвета для статуса оплаты
    const getPaymentColor = (status: string) => {
        switch (status.toUpperCase()) {
            case 'PAID': return 'success';
            case 'PENDING': return 'warning';
            case 'FAILED': return 'error';
            default: return 'default';
        }
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
                            Back to Users
                        </Button>
                        <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
                            <ShoppingCart sx={{ mr: 2, verticalAlign: 'middle' }} />
                            User #{userId} Orders
                        </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        {orders.length > 0 && (
                            <Typography variant="body1" color="textSecondary">
                                Total orders: {orders.length}
                            </Typography>
                        )}
                        <Tooltip title="Refresh orders">
                            <IconButton onClick={handleRefresh} color="primary">
                                <Refresh />
                            </IconButton>
                        </Tooltip>
                    </Box>
                </Box>

                {/* Сообщения об ошибках */}
                {error && (
                    <Alert
                        severity="error"
                        sx={{ mb: 3 }}
                        action={
                            <Button
                                color="inherit"
                                size="small"
                                onClick={handleRefresh}
                                startIcon={<Refresh />}
                            >
                                Retry
                            </Button>
                        }
                    >
                        {error}
                    </Alert>
                )}

                {/* Таблица заказов */}
                {orders.length > 0 ? (
                    <TableContainer component={Paper} variant="outlined">
                        <Table>
                            <TableHead sx={{ bgcolor: 'error.dark' }}>
                                <TableRow>
                                    <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>Order ID</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>Date</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>Restaurant</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>Status</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>Total</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>Payment</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {orders
                                    .sort((a, b) => b.id - a.id)
                                    .map((order) => (
                                    <TableRow key={order.id} hover>
                                        <TableCell>
                                            <Typography variant="body2" fontWeight="medium">
                                                #{order.id}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <AccessTime fontSize="small" color="action" />
                                                <Typography variant="body2">
                                                    {formatDate(order.orderDate)}
                                                </Typography>
                                            </Box>
                                        </TableCell>
                                        <TableCell>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <Restaurant fontSize="small" color="action" />
                                                <Typography variant="body2">
                                                    {loadingRestaurants.has(order.restaurantId) ? (
                                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                            <CircularProgress size={16} />
                                                            Loading...
                                                        </Box>
                                                    ) : (
                                                        getRestaurantName(order.restaurantId)
                                                    )}
                                                </Typography>
                                            </Box>
                                        </TableCell>
                                        <TableCell>
                                            <FormControl size="small" sx={{ minWidth: 150 }}>
                                                <Select
                                                    value={order.status}
                                                    onChange={(e: SelectChangeEvent) =>
                                                        handleStatusChange(order.id, e.target.value)
                                                    }
                                                    IconComponent={ArrowDropDown}
                                                    sx={{
                                                        bgcolor: `${getStatusColor(order.status)}.light`,
                                                        borderRadius: 2,
                                                        '& .MuiSelect-select': {
                                                            fontWeight: 'bold',
                                                            color: 'white'
                                                        }
                                                    }}
                                                >
                                                    {ORDER_STATUSES.map((status) => (
                                                        <MenuItem key={status} value={status}>
                                                            <Chip
                                                                label={status}
                                                                color={getStatusColor(status) as any}
                                                                size="small"
                                                                sx={{
                                                                    fontWeight: 'bold',
                                                                    borderRadius: 2,
                                                                    width: '100%',
                                                                    justifyContent: 'center'
                                                                }}
                                                            />
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                            </FormControl>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body1" fontWeight="bold">
                                                {formatPrice(order.totalPrice)}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            {order.payment ? (
                                                <Chip
                                                    icon={<Paid />}
                                                    label={`${order.payment.status} (${order.payment.method})`}
                                                    color={getPaymentColor(order.payment.status) as any}
                                                    size="small"
                                                    sx={{
                                                        fontWeight: 'bold',
                                                        borderRadius: 2
                                                    }}
                                                />
                                            ) : (
                                                <Chip
                                                    label="No payment"
                                                    size="small"
                                                    color="default"
                                                    variant="outlined"
                                                />
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                ) : !loading && !error ? (
                    <Alert severity="info" sx={{ mt: 3 }}>
                        No orders found for this user.
                    </Alert>
                ) : null}
            </Paper>

            {/* 👇 ДИАЛОГ УДАЛЕНИЯ ЗАКАЗА */}
            <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
                <DialogTitle>Delete Order</DialogTitle>
                <DialogContent>
                    {selectedOrder && (
                        <>
                            <Box sx={{ mb: 2 }}>
                                <Typography variant="h6" gutterBottom>
                                    Order #{selectedOrder.id}
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                    Date: {formatDate(selectedOrder.orderDate)}
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                    Restaurant: {getRestaurantName(selectedOrder.restaurantId)}
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                    Total: {formatPrice(selectedOrder.totalPrice)}
                                </Typography>
                            </Box>

                            <Typography>
                                Are you sure you want to delete this order?
                            </Typography>
                            <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                                This action cannot be undone. All order items will be permanently deleted.
                            </Typography>

                            {selectedOrder.payment && (
                                <Alert severity="warning" sx={{ mt: 2 }}>
                                    <Typography variant="body2" fontWeight="bold">
                                        ⚠️ Note: Payment record #{selectedOrder.payment.id} will remain in the system.
                                    </Typography>
                                </Alert>
                            )}
                        </>
                    )}
                </DialogContent>
            </Dialog>
        </Container>
    );
};

export default ManageOrders;