import { Alert, Box, Button, FormLabel, TextField, Typography } from "@mui/material";
import TravelExploreIcon from "@mui/icons-material/TravelExplore";
import React, { useState } from "react";

const emptyInputs = {
  title: "",
  description: "",
  location: "",
  imageUrl: "",
  date: "",
};

// Shared by the "add" and "edit" pages
const DiaryForm = ({ heading, submitLabel, initial, onSubmit }) => {
  const [inputs, setInputs] = useState({ ...emptyInputs, ...initial });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await onSubmit(inputs);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const field = (name, label, extra = {}) => (
    <>
      <FormLabel htmlFor={name} sx={{ fontFamily: "quicksand" }}>
        {label}
      </FormLabel>
      <TextField
        id={name}
        name={name}
        value={inputs[name]}
        onChange={handleChange}
        variant="standard"
        margin="normal"
        required
        {...extra}
      />
    </>
  );

  return (
    <Box display="flex" flexDirection="column" width="100%">
      <Box display="flex" margin="auto" padding={2}>
        <Typography fontWeight="bold" variant="h4" fontFamily="dancing script">
          {heading}
        </Typography>
        <TravelExploreIcon
          sx={{ fontSize: "40px", paddingLeft: 1, color: "lightcoral" }}
        />
      </Box>
      <form onSubmit={handleSubmit}>
        <Box
          padding={3}
          display="flex"
          width={{ xs: "95%", md: "70%" }}
          maxWidth={800}
          margin="auto"
          flexDirection="column"
        >
          {error && (
            <Alert severity="error" sx={{ mb: 1 }}>
              {error}
            </Alert>
          )}
          {field("title", "Title", { inputProps: { maxLength: 120 } })}
          {field("description", "Description", {
            multiline: true,
            minRows: 3,
            inputProps: { maxLength: 5000 },
          })}
          {field("imageUrl", "Image URL", { type: "url" })}
          {field("location", "Location", { inputProps: { maxLength: 120 } })}
          {field("date", "Date", { type: "date" })}
          <Button
            type="submit"
            color="warning"
            disabled={loading}
            sx={{ width: "50%", margin: "auto", mt: 2, borderRadius: 7 }}
            variant="contained"
          >
            {loading ? "Saving..." : submitLabel}
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default DiaryForm;
