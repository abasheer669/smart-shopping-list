import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import { Alert, Box, Stack, Typography } from '@mui/material';
import ItemCard, { ItemCardSkeleton } from './ItemCard';

export default function ItemList({ items, loading, error, onDelete }) {
  if (loading) {
    return (
      <Stack spacing={1.5}>
        {[1, 2, 3].map((k) => <ItemCardSkeleton key={k} />)}
      </Stack>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ borderRadius: 2 }}>
        {error}
      </Alert>
    );
  }

  if (!items.length) {
    return (
      <Box
        sx={{
          textAlign: 'center',
          py: 10,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 2,
        }}
      >
        <ShoppingCartOutlinedIcon sx={{ fontSize: 56, color: 'text.secondary', opacity: 0.4 }} />
        <Typography color="text.secondary" variant="body1">
          Your list is empty.
          <br />
          Tap <strong>+</strong> to add your first item.
        </Typography>
      </Box>
    );
  }

  return (
    <Stack spacing={1.5}>
      {items.map((item) => (
        <ItemCard key={item.id} item={item} onDelete={onDelete} />
      ))}
    </Stack>
  );
}
