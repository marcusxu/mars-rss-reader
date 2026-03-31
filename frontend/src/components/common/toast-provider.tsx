import { Snackbar, Alert, AlertColor, Slide, SlideProps } from '@mui/material';
import { useToast } from '../../hooks/use-toast';

function SlideTransition(props: SlideProps) {
  return <Slide {...props} direction="up" />;
}

export function ToastContainer() {
  const { toasts, removeToast } = useToast();

  return (
    <>
      {toasts.map((toast, index) => (
        <Snackbar
          key={toast.id}
          open={true}
          autoHideDuration={6000}
          onClose={() => removeToast(toast.id)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          TransitionComponent={SlideTransition}
          sx={{ bottom: { xs: 70 + index * 60, sm: 24 + index * 60 } }}
        >
          <Alert
            onClose={() => removeToast(toast.id)}
            severity={toast.severity as AlertColor}
            variant="filled"
            elevation={6}
            sx={{ width: '100%', minWidth: 300 }}
          >
            {toast.message}
          </Alert>
        </Snackbar>
      ))}
    </>
  );
}
