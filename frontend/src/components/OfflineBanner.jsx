import WifiOffIcon from '@mui/icons-material/WifiOff';
import { Alert, Collapse } from '@mui/material';

export default function OfflineBanner({ offline }) {
  return (
    <Collapse in={offline} unmountOnExit>
      <Alert
        icon={<WifiOffIcon fontSize="small" />}
        severity="warning"
        sx={{ borderRadius: 0, justifyContent: 'center', fontWeight: 600 }}
      >
        You're offline — showing cached list
      </Alert>
    </Collapse>
  );
}
