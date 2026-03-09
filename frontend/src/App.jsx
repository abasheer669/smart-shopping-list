import AddIcon from '@mui/icons-material/Add';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import {
  AppBar,
  Box,
  Container,
  Fab,
  Toolbar,
  Typography,
} from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import AddItemDialog from './components/AddItemDialog';
import ItemList from './components/ItemList';
import OfflineBanner from './components/OfflineBanner';
import { useOnlineStatus } from './hooks/useOnlineStatus';
import { api } from './services/api';

export default function App() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);

  const isOnline = useOnlineStatus();

  // ── Load items ────────────────────────────────────────────────────────────

  const loadItems = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await api.getItems();
      setItems(data);
    } catch (err) {
      setError('Could not load items. Please check your connection.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadItems();
  }, [loadItems]);

  // ── Add item ──────────────────────────────────────────────────────────────

  const handleAdd = async (name) => {
    const newItem = await api.createItem(name);
    setItems((prev) => [newItem, ...prev]);
  };

  // ── Delete item ───────────────────────────────────────────────────────────

  const handleDelete = async (id) => {
    // Optimistic update
    setItems((prev) => prev.filter((i) => i.id !== id));
    try {
      await api.deleteItem(id);
    } catch {
      // Roll back on failure
      await loadItems();
    }
  };

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* Offline banner */}
      <OfflineBanner offline={!isOnline} />

      {/* App bar */}
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          bgcolor: 'background.default',
          borderBottom: '1px solid',
          borderColor: 'divider',
          backdropFilter: 'blur(12px)',
        }}
      >
        <Toolbar>
          <AutoAwesomeIcon sx={{ mr: 1.5, color: 'primary.main' }} />
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 700 }}>
            Price Oracle
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {items.length} {items.length === 1 ? 'item' : 'items'}
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Content */}
      <Container maxWidth="sm" sx={{ py: 3, pb: 12 }}>
        <ItemList
          items={items}
          loading={loading}
          error={error}
          onDelete={handleDelete}
        />
      </Container>

      {/* Floating action button */}
      <Fab
        color="primary"
        aria-label="Add item"
        onClick={() => setDialogOpen(true)}
        sx={{
          position: 'fixed',
          bottom: 28,
          right: 24,
        }}
      >
        <AddIcon />
      </Fab>

      {/* Add item dialog */}
      <AddItemDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onAdd={handleAdd}
      />
    </Box>
  );
}
