import { Alert, Snackbar } from "@mui/material";

// notice = { message, severity } | null
const Notice = ({ notice, onClose }) => (
  <Snackbar
    open={Boolean(notice)}
    autoHideDuration={5000}
    onClose={onClose}
    anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
  >
    {notice ? (
      <Alert onClose={onClose} severity={notice.severity} sx={{ width: "100%" }}>
        {notice.message}
      </Alert>
    ) : undefined}
  </Snackbar>
);

export default Notice;
