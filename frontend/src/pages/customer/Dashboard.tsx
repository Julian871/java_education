import React from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../../store';
import {
    Container,
    Typography,
    Paper,
    Box,
    Avatar,
    Chip,
} from '@mui/material';
import {
    AccountCircle,
    LocalOffer,
    Star,
} from '@mui/icons-material';

const Dashboard: React.FC = () => {
    const user = useSelector((state: RootState) => state.auth.user);

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            {/* Приветствие пользователя */}
            <Paper
                elevation={3}
                sx={{
                    p: 4,
                    mb: 4,
                    borderRadius: 3,
                    background: 'linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)',
                    color: 'white',
                    position: 'relative',
                    overflow: 'hidden'
                }}
            >
                {/* Декоративные элементы */}
                <Box sx={{
                    position: 'absolute',
                    top: -50,
                    right: -50,
                    width: 200,
                    height: 200,
                    borderRadius: '50%',
                    background: 'rgba(255,255,255,0.1)'
                }} />
                <Box sx={{
                    position: 'absolute',
                    bottom: -30,
                    left: -30,
                    width: 150,
                    height: 150,
                    borderRadius: '50%',
                    background: 'rgba(255,255,255,0.05)'
                }} />

                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, position: 'relative', zIndex: 1 }}>
                    <Avatar
                        sx={{
                            width: 80,
                            height: 80,
                            mr: 3,
                            bgcolor: 'white',
                            color: 'primary.main',
                            border: '3px solid white'
                        }}
                    >
                        {user?.fullName?.charAt(0) || <AccountCircle sx={{ fontSize: 40 }} />}
                    </Avatar>
                    <Box>
                        <Typography variant="h3" component="h1" sx={{ fontWeight: 'bold', mb: 1 }}>
                            Welcome, {user?.fullName || 'Food Lover'}! 🍕
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                            <Chip
                                label="Gold Member"
                                sx={{
                                    bgcolor: 'rgba(255,215,0,0.2)',
                                    color: 'gold',
                                    fontWeight: 'bold'
                                }}
                                icon={<Star />}
                            />
                        </Box>
                    </Box>
                </Box>
            </Paper>

            {/* Промо блок */}
            <Paper
                sx={{
                    p: 4,
                    borderRadius: 3,
                    background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                    color: 'white',
                    textAlign: 'center'
                }}
            >
                <LocalOffer sx={{ fontSize: 50, mb: 2 }} />
                <Typography variant="h5" component="h3" gutterBottom fontWeight="bold">
                    🎁 Special Treat Just For You!
                </Typography>
                <Typography variant="body1" sx={{ mb: 3, opacity: 0.9, maxWidth: 600, mx: 'auto' }}>
                    As a valued member, you have access to exclusive offers and early access to new restaurants.
                </Typography>
                <Box sx={{
                    display: 'inline-block',
                    p: 2,
                    bgcolor: 'rgba(255,255,255,0.2)',
                    borderRadius: 2,
                    backdropFilter: 'blur(10px)'
                }}>
                    <Typography variant="h6" fontFamily="monospace" fontWeight="bold">
                        MEMBER777
                    </Typography>
                </Box>
            </Paper>
        </Container>
    );
};

export default Dashboard;