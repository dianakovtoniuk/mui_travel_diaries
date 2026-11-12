import { Alert, Box, Button, CircularProgress, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getUserDetails } from "../api-helpers/helpers";
import DiaryList from "../diaries/DiaryList";
import { authActions } from "../store";

const Profile = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    getUserDetails()
      .then((data) => {
        if (cancelled) return;
        setUser(data.user);
        // the profile endpoint returns posts without the author, add it back
        setPosts(
          data.user.posts.map((p) => ({
            ...p,
            user: { _id: data.user._id, name: data.user.name },
          }))
        );
      })
      .catch((err) => !cancelled && setError(err.message));
    return () => {
      cancelled = true;
    };
  }, []);

  const handleLogout = () => {
    dispatch(authActions.logout());
    navigate("/");
  };

  if (error) {
    return (
      <Box padding={4}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }
  if (!user) {
    return (
      <Box display="flex" justifyContent="center" padding={6}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box display="flex" flexDirection="column" alignItems="center">
      <Typography variant="h3" fontFamily="quicksand" padding={2}>
        User Profile
      </Typography>
      <Typography fontFamily="quicksand" padding={1}>
        Name: {user.name}
      </Typography>
      <Typography fontFamily="quicksand" padding={1}>
        Email: {user.email}
      </Typography>
      <Button
        onClick={handleLogout}
        sx={{ mt: 1 }}
        color="warning"
        variant="contained"
      >
        Logout
      </Button>
      <DiaryList
        posts={posts}
        setPosts={setPosts}
        emptyText="You haven't posted any diaries yet."
      />
    </Box>
  );
};

export default Profile;
