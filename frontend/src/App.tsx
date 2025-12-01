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
import EditProfile from "./pages/customer/EditProfile.tsx";
import AdminPanel from "./pages/admin/AdminPanel.tsx";
import CreateRestaurant from "./pages/admin/CreateRestaurant.tsx";
import ManageRestaurants from "./pages/admin/ManageRestaurants.tsx";
import ManageDishes from "./pages/admin/ManageDishes.tsx";
import RestaurantMenu from "./pages/customer/RestaurantMenu.tsx";

const App: React.FC = () => {
    const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
    const user = useSelector((state: RootState) => state.auth.user);

    const isAdmin = user?.roles?.some((role: any) => role.name === 'ADMIN');

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

                    <Route path="/profile/edit" element={
                        isAuthenticated ? (
                            <Layout>
                                <EditProfile />
                            </Layout>
                        ) : (
                            <Navigate to="/login" />
                        )
                    } />

                    <Route path="/admin" element={
                        isAuthenticated && isAdmin ? (
                            <Layout>
                                <AdminPanel />
                            </Layout>
                        ) : isAuthenticated ? (
                            <Navigate to="/" />
                        ) : (
                            <Navigate to="/login" />
                        )
                    } />

                    <Route path="/admin/restaurants/create" element={
                        isAuthenticated && isAdmin ? (
                            <Layout>
                                <CreateRestaurant />
                            </Layout>
                        ) : isAuthenticated ? (
                            <Navigate to="/" />
                        ) : (
                            <Navigate to="/login" />
                        )
                    } />

                    <Route path="/admin/restaurants" element={
                        isAuthenticated && isAdmin ? (
                            <Layout>
                                <ManageRestaurants />
                            </Layout>
                        ) : isAuthenticated ? (
                            <Navigate to="/" />
                        ) : (
                            <Navigate to="/login" />
                        )
                    } />

                    <Route path="/admin/restaurants/:restaurantId/dishes" element={
                        isAuthenticated && isAdmin ? (
                            <Layout>
                                <ManageDishes />
                            </Layout>
                        ) : isAuthenticated ? (
                            <Navigate to="/" />
                        ) : (
                            <Navigate to="/login" />
                        )
                    } />

                    <Route path="/restaurants/:restaurantId" element={
                        isAuthenticated ? (
                            <Layout>
                                <RestaurantMenu />
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