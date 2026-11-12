import { Box, Button, Typography } from "@mui/material";
import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

const Home = () => {
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);

  return (
    <Box position="relative" width="100%" minHeight="90vh">
      <Box
        component="img"
        src="/road.jpg"
        alt="Road"
        width="100%"
        height={{ xs: 260, md: "60vh" }}
        sx={{ objectFit: "cover", display: "block" }}
      />
      <Typography
        fontFamily="Dancing Script, cursive"
        variant="h3"
        fontWeight="bold"
        textAlign="center"
        width="100%"
        sx={{
          position: "absolute",
          top: 0,
          color: "#111115de",
          background: "#B2C8DF",
          fontSize: { xs: "1.6rem", md: "3rem" },
        }}
      >
        Dare to live the life you've always wanted
      </Typography>
      <Box display="flex" flexDirection="column" alignItems="center" padding={4}>
        <Typography
          fontFamily="quicksand"
          textAlign="center"
          variant="h4"
          paddingBottom={4}
          sx={{ fontSize: { xs: "1.4rem", md: "2.125rem" } }}
        >
          SHARE YOUR TRAVEL DIARIES WITH US
        </Typography>
        <Box display="flex" gap={3} flexWrap="wrap" justifyContent="center">
          <Button
            component={Link}
            to={isLoggedIn ? "/add" : "/auth"}
            variant="outlined"
          >
            Share Your Story
          </Button>
          <Button component={Link} to="/diaries" variant="contained">
            View Diaries
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default Home;
