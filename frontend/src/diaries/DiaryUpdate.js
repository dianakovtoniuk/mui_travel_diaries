import { Alert, Box, CircularProgress } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { getPostDetails, postUpdate } from "../api-helpers/helpers";
import DiaryForm from "./DiaryForm";

const DiaryUpdate = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const userId = useSelector((state) => state.auth.userId);
  const [post, setPost] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    getPostDetails(id)
      .then((data) => !cancelled && setPost(data.post))
      .catch((err) => !cancelled && setError(err.message));
    return () => {
      cancelled = true;
    };
  }, [id]);

  const handleSubmit = async (inputs) => {
    await postUpdate(inputs, id);
    navigate("/profile");
  };

  if (error) {
    return (
      <Box padding={4}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }
  if (!post) {
    return (
      <Box display="flex" justifyContent="center" padding={6}>
        <CircularProgress />
      </Box>
    );
  }
  if (post.user?._id !== userId) {
    return (
      <Box padding={4}>
        <Alert severity="warning">You can only edit your own diaries.</Alert>
      </Box>
    );
  }

  return (
    <DiaryForm
      heading="Edit Your Travel Diary"
      submitLabel="Save"
      onSubmit={handleSubmit}
      initial={{
        title: post.title,
        description: post.description,
        imageUrl: post.image,
        location: post.location,
        date: new Date(post.date).toISOString().slice(0, 10),
      }}
    />
  );
};

export default DiaryUpdate;
