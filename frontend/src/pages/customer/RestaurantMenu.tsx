import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Container,
    Paper,
    Typography,
    Box,
    Button,
    Grid,
    Card,
    CardContent,
    CardMedia,
    Chip,
    Alert,
    CircularProgress,
    Divider,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Snackbar,
    FormControl,
    InputLabel,
    Select,
    MenuItem
} from '@mui/material';
import {
    ArrowBack,
    ShoppingCart,
    LocationOn,
    LocalDining,
    AttachMoney,
    Restaurant,
    Add,
    Remove
} from '@mui/icons-material';
import { api } from '../../services/api';
import {useSelector} from "react-redux";
import type {RootState} from "../../store";

// Типы для заказа
interface OrderItemRequestDto {
    dishId: number;
    quantity: number;
    price: number;
}

interface OrderRequestDto {
    restaurantId: number;
    orderItems: OrderItemRequestDto[];
    paymentMethod: string;
}

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

const RestaurantMenu: React.FC = () => {
    const { restaurantId } = useParams<{ restaurantId: string }>();
    const navigate = useNavigate();

    const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);

    // Основные состояния
    const [restaurant, setRestaurant] = useState<RestaurantResponseDto | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Корзина с количеством
    const [cart, setCart] = useState<{dish: DishResponseDto, quantity: number}[]>([]);

    // Состояния для заказа
    const [checkoutDialogOpen, setCheckoutDialogOpen] = useState(false);
    const [orderLoading, setOrderLoading] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState('CARD');

    // Уведомления
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success' as 'success' | 'error'
    });

    // Методы оплаты
    const paymentMethods = [
        { value: 'CARD', label: '💳 Credit/Debit Card' },
        { value: 'CASH', label: '💵 Cash on Delivery' },
        { value: 'PAYPAL', label: '🔵 PayPal' }
    ];

    useEffect(() => {
        const fetchRestaurant = async () => {
            try {
                setLoading(true);
                console.log('🔄 Fetching restaurant ID:', restaurantId);

                // Используем endpoint из RestaurantList.tsx
                const response = await api.get(`http://localhost:8082/restaurants/${restaurantId}`);
                console.log('✅ Restaurant data received:', response.data);

                setRestaurant(response.data);

            } catch (error: any) {
                console.error('❌ Error fetching restaurant:', error);
                setError(`Failed to load restaurant: ${error.message}`);
            } finally {
                setLoading(false);
            }
        };

        if (restaurantId) {
            fetchRestaurant();
        } else {
            setError('No restaurant ID provided');
            setLoading(false);
        }
    }, [restaurantId]);

    const handleAddToCart = (dish: DishResponseDto) => {
        // 👇 Проверяем авторизацию
        if (!isAuthenticated) {
            // Сохраняем информацию о ресторане и блюде для возврата после логина
            localStorage.setItem('redirectAfterLogin', `/restaurants/${restaurantId}`);
            localStorage.setItem('dishToAdd', JSON.stringify({
                id: dish.id,
                name: dish.name
            }));

            // Перенаправляем на логин
            navigate('/login');
            return;
        }

        // Если пользователь авторизован - добавляем в корзину
        setCart(prev => {
            const existing = prev.find(item => item.dish.id === dish.id);
            if (existing) {
                return prev.map(item =>
                    item.dish.id === dish.id
                        ? {...item, quantity: item.quantity + 1}
                        : item
                );
            } else {
                return [...prev, { dish, quantity: 1 }];
            }
        });

        // 👇 Показываем уведомление об успешном добавлении
        setSnackbar({
            open: true,
            message: `"${dish.name}" added to cart!`,
            severity: 'success'
        });
    };

    const handleRemoveFromCart = (dishId: number) => {
        setCart(prev => prev.filter(item => item.dish.id !== dishId));
    };

    const handleUpdateQuantity = (dishId: number, newQuantity: number) => {
        if (newQuantity < 1) {
            handleRemoveFromCart(dishId);
            return;
        }

        setCart(prev =>
            prev.map(item =>
                item.dish.id === dishId
                    ? {...item, quantity: newQuantity}
                    : item
            )
        );
    };

    const handleGoBack = () => {
        navigate('/restaurants');
    };

    const handleCheckoutClick = () => {
        // 👇 Проверяем авторизацию
        if (!isAuthenticated) {
            localStorage.setItem('redirectAfterLogin', `/restaurants/${restaurantId}`);
            navigate('/login');
            return;
        }

        // Если корзина пустая - показываем сообщение
        if (cart.length === 0) {
            setSnackbar({
                open: true,
                message: 'Your cart is empty!',
                severity: 'error'
            });
            return;
        }

        setCheckoutDialogOpen(true);
    };

    // СОЗДАНИЕ ЗАКАЗА - ГЛАВНОЕ!
    const handlePlaceOrder = async () => {
        if (!restaurant || cart.length === 0) return;

        try {
            setOrderLoading(true);

            // Формируем заказ
            const orderRequest: OrderRequestDto = {
                restaurantId: restaurant.id,
                orderItems: cart.map(item => ({
                    dishId: item.dish.id,
                    quantity: item.quantity,
                    price: item.dish.price
                })),
                paymentMethod: paymentMethod
            };

            console.log('🔄 Sending order to port 8083:', orderRequest);

            // Отправляем заказ на order-service (порт 8083)
            const response = await api.post('http://localhost:8083/orders', orderRequest);
            console.log('✅ Order created:', response.data);

            // Показываем успешное уведомление
            setSnackbar({
                open: true,
                message: `Order #${response.data.id} placed successfully! Status: ${response.data.status}`,
                severity: 'success'
            });

            // Закрываем диалог и очищаем корзину
            setCheckoutDialogOpen(false);
            setCart([]);
            setPaymentMethod('CARD');

        } catch (error: any) {
            console.error('❌ Error placing order:', error);

            let errorMessage = 'Failed to place order';
            if (error.response?.data?.message) {
                errorMessage = error.response.data.message;
            } else if (error.response?.data?.messages) {
                errorMessage = Object.values(error.response.data.messages).join(', ');
            }

            setSnackbar({
                open: true,
                message: errorMessage,
                severity: 'error'
            });
        } finally {
            setOrderLoading(false);
        }
    };

    // Вспомогательные функции
    const calculateTotal = () => {
        return cart.reduce((sum, item) => sum + (item.dish.price * item.quantity), 0).toFixed(2);
    };

    const getCartCount = () => {
        return cart.reduce((sum, item) => sum + item.quantity, 0);
    };

    const getCartItemCount = (dishId: number) => {
        const item = cart.find(item => item.dish.id === dishId);
        return item ? item.quantity : 0;
    };

    // Компоненты загрузки и ошибок
    if (loading) {
        return (
            <Container sx={{
                py: 8,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 2
            }}>
                <CircularProgress />
                <Typography variant="body2" color="textSecondary">
                    Loading menu...
                </Typography>
            </Container>
        );
    }

    if (error || !restaurant) {
        return (
            <Container sx={{ py: 4 }}>
                <Paper sx={{ p: 3 }}>
                    <Alert
                        severity="error"
                        sx={{ mb: 2 }}
                        action={
                            <Button color="inherit" size="small" onClick={handleGoBack}>
                                Back
                            </Button>
                        }
                    >
                        {error || 'Restaurant not found'}
                    </Alert>

                    <Button
                        startIcon={<ArrowBack />}
                        onClick={handleGoBack}
                        sx={{ mt: 2 }}
                    >
                        Back to Restaurants
                    </Button>
                </Paper>
            </Container>
        );
    }

    return (
        <>
            <Container maxWidth="lg" sx={{ py: 4 }}>
                {/* Шапка ресторана */}
                <Paper elevation={3} sx={{ p: 4, borderRadius: 3, mb: 4 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <Box>
                            <Button
                                startIcon={<ArrowBack />}
                                onClick={handleGoBack}
                                sx={{ mb: 2 }}
                                variant="outlined"
                            >
                                Back to Restaurants
                            </Button>

                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                                <Box>
                                    <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
                                        <Restaurant sx={{ mr: 2, verticalAlign: 'middle' }} />
                                        {restaurant.name}
                                    </Typography>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                                        <Chip
                                            label={restaurant.cuisine}
                                            color='secondary'
                                            size="small"
                                            sx={{
                                                fontWeight: 'bold',
                                                borderRadius: 2
                                            }}
                                        />
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'text.secondary' }}>
                                            <LocationOn fontSize="small" />
                                            <Typography variant="body2">
                                                {restaurant.address}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Box>
                            </Box>
                        </Box>

                        {/* Корзина */}
                        {cart.length > 0 && (
                            <Paper variant="outlined" sx={{ p: 2, minWidth: 250, borderLeft: '4px solid', borderLeftColor: 'success.main' }}>
                                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <ShoppingCart /> Your Order ({getCartCount()})
                                </Typography>

                                <Box sx={{ maxHeight: 150, overflow: 'auto', mb: 2 }}>
                                    {cart.map((item, index) => (
                                        <Box
                                            key={index}
                                            sx={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center',
                                                py: 1,
                                                borderBottom: index < cart.length - 1 ? '1px solid' : 'none',
                                                borderBottomColor: 'divider'
                                            }}
                                        >
                                            <Box>
                                                <Typography variant="body2" fontWeight="medium">
                                                    {item.dish.name}
                                                </Typography>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                                                    <IconButton
                                                        size="small"
                                                        onClick={() => handleUpdateQuantity(item.dish.id, item.quantity - 1)}
                                                        sx={{ p: 0 }}
                                                    >
                                                        <Remove fontSize="small" />
                                                    </IconButton>
                                                    <Typography variant="caption">
                                                        {item.quantity}
                                                    </Typography>
                                                    <IconButton
                                                        size="small"
                                                        onClick={() => handleUpdateQuantity(item.dish.id, item.quantity + 1)}
                                                        sx={{ p: 0 }}
                                                    >
                                                        <Add fontSize="small" />
                                                    </IconButton>
                                                </Box>
                                            </Box>
                                            <Box sx={{ textAlign: 'right' }}>
                                                <Typography variant="body2" color="textSecondary">
                                                    ${item.dish.price.toFixed(2)} × {item.quantity}
                                                </Typography>
                                                <Typography variant="body2" fontWeight="bold">
                                                    ${(item.dish.price * item.quantity).toFixed(2)}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    ))}
                                </Box>

                                <Divider sx={{ my: 1 }} />

                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                    <Typography variant="body1" fontWeight="bold">Total:</Typography>
                                    <Typography variant="h6" color="success.main" fontWeight="bold">
                                        ${calculateTotal()}
                                    </Typography>
                                </Box>

                                <Button
                                    variant="contained"
                                    color="warning"
                                    fullWidth
                                    onClick={handleCheckoutClick}
                                    size="large"
                                >
                                    Checkout (${calculateTotal()})
                                </Button>
                            </Paper>
                        )}
                    </Box>
                </Paper>

                {/* Меню блюд */}
                <Box sx={{ mb: 3 }}>
                    <Typography variant="h5" gutterBottom sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        fontWeight: 'bold'
                    }}>
                        <LocalDining /> Menu
                        <Chip
                            label={`${restaurant.dishes?.length || 0} items`}
                            size="small"
                            color="info"
                            variant="outlined"
                        />
                    </Typography>
                    <Divider />
                </Box>

                {!restaurant.dishes || restaurant.dishes.length === 0 ? (
                    <Alert severity="info" sx={{ mb: 3 }}>
                        No dishes available in this restaurant yet.
                    </Alert>
                ) : (
                    <Grid container spacing={3}>
                        {restaurant.dishes.map((dish) => {
                            const itemCount = getCartItemCount(dish.id);

                            return (
                                <Grid xs={12} sm={6} md={4} key={dish.id}>
                                    <Card sx={{
                                        height: '100%',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        transition: 'transform 0.2s, box-shadow 0.2s',
                                        '&:hover': {
                                            transform: 'translateY(-4px)',
                                            boxShadow: 6
                                        }
                                    }}>
                                        {dish.imageUrl ? (
                                            <CardMedia
                                                component="img"
                                                height="180"
                                                image={dish.imageUrl}
                                                alt={dish.name}
                                                sx={{ objectFit: 'cover' }}
                                            />
                                        ) : (
                                            <Box
                                                sx={{
                                                    height: 180,
                                                    bgcolor: 'grey.100',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center'
                                                }}
                                            >
                                                <LocalDining sx={{ fontSize: 60, color: 'grey.400' }} />
                                            </Box>
                                        )}

                                        <CardContent sx={{ flexGrow: 1 }}>
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                                                <Typography variant="h6" component="h3" sx={{ fontWeight: 'bold' }}>
                                                    {dish.name}
                                                </Typography>
                                                <Chip
                                                    label={`$${dish.price.toFixed(2)}`}
                                                    color="success"
                                                    size="small"
                                                    icon={<AttachMoney />}
                                                />
                                            </Box>
                                            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                                {dish.description || 'No description available'}
                                            </Typography>
                                        </CardContent>

                                        <Box sx={{ p: 2, pt: 0 }}>
                                            {itemCount > 0 ? (
                                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
                                                    <IconButton
                                                        color="error"
                                                        onClick={() => handleUpdateQuantity(dish.id, itemCount - 1)}
                                                        size="small"
                                                    >
                                                        <Remove />
                                                    </IconButton>
                                                    <Typography variant="h6" sx={{ minWidth: 30, textAlign: 'center' }}>
                                                        {itemCount}
                                                    </Typography>
                                                    <IconButton
                                                        color="success"
                                                        onClick={() => handleUpdateQuantity(dish.id, itemCount + 1)}
                                                        size="small"
                                                    >
                                                        <Add />
                                                    </IconButton>
                                                </Box>
                                            ) : (
                                                <Button
                                                    variant="contained"
                                                    fullWidth
                                                    color="warning"
                                                    onClick={() => handleAddToCart(dish)}
                                                    startIcon={<ShoppingCart />}
                                                    sx={{ fontWeight: 'bold' }}
                                                >
                                                    {isAuthenticated ? 'Add to Cart' : 'Sign in to Order'}
                                                </Button>
                                            )}
                                        </Box>
                                    </Card>
                                </Grid>
                            );
                        })}
                    </Grid>
                )}

                {/* Сообщение о пустой корзине */}
                {cart.length === 0 && (
                    <Alert severity="info" sx={{ mt: 4 }}>
                        <Typography variant="body2">
                            Select dishes from the menu to add them to your cart.
                        </Typography>
                    </Alert>
                )}
            </Container>

            {/* Диалог оформления заказа */}
            <Dialog open={checkoutDialogOpen} onClose={() => setCheckoutDialogOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <ShoppingCart /> Confirm Order
                    </Box>
                </DialogTitle>

                <DialogContent>
                    <Box sx={{ pt: 2 }}>
                        <Typography variant="h6" gutterBottom>{restaurant?.name}</Typography>

                        <Paper variant="outlined" sx={{ p: 2, mb: 3, maxHeight: 200, overflow: 'auto' }}>
                            {cart.map((item, index) => (
                                <Box key={index} sx={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    py: 1,
                                    borderBottom: index < cart.length - 1 ? '1px solid' : 'none',
                                    borderBottomColor: 'divider'
                                }}>
                                    <Box>
                                        <Typography variant="body2" fontWeight="medium">
                                            {item.dish.name}
                                        </Typography>
                                        <Typography variant="caption" color="textSecondary">
                                            Quantity: {item.quantity}
                                        </Typography>
                                    </Box>
                                    <Typography variant="body2" fontWeight="bold">
                                        ${(item.dish.price * item.quantity).toFixed(2)}
                                    </Typography>
                                </Box>
                            ))}
                        </Paper>

                        <Divider sx={{ my: 2 }} />

                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                            <Typography variant="h6">Total:</Typography>
                            <Typography variant="h5" color="success.main" fontWeight="bold">
                                ${calculateTotal()}
                            </Typography>
                        </Box>

                        <FormControl fullWidth sx={{ mb: 2 }}>
                            <InputLabel>Payment Method</InputLabel>
                            <Select
                                value={paymentMethod}
                                label="Payment Method"
                                onChange={(e) => setPaymentMethod(e.target.value)}
                            >
                                {paymentMethods.map(method => (
                                    <MenuItem key={method.value} value={method.value}>
                                        {method.label}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Box>
                </DialogContent>

                <DialogActions sx={{ p: 3, pt: 0 }}>
                    <Button onClick={() => setCheckoutDialogOpen(false)} disabled={orderLoading}>
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        color="warning"
                        onClick={handlePlaceOrder}
                        disabled={orderLoading || cart.length === 0}
                        startIcon={orderLoading ? <CircularProgress size={20} /> : <ShoppingCart />}
                        sx={{ minWidth: 150 }}
                    >
                        {orderLoading ? 'Processing...' : `Pay $${calculateTotal()}`}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Уведомление */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={() => setSnackbar({...snackbar, open: false})}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert
                    severity={snackbar.severity}
                    onClose={() => setSnackbar({...snackbar, open: false})}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </>
    );
};

export default RestaurantMenu;