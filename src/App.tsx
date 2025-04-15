import React, { useState } from 'react';
import {
    Container,
    Box,
    Typography,
    Fab,
    Dialog,
    AppBar,
    Toolbar,
    IconButton,
    useTheme,
    Paper,
} from '@mui/material';
import { Add as AddIcon, Close as CloseIcon } from '@mui/icons-material';
import { TaskProvider, useTaskContext } from './context/TaskContext';
import { TaskList } from './components/TaskList';
import { TaskForm } from './components/TaskForm';

const AppContent: React.FC = () => {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const theme = useTheme();
    const { addTask } = useTaskContext();

    const handleOpenDialog = () => setIsDialogOpen(true);
    const handleCloseDialog = () => setIsDialogOpen(false);

    return (
        <Box sx={{
            minHeight: '100vh',
            bgcolor: 'background.default',
            background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
        }}>
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

                <Dialog
                    fullWidth
                    maxWidth="sm"
                    open={isDialogOpen}
                    onClose={handleCloseDialog}
                    PaperProps={{
                        sx: {
                            borderRadius: 2,
                            background: 'rgba(255, 255, 255, 0.9)',
                            backdropFilter: 'blur(10px)',
                        }
                    }}
                >
                    <AppBar
                        sx={{
                            position: 'relative',
                            background: 'transparent',
                            boxShadow: 'none',
                            borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
                        }}
                    >
                        <Toolbar>
                            <IconButton
                                edge="start"
                                color="inherit"
                                onClick={handleCloseDialog}
                                aria-label="close"
                            >
                                <CloseIcon />
                            </IconButton>
                            <Typography
                                sx={{ ml: 2, flex: 1 }}
                                variant="h6"
                                component="div"
                                color="primary"
                            >
                                Add New Task
                            </Typography>
                        </Toolbar>
                    </AppBar>
                    <Box sx={{ p: 3 }}>
                        <TaskForm
                            onSave={(task) => {
                                addTask(task);
                                handleCloseDialog();
                            }}
                            onClose={handleCloseDialog}
                        />
                    </Box>
                </Dialog>
            </Container>
        </Box>
    );
};

const App: React.FC = () => {
    return (
        <TaskProvider>
            <AppContent />
        </TaskProvider>
    );
};

export default App; 