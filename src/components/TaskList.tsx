import React, { useState } from 'react';
import {
    List,
    ListItem,
    ListItemText,
    ListItemSecondaryAction,
    IconButton,
    Typography,
    Box,
    Chip,
    useTheme,
    Dialog,
    AppBar,
    Toolbar,
} from '@mui/material';
import { Delete as DeleteIcon, Edit as EditIcon, Close as CloseIcon } from '@mui/icons-material';
import { useTaskContext } from '../context/TaskContext';
import { format } from 'date-fns';
import { Task } from '../types';
import { TaskForm } from './TaskForm';

export const TaskList: React.FC = () => {
    const { tasks, deleteTask, editTask } = useTaskContext();
    const theme = useTheme();
    const [editingTask, setEditingTask] = useState<Task | null>(null);

    const handleEditClick = (task: Task) => {
        setEditingTask(task);
    };

    const handleCloseEdit = () => {
        setEditingTask(null);
    };

    const handleSaveEdit = (task: Task) => {
        editTask(task);
        handleCloseEdit();
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'high':
                return 'error';
            case 'medium':
                return 'warning';
            case 'low':
                return 'success';
            default:
                return 'default';
        }
    };

    return (
        <>
            <List sx={{ width: '100%' }}>
                {tasks.length === 0 ? (
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            minHeight: 200,
                        }}
                    >
                        <Typography variant="body1" color="text.secondary">
                            No tasks yet. Add your first task!
                        </Typography>
                    </Box>
                ) : (
                    tasks.map((task: Task) => (
                        <ListItem
                            key={task.id}
                            sx={{
                                mb: 2,
                                borderRadius: 2,
                                background: 'rgba(255, 255, 255, 0.7)',
                                backdropFilter: 'blur(10px)',
                                border: '1px solid rgba(0, 0, 0, 0.1)',
                                transition: 'transform 0.2s, box-shadow 0.2s',
                                '&:hover': {
                                    transform: 'translateY(-2px)',
                                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
                                },
                            }}
                        >
                            <ListItemText
                                primary={
                                    <Typography
                                        variant="h6"
                                        sx={{
                                            fontWeight: 'bold',
                                            color: 'primary.main',
                                        }}
                                    >
                                        {task.title}
                                    </Typography>
                                }
                                secondary={
                                    <Box sx={{ mt: 1 }}>
                                        <Typography variant="body2" color="text.secondary">
                                            {task.description}
                                        </Typography>
                                        <Box sx={{ mt: 1, display: 'flex', gap: 1 }}>
                                            <Chip
                                                label={task.priority}
                                                color={getPriorityColor(task.priority)}
                                                size="small"
                                            />
                                            <Chip
                                                label={format(new Date(task.dueDate), 'MMM dd, yyyy')}
                                                variant="outlined"
                                                size="small"
                                            />
                                        </Box>
                                    </Box>
                                }
                            />
                            <ListItemSecondaryAction>
                                <IconButton
                                    edge="end"
                                    aria-label="edit"
                                    onClick={() => handleEditClick(task)}
                                    sx={{
                                        mr: 1,
                                        color: 'primary.main',
                                        '&:hover': {
                                            backgroundColor: 'rgba(25, 118, 210, 0.1)',
                                        },
                                    }}
                                >
                                    <EditIcon />
                                </IconButton>
                                <IconButton
                                    edge="end"
                                    aria-label="delete"
                                    onClick={() => deleteTask(task.id)}
                                    sx={{
                                        color: 'error.main',
                                        '&:hover': {
                                            backgroundColor: 'rgba(211, 47, 47, 0.1)',
                                        },
                                    }}
                                >
                                    <DeleteIcon />
                                </IconButton>
                            </ListItemSecondaryAction>
                        </ListItem>
                    ))
                )}
            </List>

            <Dialog
                fullWidth
                maxWidth="sm"
                open={!!editingTask}
                onClose={handleCloseEdit}
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
                            onClick={handleCloseEdit}
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
                            Edit Task
                        </Typography>
                    </Toolbar>
                </AppBar>
                <Box sx={{ p: 3 }}>
                    {editingTask && (
                        <TaskForm
                            task={editingTask}
                            onSave={handleSaveEdit}
                            onClose={handleCloseEdit}
                        />
                    )}
                </Box>
            </Dialog>
        </>
    );
}; 