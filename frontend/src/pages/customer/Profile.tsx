import React from 'react';
import { useSelector } from 'react-redux';
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
    Chip
} from '@mui/material';
import {
    Email,
    Person,
    CalendarToday,
    LocationOn,
    Edit
} from '@mui/icons-material';
import type {RootState} from '../../store';

const Profile: React.FC = () => {
    const user = useSelector((state: RootState) => state.auth.user);

    // Генерируем инициалы для аватара
    const getInitials = () => {
        if (user?.fullName) {
            return user.fullName
                .split(' ')
                .map((name: any[]) => name[0])
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

    return (
        <Container maxWidth="md" sx={{ py: 4 }}>
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
                        <Chip
                            label="Customer"
                            color="primary"
                            variant="outlined"
                            size="small"
                        />
                    </Box>
                </Box>

                {/* Детальная информация */}
                <List sx={{ width: '100%' }}>
                    {/* Email */}
                    <ListItem>
                        <ListItemIcon>
                            <Email color="primary" />
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
                            <Person color="primary" />
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
                                    <CalendarToday color="primary" />
                                </ListItemIcon>
                                <ListItemText
                                    primary="Member Since"
                                    secondary={formatDate(user.createdAt)}
                                />
                            </ListItem>
                            <Divider variant="inset" component="li" />
                        </>
                    )}

                    {/* Адреса (если есть) */}
                    {user?.addresses && user.addresses.length > 0 ? (
                        <>
                            <ListItem>
                                <ListItemIcon>
                                    <LocationOn color="primary" />
                                </ListItemIcon>
                                <ListItemText
                                    primary="Addresses"
                                    secondary={`${user.addresses.length} saved address(es)`}
                                />
                            </ListItem>
                            <Divider variant="inset" component="li" />
                        </>
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

                {/* Кнопка редактирования (можно добавить позже) */}
                <Box sx={{ mt: 4, display: 'flex', gap: 2 }}>
                    {/* Пока просто заглушка для будущей функциональности */}
                    <Chip
                        icon={<Edit />}
                        label="Edit Profile"
                        variant="outlined"
                        clickable
                        onClick={() => console.log('Edit profile clicked')}
                    />
                </Box>
            </Paper>
        </Container>
    );
};

export default Profile;