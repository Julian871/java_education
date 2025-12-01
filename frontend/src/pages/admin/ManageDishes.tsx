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
    DialogActions,
    TextField,
    Avatar
} from '@mui/material';
import {
    Edit,
    Delete,
    ArrowBack,
    Add,
    RestaurantMenu,
    LocalDining
} from '@mui/icons-material';
import { restaurantApi } from '../../services/restaurantApi';

interface DishResponseDto {
    id: number;
    name: string;
    description: string;
    price: number;
    imageUrl: string;
}

interface DishRequestDto {
    name: string;
    description: string;
    price: number;
    imageUrl: string;
}

interface RestaurantInfo {
    id: number;
    name: string;
    cuisine: string;
}

const ManageDishes: React.FC = () => {
    const { restaurantId } = useParams<{ restaurantId: string }>();
    const navigate = useNavigate();

    const [restaurant, setRestaurant] = useState<RestaurantInfo | null>(null);
    const [dishes, setDishes] = useState<DishResponseDto[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Диалоги
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [createDialogOpen, setCreateDialogOpen] = useState(false);

    const [selectedDish, setSelectedDish] = useState<DishResponseDto | null>(null);

    // Формы
    const [editFormData, setEditFormData] = useState<DishRequestDto>({
        name: '',
        description: '',
        price: 0,
        imageUrl: ''
    });

    const [createFormData, setCreateFormData] = useState<DishRequestDto>({
        name: '',
        description: '',
        price: 0,
        imageUrl: ''
    });

    // Загружаем информацию о ресторане и блюдах
    useEffect(() => {
        if (restaurantId) {
            fetchRestaurantAndDishes();
        }
    }, [restaurantId]);

    const fetchRestaurantAndDishes = async () => {
        try {
            setLoading(true);

            // 1. Получаем информацию о ресторане
            const restaurantResponse = await restaurantApi.get(`/restaurants/${restaurantId}`);
            setRestaurant({
                id: restaurantResponse.data.id,
                name: restaurantResponse.data.name,
                cuisine: restaurantResponse.data.cuisine
            });

            // 2. Получаем блюда ресторана
            const dishesResponse = await restaurantApi.get(`/restaurants/${restaurantId}/dishes`);
            setDishes(dishesResponse.data || []);

        } catch (error: any) {
            console.error('❌ Error fetching restaurant dishes:', error);
            setError('Failed to load dishes');
        } finally {
            setLoading(false);
        }
    };

    // Открытие диалога редактирования
    const handleEditClick = (dish: DishResponseDto) => {
        setSelectedDish(dish);
        setEditFormData({
            name: dish.name,
            description: dish.description,
            price: dish.price,
            imageUrl: dish.imageUrl
        });
        setEditDialogOpen(true);
    };

    // Открытие диалога удаления
    const handleDeleteClick = (dish: DishResponseDto) => {
        setSelectedDish(dish);
        setDeleteDialogOpen(true);
    };

    // Открытие диалога создания
    const handleCreateClick = () => {
        setCreateFormData({
            name: '',
            description: '',
            price: 0,
            imageUrl: ''
        });
        setCreateDialogOpen(true);
    };

    // Обновление блюда
    const handleUpdate = async () => {
        if (!selectedDish || !restaurantId) return;

        try {
            await restaurantApi.put(
                `/admin/restaurants/dishes/${selectedDish.id}`,
                editFormData
            );
            await fetchRestaurantAndDishes();
            setEditDialogOpen(false);
            setSelectedDish(null);
        } catch (error: any) {
            console.error('❌ Error updating dish:', error);
            setError('Failed to update dish');
        }
    };

    // Удаление блюда
    const handleDelete = async () => {
        if (!selectedDish || !restaurantId) return;

        try {
            await restaurantApi.delete(
                `/admin/restaurants/dishes/${selectedDish.id}`
            );
            await fetchRestaurantAndDishes(); // Обновляем список
            setDeleteDialogOpen(false);
            setSelectedDish(null);
        } catch (error: any) {
            console.error('❌ Error deleting dish:', error);
            setError('Failed to delete dish');
        }
    };

    // Создание блюда
    const handleCreate = async () => {
        if (!restaurantId) return;

        try {
            await restaurantApi.post(
                `/admin/restaurants/${restaurantId}/dishes`,
                createFormData
            );
            await fetchRestaurantAndDishes();
            setCreateDialogOpen(false);
        } catch (error: any) {
            console.error('❌ Error creating dish:', error);
            setError('Failed to create dish');
        }
    };

    const handleBack = () => {
        navigate('/admin/restaurants');
    };

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

    if (!restaurant) {
        return (
            <Container maxWidth="lg" sx={{ py: 4 }}>
                <Alert severity="error">Restaurant not found</Alert>
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
                            Back to Restaurants
                        </Button>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                            <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
                                {restaurant.name}
                            </Typography>
                            <Chip
                                label={restaurant.cuisine}
                                color='secondary'
                                size="small"
                                sx={{
                                    fontWeight: 'bold',
                                    borderRadius: 2
                                }}
                            />
                        </Box>
                    </Box>
                    <Button
                        variant="contained"
                        color="warning"
                        startIcon={<Add />}
                        onClick={handleCreateClick}
                    >
                        Add Dish
                    </Button>
                </Box>

                <Box sx={{ mb: 3 }}>
                    <Typography variant="body1" color="textSecondary">
                        Total dishes: {dishes.length}
                    </Typography>
                </Box>

                {/* Сообщения об ошибках */}
                {error && (
                    <Alert severity="error" sx={{ mb: 3 }}>
                        {error}
                    </Alert>
                )}

                {/* Таблица блюд */}
                <TableContainer component={Paper} variant="outlined">
                    <Table>
                        <TableHead sx={{ bgcolor: 'error.dark' }}>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>Image</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>Name</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>Description</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>Price</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {dishes.map((dish) => (
                                <TableRow key={dish.id} hover>
                                    <TableCell>
                                        <Avatar
                                            src={dish.imageUrl}
                                            alt={dish.name}
                                            variant="rounded"
                                            sx={{ width: 60, height: 60 }}
                                        >
                                            <RestaurantMenu />
                                        </Avatar>
                                    </TableCell>
                                    <TableCell sx={{ fontWeight: 'medium' }}>
                                        {dish.name}
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="body2" color="textSecondary">
                                            {dish.description}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Chip
                                            label={formatPrice(dish.price)}
                                            color="success"
                                            variant="outlined"
                                            size="small"
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <IconButton
                                            color="primary"
                                            onClick={() => handleEditClick(dish)}
                                            size="small"
                                            sx={{ mr: 1 }}
                                        >
                                            <Edit />
                                        </IconButton>
                                        <IconButton
                                            color="error"
                                            onClick={() => handleDeleteClick(dish)}
                                            size="small"
                                        >
                                            <Delete />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>

                {dishes.length === 0 && !loading && (
                    <Alert severity="info" sx={{ mt: 3 }}>
                        No dishes found. Add your first dish!
                    </Alert>
                )}
            </Paper>

            {/* 👇 ДИАЛОГ РЕДАКТИРОВАНИЯ БЛЮДА */}
            <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Edit Dish</DialogTitle>
                <DialogContent>
                    <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <TextField
                            label="Dish Name *"
                            value={editFormData.name}
                            onChange={(e) => setEditFormData({...editFormData, name: e.target.value})}
                            fullWidth
                            required
                            helperText="Min length - 3, max length - 20"
                        />
                        <TextField
                            label="Description *"
                            value={editFormData.description}
                            onChange={(e) => setEditFormData({...editFormData, description: e.target.value})}
                            fullWidth
                            required
                            multiline
                            rows={2}
                            helperText="Min length - 10, max length - 50"
                        />
                        <TextField
                            label="Price *"
                            type="number"
                            value={editFormData.price}
                            onChange={(e) => setEditFormData({...editFormData, price: parseInt(e.target.value) || 0})}
                            fullWidth
                            required
                            helperText="Must be positive number"
                            InputProps={{
                                startAdornment: <Typography sx={{ mr: 1 }}>$</Typography>
                            }}
                        />
                        <TextField
                            label="Image URL *"
                            value={editFormData.imageUrl}
                            onChange={(e) => setEditFormData({...editFormData, imageUrl: e.target.value})}
                            fullWidth
                            required
                            helperText="Valid URL to dish image"
                        />
                        {editFormData.imageUrl && (
                            <Box sx={{ textAlign: 'center' }}>
                                <Typography variant="caption" color="textSecondary">
                                    Image Preview:
                                </Typography>
                                <Avatar
                                    src={editFormData.imageUrl}
                                    alt="Preview"
                                    variant="rounded"
                                    sx={{ width: 100, height: 100, mx: 'auto', mt: 1 }}
                                />
                            </Box>
                        )}
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
                    <Button
                        variant="contained"
                        onClick={handleUpdate}
                        disabled={!editFormData.name || !editFormData.description || editFormData.price <= 0 || !editFormData.imageUrl}
                    >
                        Update
                    </Button>
                </DialogActions>
            </Dialog>

            {/* 👇 ДИАЛОГ СОЗДАНИЯ БЛЮДА */}
            <Dialog open={createDialogOpen} onClose={() => setCreateDialogOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Add New Dish</DialogTitle>
                <DialogContent>
                    <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <TextField
                            label="Dish Name *"
                            value={createFormData.name}
                            onChange={(e) => setCreateFormData({...createFormData, name: e.target.value})}
                            fullWidth
                            required
                            helperText="Min length - 3, max length - 20"
                        />
                        <TextField
                            label="Description *"
                            value={createFormData.description}
                            onChange={(e) => setCreateFormData({...createFormData, description: e.target.value})}
                            fullWidth
                            required
                            multiline
                            rows={2}
                            helperText="Min length - 10, max length - 50"
                        />
                        <TextField
                            label="Price *"
                            type="number"
                            value={createFormData.price}
                            onChange={(e) => setCreateFormData({...createFormData, price: parseInt(e.target.value) || 0})}
                            fullWidth
                            required
                            helperText="Must be positive number"
                            InputProps={{
                                startAdornment: <Typography sx={{ mr: 1 }}>$</Typography>
                            }}
                        />
                        <TextField
                            label="Image URL *"
                            value={createFormData.imageUrl}
                            onChange={(e) => setCreateFormData({...createFormData, imageUrl: e.target.value})}
                            fullWidth
                            required
                            helperText="Valid URL to dish image"
                        />
                        {createFormData.imageUrl && (
                            <Box sx={{ textAlign: 'center' }}>
                                <Typography variant="caption" color="textSecondary">
                                    Image Preview:
                                </Typography>
                                <Avatar
                                    src={createFormData.imageUrl}
                                    alt="Preview"
                                    variant="rounded"
                                    sx={{ width: 100, height: 100, mx: 'auto', mt: 1 }}
                                />
                            </Box>
                        )}
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setCreateDialogOpen(false)}>Cancel</Button>
                    <Button
                        variant="contained"
                        onClick={handleCreate}
                        disabled={!createFormData.name || !createFormData.description || createFormData.price <= 0 || !createFormData.imageUrl}
                    >
                        Create
                    </Button>
                </DialogActions>
            </Dialog>

            {/* 👇 ДИАЛОГ УДАЛЕНИЯ БЛЮДА */}
            <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
                <DialogTitle>Delete Dish</DialogTitle>
                <DialogContent>
                    <Typography>
                        Are you sure you want to delete <strong>{selectedDish?.name}</strong>?
                    </Typography>
                    <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                        This action cannot be undone.
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
                    <Button
                        variant="contained"
                        color="error"
                        onClick={handleDelete}
                    >
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default ManageDishes;