import { Box, Button, Typography } from "@mui/material";
import { Link } from "react-router-dom";

const NotFound = () => (
  <Box textAlign="center" padding={8}>
    <Typography variant="h3" fontFamily="quicksand" gutterBottom>
      Page not found
    </Typography>
    <Button component={Link} to="/" variant="contained">
      Back to home
    </Button>
  </Box>
);

export default NotFound;
