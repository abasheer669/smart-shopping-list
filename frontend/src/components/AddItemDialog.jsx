import AddIcon from '@mui/icons-material/Add';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import CloseIcon from '@mui/icons-material/Close';
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
  Typography,
} from '@mui/material';
import { useState } from 'react';

export default function AddItemDialog({ open, onClose, onAdd }) {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    const trimmed = name.trim();
    if (!trimmed) {
      setError('Please enter an item name.');
      return;
    }

    setError('');
    setLoading(true);
    try {
      await onAdd(trimmed);
      setName('');
      onClose();
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleClose = () => {
    if (loading) return;
    setName('');
    setError('');
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="xs"
      PaperProps={{ elevation: 0, sx: { border: '1px solid rgba(148,163,184,0.15)', borderRadius: 3 } }}
    >
      <DialogTitle sx={{ pb: 0 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <AutoAwesomeIcon sx={{ color: 'primary.main', fontSize: 20 }} />
            <Typography variant="h6">Add Item</Typography>
          </Box>
          <IconButton size="small" onClick={handleClose} disabled={loading}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ pt: 2 }}>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Type any product and the AI oracle will estimate its current market price.
        </Typography>

        <TextField
          autoFocus
          fullWidth
          label="Item name"
          placeholder='e.g. "Gaming Laptop" or "Organic Coffee"'
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={loading}
          error={Boolean(error)}
          helperText={error}
          inputProps={{ maxLength: 200 }}
        />

        <Button
          fullWidth
          variant="contained"
          size="large"
          onClick={handleSubmit}
          disabled={loading || !name.trim()}
          startIcon={loading ? <CircularProgress size={18} color="inherit" /> : <AddIcon />}
          sx={{ mt: 2 }}
        >
          {loading ? 'Estimating price…' : 'Add & Estimate Price'}
        </Button>
      </DialogContent>
    </Dialog>
  );
}
