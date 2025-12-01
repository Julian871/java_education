import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Container,
    Paper,
    Typography,
    TextField,
    Button,
    Box,
    Alert,
    CircularProgress,
    Divider,
    IconButton,
    Grid,
    List,
    ListItem,
    ListItemText,
    ListItemSecondaryAction
} from '@mui/material';
import { ArrowBack, Save, Add, Delete, LocationOn } from '@mui/icons-material';
import { api } from '../../services/api';

interface AddressRequestDto {
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
}

interface UpdateUserRequestDto {
    fullName: string;
    addresses: AddressRequestDto[];
}

const EditProfile: React.FC = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        fullName: '',
        addresses: [] as AddressRequestDto[]
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [newAddress, setNewAddress] = useState<AddressRequestDto>({
        street: '',
        city: '',
        state: '',
        zip: '',
        country: ''
    });

    // Загружаем текущие данные пользователя
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await api.get('/users/me');
                setFormData({
                    fullName: response.data.fullName || '',
                    addresses: response.data.addresses || []
                });
            } catch (error: any) {
                console.error('❌ Error loading user data:', error);
                setError('Failed to load profile data');
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, []);

    // Добавление нового адреса
    const handleAddAddress = () => {
        if (newAddress.street && newAddress.city && newAddress.zip) {
            setFormData({
                ...formData,
                addresses: [...formData.addresses, { ...newAddress }]
            });
            setNewAddress({
                street: '',
                city: '',
                state: '',
                zip: '',
                country: ''
            });
        }
    };

    // Удаление адреса
    const handleRemoveAddress = (index: number) => {
        const updatedAddresses = [...formData.addresses];
        updatedAddresses.splice(index, 1);
        setFormData({
            ...formData,
            addresses: updatedAddresses
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setError(null);

        try {
            const updateData: UpdateUserRequestDto = {
                fullName: formData.fullName,
                addresses: formData.addresses
            };

            console.log('🔄 Updating profile with addresses:', updateData);
            const response = await api.put('/users/me', updateData);
            console.log('✅ Profile updated:', response.data);

            setSuccess(true);

            setTimeout(() => {
                navigate('/profile');
            }, 1500);

        } catch (error: any) {
            console.error('❌ Error updating profile:', error);
            setError(error.response?.data?.message || 'Failed to update profile');
        } finally {
            setSaving(false);
        }
    };

    const handleBack = () => {
        navigate('/profile');
    };

    if (loading) {
        return (
            <Container maxWidth="md" sx={{ py: 4, display: 'flex', justifyContent: 'center' }}>
                <CircularProgress />
            </Container>
        );
    }

    return (
        <Container maxWidth="md" sx={{ py: 4 }}>
            <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
                {/* Заголовок и кнопка назад */}
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <Button
                        startIcon={<ArrowBack />}
                        onClick={handleBack}
                        sx={{ mr: 2 }}
                    >
                        Back
                    </Button>
                    <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
                        Edit Profile
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
                        Profile updated successfully! Returning to profile...
                    </Alert>
                )}

                {/* Форма редактирования */}
                <form onSubmit={handleSubmit}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                        {/* Полное имя */}
                        <TextField
                            label="Full Name"
                            value={formData.fullName}
                            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                            fullWidth
                            required
                            disabled={saving || success}
                            helperText="Enter your full name"
                        />

                        <Divider sx={{ my: 2 }} />

                        {/* Адреса */}
                        <Typography variant="h6" gutterBottom>
                            <LocationOn sx={{ mr: 1, verticalAlign: 'middle' }} />
                            Addresses
                        </Typography>

                        {/* Список существующих адресов */}
                        {formData.addresses.length > 0 && (
                            <List sx={{ mb: 2 }}>
                                {formData.addresses.map((address, index) => (
                                    <ListItem key={index} sx={{
                                        border: '1px solid #e0e0e0',
                                        borderRadius: 1,
                                        mb: 1,
                                        bgcolor: '#f9f9f9'
                                    }}>
                                        <ListItemText
                                            primary={`Address ${index + 1}`}
                                            secondary={
                                                <Box>
                                                    <Typography variant="body2">
                                                        {address.street}
                                                    </Typography>
                                                    <Typography variant="body2">
                                                        {address.city}, {address.state} {address.zip}
                                                    </Typography>
                                                    <Typography variant="body2">
                                                        {address.country}
                                                    </Typography>
                                                </Box>
                                            }
                                        />
                                        <ListItemSecondaryAction>
                                            <IconButton
                                                edge="end"
                                                onClick={() => handleRemoveAddress(index)}
                                                disabled={saving}
                                                color="error"
                                            >
                                                <Delete />
                                            </IconButton>
                                        </ListItemSecondaryAction>
                                    </ListItem>
                                ))}
                            </List>
                        )}

                        {/* Форма добавления нового адреса */}
                        <Paper variant="outlined" sx={{ p: 2, bgcolor: '#f5f5f5' }}>
                            <Typography variant="subtitle1" gutterBottom>
                                Add New Address
                            </Typography>

                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <TextField
                                        label="Street"
                                        value={newAddress.street}
                                        onChange={(e) => setNewAddress({...newAddress, street: e.target.value})}
                                        fullWidth
                                        size="small"
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        label="City"
                                        value={newAddress.city}
                                        onChange={(e) => setNewAddress({...newAddress, city: e.target.value})}
                                        fullWidth
                                        size="small"
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        label="State"
                                        value={newAddress.state}
                                        onChange={(e) => setNewAddress({...newAddress, state: e.target.value})}
                                        fullWidth
                                        size="small"
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        label="ZIP Code"
                                        value={newAddress.zip}
                                        onChange={(e) => setNewAddress({...newAddress, zip: e.target.value})}
                                        fullWidth
                                        size="small"
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        label="Country"
                                        value={newAddress.country}
                                        onChange={(e) => setNewAddress({...newAddress, country: e.target.value})}
                                        fullWidth
                                        size="small"
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <Button
                                        startIcon={<Add />}
                                        onClick={handleAddAddress}
                                        variant="outlined"
                                        disabled={!newAddress.street || !newAddress.city || !newAddress.zip}
                                        fullWidth
                                    >
                                        Add Address
                                    </Button>
                                </Grid>
                            </Grid>
                        </Paper>

                        {/* Кнопки */}
                        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 2 }}>
                            <Button
                                variant="outlined"
                                onClick={handleBack}
                                disabled={saving}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                variant="contained"
                                color="success"
                                startIcon={<Save />}
                                disabled={saving || success || !formData.fullName.trim()}
                            >
                                {saving ? 'Saving...' : success ? 'Saved!' : 'Save Changes'}
                            </Button>
                        </Box>
                    </Box>
                </form>
            </Paper>
        </Container>
    );
};

export default EditProfile;