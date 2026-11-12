import {
  Avatar,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  IconButton,
  Typography,
} from "@mui/material";
import { Box } from "@mui/material";
import ModeEditOutlineIcon from "@mui/icons-material/ModeEditOutline";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

const FALLBACK_IMAGE =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="600" height="220"><rect width="100%" height="100%" fill="#e0e6ee"/><text x="50%" y="50%" fill="#8a97a8" font-family="sans-serif" font-size="20" text-anchor="middle">Image unavailable</text></svg>'
  );

const DiaryItem = ({
  title,
  description,
  image,
  location,
  date,
  id,
  user,
  name,
  onDelete,
}) => {
  const userId = useSelector((state) => state.auth.userId);
  const isOwner = Boolean(userId) && userId === user;

  return (
    <Card
      sx={{
        width: { xs: "100%", md: "60%" },
        maxWidth: 720,
        height: "auto",
        margin: 1,
        padding: 1,
        display: "flex",
        flexDirection: "column",
        boxShadow: "5px 5px 10px #ccc",
      }}
    >
      <CardHeader
        avatar={
          <Avatar sx={{ bgcolor: "red" }} aria-label="author">
            {(name || "?").charAt(0).toUpperCase()}
          </Avatar>
        }
        title={location}
        subheader={new Date(date).toLocaleDateString()}
      />

      <Box
        component="img"
        src={image}
        alt={title}
        onError={(e) => {
          e.currentTarget.onerror = null;
          e.currentTarget.src = FALLBACK_IMAGE;
        }}
        sx={{ width: "100%", height: 220, objectFit: "cover" }}
      />
      <CardContent>
        <Typography paddingBottom={1} variant="h6" color="text.secondary">
          {title}
        </Typography>
        <hr />
        <Box paddingTop={1} display="flex">
          <Typography
            width="auto"
            sx={{ mr: 1 }}
            fontWeight="bold"
            variant="caption"
          >
            {name}:
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}
          >
            {description}
          </Typography>
        </Box>
      </CardContent>

      {isOwner && (
        <CardActions sx={{ marginLeft: "auto" }}>
          <IconButton
            component={Link}
            to={`/post/${id}`}
            color="warning"
            aria-label="Edit diary"
          >
            <ModeEditOutlineIcon />
          </IconButton>
          <IconButton
            onClick={() => onDelete(id)}
            color="error"
            aria-label="Delete diary"
          >
            <DeleteForeverIcon />
          </IconButton>
        </CardActions>
      )}
    </Card>
  );
};

export default DiaryItem;
