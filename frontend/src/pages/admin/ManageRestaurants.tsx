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
    IconButton,
    Chip,
    Alert,
    CircularProgress,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField
} from '@mui/material';
import {
    Edit,
    Delete,
    ArrowBack,
    Restaurant,
    Add,
    Fastfood
} from '@mui/icons-material';
import { restaurantApi } from '../../services/restaurantApi';

interface RestaurantResponseDto {
    id: number;
    name: string;
    cuisine: string;
    address: string;
    dishes: any[];
}

const ManageRestaurants: React.FC = () => {
    const navigate = useNavigate();
    const [restaurants, setRestaurants] = useState<RestaurantResponseDto[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [selectedRestaurant, setSelectedRestaurant] = useState<RestaurantResponseDto | null>(null);
    const [editFormData, setEditFormData] = useState({
        name: '',
        cuisine: '',
        address: ''
    });

    // Загружаем список ресторанов
    useEffect(() => {
        fetchRestaurants();
    }, []);

    const fetchRestaurants = async () => {
        try {
            setLoading(true);
            // 👇 Получаем список ресторанов (публичный endpoint или админский)
            const response = await restaurantApi.get('/restaurants');
            setRestaurants(response.data);
        } catch (error: any) {
            console.error('❌ Error fetching restaurants:', error);
            setError('Failed to load restaurants');
        } finally {
            setLoading(false);
        }
    };

    // Открытие диалога редактирования
    const handleEditClick = (restaurant: RestaurantResponseDto) => {
        setSelectedRestaurant(restaurant);
        setEditFormData({
            name: restaurant.name,
            cuisine: restaurant.cuisine,
            address: restaurant.address
        });
        setEditDialogOpen(true);
    };

    // Открытие диалога удаления
    const handleDeleteClick = (restaurant: RestaurantResponseDto) => {
        setSelectedRestaurant(restaurant);
        setDeleteDialogOpen(true);
    };

    // Обновление ресторана
    const handleUpdate = async () => {
        if (!selectedRestaurant) return;

        try {
            await restaurantApi.put(`/admin/restaurants/${selectedRestaurant.id}`, editFormData);
            await fetchRestaurants(); // Обновляем список
            setEditDialogOpen(false);
            setSelectedRestaurant(null);
        } catch (error: any) {
            console.error('❌ Error updating restaurant:', error);
            setError('Failed to update restaurant');
        }
    };

    // Удаление ресторана
    const handleDelete = async () => {
        if (!selectedRestaurant) return;

        try {
            await restaurantApi.delete(`/admin/restaurants/${selectedRestaurant.id}`);
            await fetchRestaurants(); // Обновляем список
            setDeleteDialogOpen(false);
            setSelectedRestaurant(null);
        } catch (error: any) {
            console.error('❌ Error deleting restaurant:', error);
            setError('Failed to delete restaurant');
        }
    };

    const handleBack = () => {
        navigate('/admin');
    };

    const handleCreateNew = () => {
        navigate('/admin/restaurants/create');
    };

    const handleManageDishes = (restaurant: RestaurantResponseDto) => {
        navigate(`/admin/restaurants/${restaurant.id}/dishes`);
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
                            Back to Admin
                        </Button>
                        <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
                            <Restaurant sx={{ mr: 2, verticalAlign: 'middle' }} />
                            Manage Restaurants
                        </Typography>
                    </Box>
                    <Button
                        variant="contained"
                        color="warning"
                        startIcon={<Add />}
                        onClick={handleCreateNew}
                    >
                        Create New
                    </Button>
                </Box>

                <Box sx={{ mb: 3 }}>
                    <Typography variant="body1" color="textSecondary">
                        Total restaurants: {restaurants.length}
                    </Typography>
                </Box>

                {/* Сообщения об ошибках */}
                {error && (
                    <Alert severity="error" sx={{ mb: 3 }}>
                        {error}
                    </Alert>
                )}

                {/* Таблица ресторанов */}
                <TableContainer component={Paper} variant="outlined">
                    <Table>
                        <TableHead sx={{ bgcolor: 'error.dark' }}>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>ID</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>Name</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>Cuisine</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>Address</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>Dishes</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>Actions</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>Manage Dishes</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {restaurants.map((restaurant) => (
                                <TableRow key={restaurant.id} hover>
                                    <TableCell>{restaurant.id}</TableCell>
                                    <TableCell sx={{ fontWeight: 'medium' }}>
                                        {restaurant.name}
                                    </TableCell>
                                    <TableCell>
                                        <Chip
                                            label={restaurant.cuisine}
                                            color='secondary'
                                            size="small"
                                            sx={{
                                                fontWeight: 'bold',
                                                borderRadius: 2
                                            }}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="body2" color="textSecondary">
                                            {restaurant.address}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Chip
                                            label={`${restaurant.dishes?.length || 0} dishes`}
                                            size="small"
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <IconButton
                                            color="primary"
                                            onClick={() => handleEditClick(restaurant)}
                                            size="small"
                                            sx={{ mr: 1 }}
                                        >
                                            <Edit />
                                        </IconButton>
                                        <IconButton
                                            color="error"
                                            onClick={() => handleDeleteClick(restaurant)}
                                            size="small"
                                        >
                                            <Delete />
                                        </IconButton>
                                    </TableCell>
                                    <TableCell>
                                        <Button
                                            variant="outlined"
                                            color="success"
                                            size="small"
                                            startIcon={<Fastfood />}
                                            onClick={() => handleManageDishes(restaurant)}
                                        >
                                            Manage Dishes
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>

                {restaurants.length === 0 && !loading && (
                    <Alert severity="info" sx={{ mt: 3 }}>
                        No restaurants found. Create your first restaurant!
                    </Alert>
                )}
            </Paper>

            {/* 👇 ДИАЛОГ РЕДАКТИРОВАНИЯ РЕСТОРАНА */}
            <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Edit Restaurant</DialogTitle>
                <DialogContent>
                    <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <TextField
                            label="Restaurant Name"
                            value={editFormData.name}
                            onChange={(e) => setEditFormData({...editFormData, name: e.target.value})}
                            fullWidth
                            required
                            helperText="Min length - 3, max length - 20"
                        />
                        <TextField
                            label="Cuisine"
                            value={editFormData.cuisine}
                            onChange={(e) => setEditFormData({...editFormData, cuisine: e.target.value})}
                            fullWidth
                            required
                            helperText="Min length - 3, max length - 20"
                        />
                        <TextField
                            label="Address"
                            value={editFormData.address}
                            onChange={(e) => setEditFormData({...editFormData, address: e.target.value})}
                            fullWidth
                            required
                            multiline
                            rows={2}
                            helperText="Min length - 10, max length - 50"
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
                    <Button
                        variant="contained"
                        onClick={handleUpdate}
                        disabled={!editFormData.name || !editFormData.cuisine || !editFormData.address}
                    >
                        Update
                    </Button>
                </DialogActions>
            </Dialog>

            {/* 👇 ДИАЛОГ УДАЛЕНИЯ РЕСТОРАНА */}
            <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
                <DialogTitle>Delete Restaurant</DialogTitle>
                <DialogContent>
                    <Typography>
                        Are you sure you want to delete <strong>{selectedRestaurant?.name}</strong>?
                    </Typography>
                    <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                        This action cannot be undone. All dishes in this restaurant will also be deleted.
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

export default ManageRestaurants;