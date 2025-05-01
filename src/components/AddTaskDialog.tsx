import React from 'react';
import {
    Dialog,
    AppBar,
    Toolbar,
    IconButton,
    Typography,
    Box,
    useTheme,
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { TaskForm } from './TaskForm';
import { Task } from '../types';

interface AddTaskDialogProps {
    open: boolean;
    onClose: () => void;
    onSave: (task: Task) => void;
}

export const AddTaskDialog: React.FC<AddTaskDialogProps> = ({ open, onClose, onSave }) => {
    const theme = useTheme();

    return (
        <Dialog
            fullWidth
            maxWidth="sm"
            open={open}
            onClose={onClose}
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
                        onClick={onClose}
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
                        onSave(task);
                        onClose();
                    }}
                    onClose={onClose}
                />
            </Box>
        </Dialog>
    );
};
