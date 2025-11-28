import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type {RootState} from './store';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Dashboard from './pages/customer/Dashboard';
import Layout from './components/common/Layout';
import RestaurantList from "./pages/customer/RestaurantList.tsx";
import Profile from "./pages/customer/Profile.tsx";

const App: React.FC = () => {
    const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);

    return (
        <Router>
            <div className="App">
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />

                    <Route path="/" element={
                        isAuthenticated ? (
                            <Layout>
                                <Dashboard />
                            </Layout>
                        ) : (
                            <Navigate to="/login" />
                        )
                    } />

                    <Route path="/restaurants" element={
                        isAuthenticated ? (
                            <Layout>
                                <RestaurantList />
                            </Layout>
                        ) : (
                            <Navigate to="/login" />
                        )
                    } />

                    <Route path="/profile" element={
                        isAuthenticated ? (
                            <Layout>
                                <Profile />
                            </Layout>
                        ) : (
                            <Navigate to="/login" />
                        )
                    } />
                </Routes>
            </div>
        </Router>
    );
};

export default App;