import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import {
    Container,
    Paper,
    Typography,
    Box,
    Avatar,
    Divider,
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
    Chip,
    Button,
    CircularProgress,
    Alert
} from '@mui/material';
import {
    Email,
    Person,
    CalendarToday,
    LocationOn,
    Edit,
} from '@mui/icons-material';
import type {RootState} from '../../store';
import { api } from '../../services/api';

interface AddressRequestDto {
    street: string;
    city: string;
    zip: string;
    state: string;
    country: string;
}

interface Role {
    id: number;
    name: string;
}

interface UserProfileData {
    id: number;
    email: string;
    fullName: string;
    createdAt: string;
    updatedAt: string;
    addresses: AddressRequestDto[];
    roles: Role[];
}

const Profile: React.FC = () => {
    const reduxUser = useSelector((state: RootState) => state.auth.user);
    const [user, setUser] = useState<UserProfileData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Загружаем полные данные пользователя
    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                console.log('🔄 Fetching user profile from /users/me');
                const response = await api.get('/users/me');
                console.log('✅ User profile data:', response.data);
                setUser(response.data);
            } catch (error: any) {
                console.error('❌ Error fetching user profile:', error);
                setError('Failed to load profile data');
                // Если API ошибка, используем данные из Redux как fallback
                if (reduxUser) {
                    setUser(reduxUser as UserProfileData);
                }
            } finally {
                setLoading(false);
            }
        };

        fetchUserProfile();
    }, [reduxUser]);

    // Генерируем инициалы для аватара
    const getInitials = () => {
        if (user?.fullName) {
            return user.fullName
                .split(' ')
                .map((name: string) => name[0])
                .join('')
                .toUpperCase()
                .slice(0, 2);
        }
        return user?.email?.slice(0, 2).toUpperCase() || 'U';
    };

    // Форматируем дату
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    if (loading) {
        return (
            <Container maxWidth="md" sx={{ py: 4, display: 'flex', justifyContent: 'center' }}>
                <CircularProgress />
            </Container>
        );
    }

    if (error && !user) {
        return (
            <Container maxWidth="md" sx={{ py: 4 }}>
                <Alert severity="error">{error}</Alert>
            </Container>
        );
    }

    return (
        <Container maxWidth="md" sx={{ py: 4 }}>
            {/* Предупреждение если использованы кэшированные данные */}
            {error && (
                <Alert severity="warning" sx={{ mb: 2 }}>
                    {error} (showing cached data)
                </Alert>
            )}

            <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
                {/* Заголовок */}
                <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
                    My Profile
                </Typography>

                <Divider sx={{ mb: 4 }} />

                {/* Основная информация */}
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
                    {/* Аватар */}
                    <Avatar
                        sx={{
                            width: 80,
                            height: 80,
                            bgcolor: 'primary.main',
                            fontSize: '2rem',
                            fontWeight: 'bold',
                            mr: 3
                        }}
                    >
                        {getInitials()}
                    </Avatar>

                    {/* Информация пользователя */}
                    <Box>
                        <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 'bold' }}>
                            {user?.fullName || 'No Name'}
                        </Typography>

                        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                            {user?.roles && user.roles.length > 0 ? (
                                user.roles.map((role, index) => (
                                    <Chip
                                        key={index}
                                        label={role.name}
                                        color={role.name === 'ADMIN' ? 'error' : 'primary'}
                                        variant="outlined"
                                        size="small"
                                        sx={{
                                            fontWeight: 'bold',
                                            fontSize: '0.8rem',
                                            padding: '4px 8px',
                                            borderWidth: '2px',
                                        }}
                                    />
                                ))
                            ) : (
                                <Chip
                                    label="Customer"
                                    color="default"
                                    variant="outlined"
                                    size="small"
                                />
                            )}
                        </Box>
                    </Box>
                </Box>

                {/* Детальная информация */}
                <List sx={{ width: '100%' }}>
                    {/* Email */}
                    <ListItem>
                        <ListItemIcon>
                            <Email color="warning" />
                        </ListItemIcon>
                        <ListItemText
                            primary="Email"
                            secondary={user?.email || 'No email'}
                            secondaryTypographyProps={{ sx: { fontWeight: 'medium' } }}
                        />
                    </ListItem>

                    <Divider variant="inset" component="li" />

                    {/* Полное имя */}
                    <ListItem>
                        <ListItemIcon>
                            <Person color="warning" />
                        </ListItemIcon>
                        <ListItemText
                            primary="Full Name"
                            secondary={user?.fullName || 'Not specified'}
                        />
                    </ListItem>

                    <Divider variant="inset" component="li" />

                    {/* Дата регистрации */}
                    {user?.createdAt && (
                        <>
                            <ListItem>
                                <ListItemIcon>
                                    <CalendarToday color="warning" />
                                </ListItemIcon>
                                <ListItemText
                                    primary="Member Since"
                                    secondary={formatDate(user.createdAt)}
                                />
                            </ListItem>
                            <Divider variant="inset" component="li" />
                        </>
                    )}

                    {/* Дата обновления */}
                    {user?.updatedAt && (
                        <>
                            <ListItem>
                                <ListItemIcon>
                                    <CalendarToday color="warning" />
                                </ListItemIcon>
                                <ListItemText
                                    primary="Last Updated"
                                    secondary={formatDate(user.updatedAt)}
                                />
                            </ListItem>
                            <Divider variant="inset" component="li" />
                        </>
                    )}

                    {/* Адреса */}
                    {user?.addresses && user.addresses.length > 0 ? (
                        user.addresses.map((address, index) => (
                            <React.Fragment key={index}>
                                <ListItem>
                                    <ListItemIcon>
                                        <LocationOn color="warning" />
                                    </ListItemIcon>
                                    <ListItemText
                                        primary={`Address ${index + 1}`}
                                        secondary={
                                            <Box>
                                                <Typography variant="body2">
                                                    {address.country}
                                                </Typography>
                                                <Typography variant="body2">
                                                    {address.city}, {address.state} {address.zip}
                                                </Typography>
                                                <Typography variant="body2">
                                                    {address.street}
                                                </Typography>
                                            </Box>
                                        }
                                    />
                                </ListItem>
                                {index < user.addresses.length - 1 && (
                                    <Divider variant="inset" component="li" />
                                )}
                            </React.Fragment>
                        ))
                    ) : (
                        <ListItem>
                            <ListItemIcon>
                                <LocationOn color="primary" />
                            </ListItemIcon>
                            <ListItemText
                                primary="Addresses"
                                secondary="No addresses saved"
                            />
                        </ListItem>
                    )}
                </List>

                {/* Кнопка редактирования */}
                <Box sx={{ mt: 4, display: 'flex', gap: 2 }}>
                    <Button
                        variant="outlined"
                        color="success"
                        startIcon={<Edit />}
                        component={Link}
                        to="/profile/edit"
                    >
                        Edit Profile
                    </Button>
                </Box>
            </Paper>
        </Container>
    );
};

export default Profile;