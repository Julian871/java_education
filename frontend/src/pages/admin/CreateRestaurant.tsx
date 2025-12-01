import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Container,
    Paper,
    Typography,
    TextField,
    Button,
    Box,
    Alert,
    Divider,
    Grid,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    FormHelperText
} from '@mui/material';
import { ArrowBack, Save, Restaurant } from '@mui/icons-material';
import { api } from '../../services/api';

interface RestaurantRequestDto {
    name: string;
    cuisine: string;
    address: string;
}

const CreateRestaurant: React.FC = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState<RestaurantRequestDto>({
        name: '',
        cuisine: '',
        address: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [validationErrors, setValidationErrors] = useState<{[key: string]: string}>({});

    // Доступные кухни
    const cuisineTypes = [
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

    // Валидация на клиенте (повторяет бэкендные правила)
    const validateForm = () => {
        const errors: {[key: string]: string} = {};

        if (!formData.name.trim()) {
            errors.name = 'Name is required';
        } else if (formData.name.length < 3 || formData.name.length > 20) {
            errors.name = 'Min length - 3, max length - 20';
        }

        if (!formData.cuisine.trim()) {
            errors.cuisine = 'Cuisine is required';
        } else if (formData.cuisine.length < 3 || formData.cuisine.length > 20) {
            errors.cuisine = 'Min length - 3, max length - 20';
        }

        if (!formData.address.trim()) {
            errors.address = 'Address is required';
        } else if (formData.address.length < 10 || formData.address.length > 50) {
            errors.address = 'Min length - 10, max length - 50';
        }

        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Клиентская валидация
        if (!validateForm()) {
            return;
        }

        setLoading(true);
        setError(null);
        setValidationErrors({});

        try {
            console.log('🔄 Creating restaurant:', formData);

            const response = await api.post('http://localhost:8082/admin/restaurants', formData);
            console.log('✅ Restaurant created:', response.data);

            setSuccess(true);

            setTimeout(() => {
                navigate('/admin');
            }, 1500);

        } catch (error: any) {
            console.error('❌ Error creating restaurant:', error);

            // Обработка ошибок валидации с бэкенда
            if (error.response?.data?.messages) {
                setValidationErrors(error.response.data.messages);
            } else if (error.response?.data?.message) {
                setError(error.response.data.message);
            } else {
                setError(error.message || 'Failed to create restaurant');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleBack = () => {
        navigate('/admin');
    };

    const handleChange = (field: keyof RestaurantRequestDto, value: string) => {
        setFormData({
            ...formData,
            [field]: value
        });
        // Очищаем ошибку при изменении поля
        if (validationErrors[field]) {
            setValidationErrors({
                ...validationErrors,
                [field]: ''
            });
        }
    };

    return (
        <Container maxWidth="md" sx={{ py: 4 }}>
            <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
                {/* Заголовок и кнопка назад */}
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
                        <Restaurant sx={{ mr: 2, verticalAlign: 'middle' }} />
                        Create New Restaurant
                    </Typography>
                </Box>

                <Divider sx={{ mb: 4 }} />

                {/* Сообщения об ошибках/успехе */}
                {error && (
                    <Alert severity="error" sx={{ mb: 3 }}>
                        {error}
                    </Alert>
                )}

                {success && (
                    <Alert severity="success" sx={{ mb: 3 }}>
                        Restaurant created successfully! Returning to admin panel...
                    </Alert>
                )}

                {/* Форма создания ресторана */}
                <form onSubmit={handleSubmit}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                        {/* Основная информация */}
                        <Typography variant="h6" gutterBottom sx={{ color: 'primary.main' }}>
                            Restaurant Details
                        </Typography>

                        <Grid container spacing={3}>
                            {/* Название ресторана */}
                            <Grid item xs={12}>
                                <TextField
                                    label="Restaurant Name *"
                                    value={formData.name}
                                    onChange={(e) => handleChange('name', e.target.value)}
                                    fullWidth
                                    required
                                    disabled={loading || success}
                                    error={!!validationErrors.name}
                                    helperText={validationErrors.name || "Min length - 3, max length - 20"}
                                    inputProps={{ maxLength: 20 }}
                                />
                            </Grid>

                            {/* Кухня */}
                            <Grid item xs={12}>
                                <FormControl
                                    fullWidth
                                    required
                                    disabled={loading || success}
                                    error={!!validationErrors.cuisine}
                                >
                                    <InputLabel>Cuisine Type *</InputLabel>
                                    <Select
                                        value={formData.cuisine}
                                        label="Cuisine Type *"
                                        onChange={(e) => handleChange('cuisine', e.target.value)}
                                    >
                                        <MenuItem value="">
                                            <em>Select cuisine type</em>
                                        </MenuItem>
                                        {cuisineTypes.map((cuisine) => (
                                            <MenuItem key={cuisine} value={cuisine}>
                                                {cuisine}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                    <FormHelperText error={!!validationErrors.cuisine}>
                                        {validationErrors.cuisine || "Min length - 3, max length - 20"}
                                    </FormHelperText>
                                </FormControl>
                            </Grid>

                            {/* Адрес */}
                            <Grid item xs={12}>
                                <TextField
                                    label="Address *"
                                    value={formData.address}
                                    onChange={(e) => handleChange('address', e.target.value)}
                                    fullWidth
                                    required
                                    multiline
                                    rows={2}
                                    disabled={loading || success}
                                    error={!!validationErrors.address}
                                    helperText={validationErrors.address || "Min length - 10, max length - 50"}
                                    inputProps={{ maxLength: 50 }}
                                />
                            </Grid>
                        </Grid>

                        {/* Кнопки */}
                        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 4 }}>
                            <Button
                                variant="outlined"
                                onClick={handleBack}
                                disabled={loading}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                variant="contained"
                                color="success"
                                startIcon={<Save />}
                                disabled={loading || success}
                                sx={{ minWidth: 120 }}
                            >
                                {loading ? 'Creating...' : success ? 'Created!' : 'Create Restaurant'}
                            </Button>
                        </Box>

                        {/* Подсказка */}
                        <Alert severity="info" sx={{ mt: 2 }}>
                            All fields are required. Follow the length restrictions shown.
                        </Alert>
                    </Box>
                </form>
            </Paper>
        </Container>
    );
};

export default CreateRestaurant;