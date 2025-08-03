import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Grid,
  MenuItem,
  Box,
  IconButton,
  Alert,
} from '@mui/material'
import { Close as CloseIcon } from '@mui/icons-material'
import { createTask, updateTask, clearError } from '../../store/taskSlice'
import { TASK_STATUS, TASK_PRIORITY } from '../../utils/constants'

const TaskDialog = ({ open, onClose, task = null }) => {
  const dispatch = useDispatch()
  const { error } = useSelector((state) => state.tasks)
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: TASK_STATUS.TODO,
    priority: TASK_PRIORITY.MEDIUM,
    dueDate: '',
  })

  const [formErrors, setFormErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title || '',
        description: task.description || '',
        status: task.status || TASK_STATUS.TODO,
        priority: task.priority || TASK_PRIORITY.MEDIUM,
        dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '',
      })
    } else {
      setFormData({
        title: '',
        description: '',
        status: TASK_STATUS.TODO,
        priority: TASK_PRIORITY.MEDIUM,
        dueDate: '',
      })
    }
    setFormErrors({})
    dispatch(clearError())
  }, [task, open, dispatch])

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
    if (formErrors[e.target.name]) {
      setFormErrors({
        ...formErrors,
        [e.target.name]: '',
      })
    }
  }

  const validateForm = () => {
    const newErrors = {}
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required'
    }
    if (formData.title.trim().length > 100) {
      newErrors.title = 'Title must be less than 100 characters'
    }
    setFormErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return

    setSubmitting(true)
    dispatch(clearError())

    const taskData = {
      ...formData,
      dueDate: formData.dueDate || null,
    }

    try {
      if (task) {
        await dispatch(updateTask({ id: task.id, ...taskData })).unwrap()
      } else {
        await dispatch(createTask(taskData)).unwrap()
      }
      onClose()
    } catch (error) {
      // Error is handled by the slice
      console.error('Task operation failed:', error)
    } finally {
      setSubmitting(false)
    }
  }

  const handleClose = () => {
    dispatch(clearError())
    onClose()
  }

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle className="flex justify-between items-center">
        <span>{task ? 'Edit Task' : 'Create New Task'}</span>
        <IconButton onClick={handleClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      
      <form onSubmit={handleSubmit}>
        <DialogContent dividers>
          {error && (
            <Alert severity="error" className="mb-4">
              {error}
            </Alert>
          )}
          
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                error={!!formErrors.title}
                helperText={formErrors.title}
                required
                variant="outlined"
                disabled={submitting}
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                multiline
                rows={4}
                variant="outlined"
                disabled={submitting}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                select
                label="Status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                variant="outlined"
                disabled={submitting}
              >
                <MenuItem value={TASK_STATUS.TODO}>To Do</MenuItem>
                <MenuItem value={TASK_STATUS.IN_PROGRESS}>In Progress</MenuItem>
                <MenuItem value={TASK_STATUS.COMPLETED}>Completed</MenuItem>
              </TextField>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                select
                label="Priority"
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                variant="outlined"
                disabled={submitting}
              >
                <MenuItem value={TASK_PRIORITY.LOW}>Low</MenuItem>
                <MenuItem value={TASK_PRIORITY.MEDIUM}>Medium</MenuItem>
                <MenuItem value={TASK_PRIORITY.HIGH}>High</MenuItem>
              </TextField>
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Due Date"
                name="dueDate"
                type="date"
                value={formData.dueDate}
                onChange={handleChange}
                InputLabelProps={{
                  shrink: true,
                }}
                variant="outlined"
                disabled={submitting}
              />
            </Grid>
          </Grid>
        </DialogContent>
        
        <DialogActions className="p-4">
          <Button onClick={handleClose} color="inherit" disabled={submitting}>
            Cancel
          </Button>
          <Button 
            type="submit" 
            variant="contained" 
            color="primary"
            disabled={submitting}
          >
            {submitting 
              ? (task ? 'Updating...' : 'Creating...') 
              : (task ? 'Update Task' : 'Create Task')
            }
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}

export default TaskDialog