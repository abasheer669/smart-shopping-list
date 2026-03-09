import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import * as MuiIcons from '@mui/icons-material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import {
  Box,
  Card,
  CardContent,
  Chip,
  IconButton,
  Skeleton,
  Tooltip,
  Typography,
} from '@mui/material';

/** Dynamically resolve a MUI icon by name; fall back to ShoppingCart. */
function DynamicIcon({ name, ...props }) {
  const Icon = name ? MuiIcons[name] ?? ShoppingCartIcon : ShoppingCartIcon;
  return <Icon {...props} />;
}

/** Colour map for categories */
const CATEGORY_COLOURS = {
  Electronics: '#38bdf8',
  Clothing: '#a78bfa',
  Food: '#34d399',
  Books: '#fb923c',
  Home: '#f472b6',
  Sports: '#facc15',
  Beauty: '#e879f9',
  Toys: '#4ade80',
  Automotive: '#f87171',
  Other: '#94a3b8',
};

export default function ItemCard({ item, onDelete }) {
  const colour = CATEGORY_COLOURS[item.category] ?? '#94a3b8';

  return (
    <Card
      elevation={0}
      sx={{ position: 'relative', overflow: 'visible' }}
    >
      {/* Colour accent bar */}
      <Box
        sx={{
          position: 'absolute',
          left: 0,
          top: '12px',
          bottom: '12px',
          width: 4,
          borderRadius: '0 4px 4px 0',
          bgcolor: colour,
          opacity: 0.8,
        }}
      />

      <CardContent sx={{ pl: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
          {/* Category Icon */}
          <Box
            sx={{
              width: 44,
              height: 44,
              borderRadius: 2,
              bgcolor: `${colour}22`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <DynamicIcon name={item.iconName} sx={{ color: colour, fontSize: 22 }} />
          </Box>

          {/* Text */}
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography
              variant="subtitle1"
              fontWeight={700}
              noWrap
              title={item.name}
            >
              {item.name}
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5, flexWrap: 'wrap' }}>
              {/* Price */}
              {item.estimatedPrice != null ? (
                <Typography variant="h6" sx={{ color: colour, fontWeight: 800 }}>
                  A${Number(item.estimatedPrice).toLocaleString('en-AU', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                </Typography>
              ) : (
                <Typography variant="body2" color="text.secondary" fontStyle="italic">
                  Price unavailable
                </Typography>
              )}

              {/* Category chip */}
              {item.category && (
                <Chip
                  label={item.category}
                  size="small"
                  sx={{
                    bgcolor: `${colour}22`,
                    color: colour,
                    border: `1px solid ${colour}44`,
                    height: 20,
                  }}
                />
              )}
            </Box>

            {/* Reasoning */}
            {item.priceReasoning && (
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mt: 0.75, lineHeight: 1.4 }}
              >
                {item.priceReasoning}
              </Typography>
            )}
          </Box>

          {/* Delete */}
          <Tooltip title="Remove">
            <IconButton
              size="small"
              onClick={() => onDelete(item.id)}
              sx={{
                color: 'text.secondary',
                '&:hover': { color: 'error.main' },
                flexShrink: 0,
              }}
            >
              <DeleteOutlineIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      </CardContent>
    </Card>
  );
}

/** Skeleton placeholder while items load */
export function ItemCardSkeleton() {
  return (
    <Card elevation={0}>
      <CardContent>
        <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
          <Skeleton variant="rounded" width={44} height={44} />
          <Box sx={{ flex: 1 }}>
            <Skeleton variant="text" width="55%" height={24} />
            <Skeleton variant="text" width="30%" height={20} />
            <Skeleton variant="text" width="80%" height={16} />
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}
