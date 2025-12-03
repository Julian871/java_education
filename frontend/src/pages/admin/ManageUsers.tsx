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
    Avatar,
    Tooltip
} from '@mui/material';
import {
    Delete,
    ArrowBack,
    AccountCircle,
    Email,
    Person,
    CalendarToday,
    AdminPanelSettings,
    PersonOff,
    LocationOn,
    Refresh, ListAlt,
} from '@mui/icons-material';
import { format } from 'date-fns';

// Используем основной API, так как user-service тоже требует токен
import { api } from '../../services/api';

// Типы данных
interface AddressRequestDto {
    id?: number;
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

interface UserResponseDto {
    id: number;
    email: string;
    fullName: string;
    createdAt: string;
    updatedAt: string;
    addresses: AddressRequestDto[];
    roles: Role[];
}

const ManageUsers: React.FC = () => {
    const navigate = useNavigate();
    const [users, setUsers] = useState<UserResponseDto[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<UserResponseDto | null>(null);
    const [retryCount, setRetryCount] = useState(0);

    // Загружаем список пользователей
    useEffect(() => {
        fetchUsers();
    }, [retryCount]);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            setError(null);

            // Используем основной API с токеном
            const response = await api.get('http://localhost:8081/users');

            // Проверяем, что response.data - массив
            if (Array.isArray(response.data)) {
                setUsers(response.data);
            } else {
                console.error('❌ API did not return array:', response.data);
                setError('Invalid data format received from server');
                setUsers([]);
            }
        } catch (error: any) {
            console.error('❌ Error fetching users:', error);

            // Проверяем статус ошибки
            if (error.response?.status === 401) {
                setError('Unauthorized: You need ADMIN role to access this page');
            } else if (error.response?.status === 403) {
                setError('Forbidden: Access denied. Admin role required');
            } else if (error.response?.status === 404) {
                setError('API endpoint not found');
            } else {
                setError(`Failed to load users: ${error.message}`);
            }

            setUsers([]);
        } finally {
            setLoading(false);
        }
    };

    // Открытие диалога удаления
    const handleDeleteClick = (user: UserResponseDto) => {
        setSelectedUser(user);
        setDeleteDialogOpen(true);
    };

    // Удаление пользователя
    const handleDelete = async () => {
        if (!selectedUser) return;

        try {
            await api.delete(`http://localhost:8081/users/${selectedUser.id}`);
            await fetchUsers(); // Обновляем список
            setDeleteDialogOpen(false);
            setSelectedUser(null);
        } catch (error: any) {
            console.error('❌ Error deleting user:', error);
            setError('Failed to delete user');
        }
    };

    // Просмотр заказов пользователя
    const handleViewOrders = (user: UserResponseDto) => {
        navigate(`/admin/users/${user.id}/orders`);
    };

    const handleBack = () => {
        navigate('/admin');
    };

    const handleRefresh = () => {
        setRetryCount(prev => prev + 1);
    };

    // Форматирование даты
    const formatDate = (dateString: string) => {
        try {
            return format(new Date(dateString), 'dd.MM.yyyy HH:mm');
        } catch {
            return dateString;
        }
    };

    // Получение цвета для роли
    const getRoleColor = (roleName: string) => {
        switch (roleName.toUpperCase()) {
            case 'ADMIN': return 'error';
            case 'MODERATOR': return 'warning';
            case 'USER': return 'primary';
            case 'MANAGER': return 'success';
            default: return 'default';
        }
    };

    // Получение иконки для роли
    const getRoleIcon = (roleName: string) => {
        switch (roleName.toUpperCase()) {
            case 'ADMIN': return <AdminPanelSettings />;
            default: return <Person />;
        }
    };

    // Получение количества адресов
    const getAddressCount = (addresses: AddressRequestDto[]) => {
        return addresses?.length || 0;
    };

    // Форматирование адреса
    const formatAddress = (address: AddressRequestDto) => {
        return `${address.street}, ${address.city}, ${address.state} ${address.zip}, ${address.country}`;
    };

    // Проверяем есть ли у пользователя адреса
    const hasAddresses = (user: UserResponseDto) => {
        return user.addresses && user.addresses.length > 0;
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
                            <AccountCircle sx={{ mr: 2, verticalAlign: 'middle' }} />
                            Manage Users
                        </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        {users.length > 0 && (
                            <Typography variant="body1" color="textSecondary">
                                Total users: {users.length}
                            </Typography>
                        )}
                        <Tooltip title="Refresh">
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
                        {error.includes('Unauthorized') && (
                            <Typography variant="body2" sx={{ mt: 1 }}>
                                Make sure you are logged in with an ADMIN account
                            </Typography>
                        )}
                    </Alert>
                )}

                {/* Таблица пользователей */}
                {users.length > 0 ? (
                    <TableContainer component={Paper} variant="outlined">
                        <Table>
                            <TableHead sx={{ bgcolor: 'error.dark' }}>
                                <TableRow>
                                    <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>User</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>Email</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>Roles</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>Addresses</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>Joined</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {users.map((user) => (
                                    <TableRow key={user.id} hover>
                                        <TableCell>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                <Avatar sx={{ bgcolor: 'primary.main' }}>
                                                    {user.fullName?.charAt(0) || <Person />}
                                                </Avatar>
                                                <Box>
                                                    <Typography variant="body1" fontWeight="medium">
                                                        {user.fullName || 'No name'}
                                                    </Typography>
                                                    <Typography variant="caption" color="textSecondary">
                                                        ID: {user.id}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        </TableCell>
                                        <TableCell>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <Email fontSize="small" color="action" />
                                                <Typography variant="body2">
                                                    {user.email}
                                                </Typography>
                                            </Box>
                                        </TableCell>
                                        <TableCell>
                                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                                {user.roles?.map((role) => (
                                                    <Chip
                                                        icon={getRoleIcon(role.name)}
                                                        label={role.name}
                                                        color={getRoleColor(role.name) as any}
                                                        size="small"
                                                        sx={{
                                                            fontWeight: 'bold',
                                                            borderRadius: 2,
                                                            textTransform: 'capitalize'
                                                        }}
                                                    />
                                                )) || (
                                                    <Chip
                                                        label="No roles"
                                                        size="small"
                                                        color="default"
                                                        variant="outlined"
                                                    />
                                                )}
                                            </Box>
                                        </TableCell>
                                        <TableCell>
                                            {hasAddresses(user) ? (
                                                <Tooltip
                                                    title={
                                                        <Box sx={{ p: 1 }}>
                                                            {user.addresses.map((addr, idx) => (
                                                                <Box key={idx} sx={{ mb: 1, p: 1, bgcolor: 'background.paper', borderRadius: 1 }}>
                                                                    <Typography variant="body2" fontWeight="medium" color="black">
                                                                        <LocationOn fontSize="small" sx={{ mr: 0.5, verticalAlign: 'middle' }} />
                                                                        Address {idx + 1}
                                                                    </Typography>
                                                                    <Typography variant="caption" color="black">
                                                                        {formatAddress(addr)}
                                                                    </Typography>
                                                                </Box>
                                                            ))}
                                                        </Box>
                                                    }
                                                    arrow
                                                    placement="right"
                                                >
                                                    <Chip
                                                        label={`${getAddressCount(user.addresses)} address${getAddressCount(user.addresses) !== 1 ? 'es' : ''}`}
                                                        size="small"
                                                        variant="outlined"
                                                        icon={<LocationOn />}
                                                        color="info"
                                                        sx={{ cursor: 'pointer' }}
                                                    />
                                                </Tooltip>
                                            ) : (
                                                <Chip
                                                    label="No addresses"
                                                    size="small"
                                                    variant="outlined"
                                                    color="default"
                                                />
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <CalendarToday fontSize="small" color="action" />
                                                <Typography variant="body2">
                                                    {formatDate(user.createdAt)}
                                                </Typography>
                                            </Box>
                                        </TableCell>
                                        <TableCell>
                                            <Box sx={{ display: 'flex', gap: 1 }}>
                                                <Tooltip title="View Orders">
                                                    <IconButton
                                                        color="primary"
                                                        onClick={() => handleViewOrders(user)}
                                                        size="small"
                                                    >
                                                        <ListAlt />
                                                    </IconButton>
                                                </Tooltip>
                                                <Tooltip title="Delete User">
                                                    <IconButton
                                                        color="error"
                                                        onClick={() => handleDeleteClick(user)}
                                                        size="small"
                                                    >
                                                        <Delete />
                                                    </IconButton>
                                                </Tooltip>
                                            </Box>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                ) : !loading && !error ? (
                    <Alert severity="info" sx={{ mt: 3 }}>
                        No users found.
                    </Alert>
                ) : null}
            </Paper>

            {/* 👇 ДИАЛОГ УДАЛЕНИЯ ПОЛЬЗОВАТЕЛЯ */}
            <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
                <DialogTitle>Delete User</DialogTitle>
                <DialogContent>
                    {selectedUser && (
                        <>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                                <Avatar sx={{ bgcolor: 'primary.main', width: 40, height: 40 }}>
                                    {selectedUser.fullName?.charAt(0) || <Person />}
                                </Avatar>
                                <Box>
                                    <Typography variant="body1" fontWeight="bold">
                                        {selectedUser.fullName || 'No name'}
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary">
                                        {selectedUser.email}
                                    </Typography>
                                </Box>
                            </Box>

                            <Typography>
                                Are you sure you want to delete this user?
                            </Typography>
                            <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                                This action cannot be undone. All user data, including orders and addresses, will be permanently deleted.
                            </Typography>

                            {selectedUser.roles?.some(role => role.name === 'ADMIN') && (
                                <Alert severity="warning" sx={{ mt: 2 }}>
                                    <Typography variant="body2" fontWeight="bold">
                                        ⚠️ Warning: This user has ADMIN role!
                                    </Typography>
                                </Alert>
                            )}
                        </>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
                    <Button
                        variant="contained"
                        color="error"
                        onClick={handleDelete}
                        startIcon={<PersonOff />}
                    >
                        Delete User
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default ManageUsers;