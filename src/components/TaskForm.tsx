import React, { useState, useEffect } from 'react';
import {
    TextField,
    Button,
    Box,
    Grid,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    FormHelperText,
} from '@mui/material';
import { Task } from '../types';

interface TaskFormProps {
    task?: Task;
    onSave: (task: Task) => void;
    onClose: () => void;
}

export const TaskForm: React.FC<TaskFormProps> = ({ task, onSave, onClose }) => {
    const [formData, setFormData] = useState<Omit<Task, 'id' | 'createdAt'>>({
        title: '',
        description: '',
        dueDate: new Date(),
        priority: 'medium',
        completed: false,
    });

    useEffect(() => {
        if (task) {
            setFormData({
                title: task.title,
                description: task.description,
                dueDate: task.dueDate,
                priority: task.priority,
                completed: task.completed,
            });
        }
    }, [task]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const taskToSave: Task = {
            ...formData,
            id: task?.id || Date.now().toString(),
            createdAt: task?.createdAt || new Date(),
        };
        onSave(taskToSave);
    };

    return (
        <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        label="Title"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        required
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        label="Description"
                        multiline
                        rows={4}
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        fullWidth
                        label="Due Date"
                        type="date"
                        value={formData.dueDate.toISOString().split('T')[0]}
                        onChange={(e) => setFormData({ ...formData, dueDate: new Date(e.target.value) })}
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <FormControl fullWidth>
                        <InputLabel>Priority</InputLabel>
                        <Select
                            value={formData.priority}
                            label="Priority"
                            onChange={(e) => setFormData({ ...formData, priority: e.target.value as 'low' | 'medium' | 'high' })}
                        >
                            <MenuItem value="low">Low</MenuItem>
                            <MenuItem value="medium">Medium</MenuItem>
                            <MenuItem value="high">High</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={12}>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                        <Button onClick={onClose}>Cancel</Button>
                        <Button type="submit" variant="contained" color="primary">
                            {task ? 'Save Changes' : 'Add Task'}
                        </Button>
                    </Box>
                </Grid>
            </Grid>
        </form>
    );
}; 