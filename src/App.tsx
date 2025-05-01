import React, { useState } from 'react';
import {
    Container,
    Box,
    Typography,
    Fab,
    useTheme,
    Paper,
    AppBar,
    Toolbar,
    Button,
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import { TaskProvider, useTaskContext } from './context/TaskContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { TaskList } from './components/TaskList';
import { AddTaskDialog } from './components/AddTaskDialog';
import PrivateRoute from './components/PrivateRoute';

import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';

const AppContent: React.FC = () => {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const theme = useTheme();
    const { addTask } = useTaskContext();
    const { logout } = useAuth(); // <-- Access the logout function

    const handleOpenDialog = () => setIsDialogOpen(true);
    const handleCloseDialog = () => setIsDialogOpen(false);

    return (
        <Box
            sx={{
                minHeight: '100vh',
                bgcolor: 'background.default',
                background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
            }}
        >
            <AppBar
                position="static"
                elevation={0}
                sx={{
                    background: 'rgba(255, 255, 255, 0.8)',
                    backdropFilter: 'blur(10px)',
                    borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
                }}
            >
                <Toolbar>
                    <Typography
                        variant="h6"
                        component="div"
                        sx={{
                            flexGrow: 1,
                            color: 'primary.main',
                            fontWeight: 'bold',
                            letterSpacing: '0.5px',
                        }}
                    >
                        Daily Task Planner
                    </Typography>

                    {/* Exit Button */}
                    <Button
                        color="error"
                        variant="outlined"
                        onClick={logout}
                        sx={{ ml: 2 }}
                    >
                        Exit
                    </Button>
                </Toolbar>
            </AppBar>

            <Container maxWidth="md" sx={{ mt: 4, mb: 8 }}>
                <Paper
                    elevation={0}
                    sx={{
                        p: 4,
                        mb: 4,
                        borderRadius: 2,
                        background: 'rgba(255, 255, 255, 0.8)',
                        backdropFilter: 'blur(10px)',
                    }}
                >
                    <Typography
                        variant="h4"
                        gutterBottom
                        sx={{
                            color: 'primary.main',
                            fontWeight: 'bold',
                            mb: 2,
                        }}
                    >
                        My Tasks
                    </Typography>
                    <Typography
                        variant="subtitle1"
                        color="text.secondary"
                        sx={{ mb: 3 }}
                    >
                        Manage your daily tasks and stay organized
                    </Typography>

                    <TaskList />
                </Paper>

                <Fab
                    color="primary"
                    aria-label="add"
                    onClick={handleOpenDialog}
                    sx={{
                        position: 'fixed',
                        bottom: theme.spacing(4),
                        right: theme.spacing(4),
                        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
                        '&:hover': {
                            transform: 'scale(1.1)',
                            transition: 'transform 0.2s',
                        },
                    }}
                >
                    <AddIcon />
                </Fab>

                <AddTaskDialog
                    open={isDialogOpen}
                    onClose={handleCloseDialog}
                    onSave={addTask}
                />
            </Container>
        </Box>
    );
};

const App: React.FC = () => (
    <AuthProvider>
        <TaskProvider>
            <Router>
                <Routes>
                    {/* Public routes */}
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />

                    {/* Private route */}
                    <Route
                        path="/"
                        element={
                            <PrivateRoute>
                                <AppContent />
                            </PrivateRoute>
                        }
                    />
                </Routes>
            </Router>
        </TaskProvider>
    </AuthProvider>
);

export default App;
