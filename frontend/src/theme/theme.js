import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#38bdf8',       // sky-400
      light: '#7dd3fc',
      dark: '#0284c7',
    },
    secondary: {
      main: '#a78bfa',       // violet-400
    },
    background: {
      default: '#0f172a',    // slate-900
      paper: '#1e293b',      // slate-800
    },
    success: {
      main: '#34d399',       // emerald-400
    },
    error: {
      main: '#f87171',       // red-400
    },
    text: {
      primary: '#f1f5f9',    // slate-100
      secondary: '#94a3b8',  // slate-400
    },
    divider: 'rgba(148,163,184,0.12)',
  },
  typography: {
    fontFamily: '"DM Sans", "Helvetica Neue", Arial, sans-serif',
    h4: { fontWeight: 700, letterSpacing: '-0.5px' },
    h6: { fontWeight: 600 },
    subtitle2: { fontWeight: 500 },
    body2: { fontSize: '0.8125rem' },
  },
  shape: {
    borderRadius: 14,
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          border: '1px solid rgba(148,163,184,0.08)',
          transition: 'transform 0.2s ease, box-shadow 0.2s ease',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          borderRadius: 10,
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 10,
          },
        },
      },
    },
    MuiFab: {
      styleOverrides: {
        root: {
          boxShadow: '0 4px 20px rgba(56,189,248,0.4)',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 600,
          fontSize: '0.7rem',
        },
      },
    },
  },
});

export default theme;
