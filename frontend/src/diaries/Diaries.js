import { Alert, Box, CircularProgress } from "@mui/material";
import React, { useEffect, useState } from "react";
import { getAllPosts } from "../api-helpers/helpers";
import DiaryList from "./DiaryList";

const Diaries = () => {
  const [posts, setPosts] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    getAllPosts()
      .then((data) => !cancelled && setPosts(data.posts))
      .catch((err) => !cancelled && setError(err.message));
    return () => {
      cancelled = true;
    };
  }, []);

  if (error) {
    return (
      <Box padding={4}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }
  if (!posts) {
    return (
      <Box display="flex" justifyContent="center" padding={6}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box display="flex" flexDirection="column" alignItems="center">
      <DiaryList
        posts={posts}
        setPosts={setPosts}
        emptyText="No diaries yet. Be the first to share one!"
      />
    </Box>
  );
};

export default Diaries;
