import { Box, Typography } from "@mui/material";
import React, { useState } from "react";
import { postDelete } from "../api-helpers/helpers";
import Notice from "../components/Notice";
import DiaryItem from "./DiaryItem";

// Renders posts and owns the delete flow (confirm, call API, update list, notify)
const DiaryList = ({ posts, setPosts, emptyText }) => {
  const [notice, setNotice] = useState(null);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this diary? This cannot be undone.")) return;
    try {
      await postDelete(id);
      setPosts((prev) => prev.filter((p) => p._id !== id));
      setNotice({ message: "Diary deleted", severity: "success" });
    } catch (err) {
      setNotice({ message: err.message, severity: "error" });
    }
  };

  return (
    <>
      {posts.length === 0 && (
        <Typography color="text.secondary" padding={4}>
          {emptyText}
        </Typography>
      )}
      <Box
        display="flex"
        flexDirection="column"
        width="100%"
        alignItems="center"
        padding={{ xs: 1, md: 3 }}
      >
        {posts.map((item) => (
          <DiaryItem
            key={item._id}
            id={item._id}
            title={item.title}
            description={item.description}
            image={item.image}
            location={item.location}
            date={item.date}
            user={item.user?._id ?? item.user}
            name={item.user?.name}
            onDelete={handleDelete}
          />
        ))}
      </Box>
      <Notice notice={notice} onClose={() => setNotice(null)} />
    </>
  );
};

export default DiaryList;
