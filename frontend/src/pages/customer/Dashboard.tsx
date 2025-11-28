import React from 'react';
import { useSelector } from 'react-redux';
import type {RootState} from '../../store';
import { Container, Typography, Paper } from '@mui/material';

const Dashboard: React.FC = () => {
    const user = useSelector((state: RootState) => state.auth.user);

    return (
        <Container>
            <Paper elevation={3} sx={{ padding: 4, marginTop: 4 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Welcome to Food Delivery!
                </Typography>
                <Typography variant="body1" gutterBottom>
                    Hello, {user?.fullName || 'No name'}!
                </Typography>
            </Paper>
        </Container>
    );
};

export default Dashboard;