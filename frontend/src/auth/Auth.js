import React, { useState } from "react";
import {
  Alert,
  Box,
  Button,
  FormLabel,
  TextField,
  Typography,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { sendAuthRequest } from "../api-helpers/helpers";
import { authActions } from "../store";

const Auth = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const [isSignup, setIsSignup] = useState(false);
  const [inputs, setInputs] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const redirectTo = location.state?.from || "/diaries";

  if (isLoggedIn && !loading) return <Navigate to={redirectTo} replace />;

  const handleChange = (e) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await sendAuthRequest(isSignup, inputs);
      dispatch(authActions.login({ token: data.token, user: data.user }));
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      width={{ xs: "92%", sm: "70%", md: "40%" }}
      borderRadius={10}
      boxShadow="5px 5px 10px #ccc"
      margin="auto"
      marginTop={10}
    >
      <form onSubmit={handleSubmit}>
        <Box
          display="flex"
          flexDirection="column"
          width="80%"
          padding={5}
          margin="auto"
        >
          <Typography padding={1} variant="h4" textAlign="center">
            {isSignup ? "Signup" : "Login"}
          </Typography>
          {error && (
            <Alert severity="error" sx={{ mb: 1 }}>
              {error}
            </Alert>
          )}
          {isSignup && (
            <>
              <FormLabel htmlFor="name">Name</FormLabel>
              <TextField
                id="name"
                onChange={handleChange}
                value={inputs.name}
                name="name"
                required
                margin="normal"
                inputProps={{ maxLength: 60 }}
              />
            </>
          )}
          <FormLabel htmlFor="email">Email</FormLabel>
          <TextField
            id="email"
            onChange={handleChange}
            value={inputs.email}
            name="email"
            type="email"
            required
            margin="normal"
          />
          <FormLabel htmlFor="password">Password</FormLabel>
          <TextField
            id="password"
            onChange={handleChange}
            value={inputs.password}
            name="password"
            type="password"
            required
            margin="normal"
            helperText={isSignup ? "At least 6 characters" : undefined}
            inputProps={{ minLength: isSignup ? 6 : undefined, maxLength: 72 }}
          />
          <Button
            sx={{ mt: 2, borderRadius: 10 }}
            type="submit"
            variant="contained"
            disabled={loading}
          >
            {loading ? "Please wait..." : isSignup ? "Signup" : "Login"}
          </Button>
          <Button
            onClick={() => {
              setIsSignup(!isSignup);
              setError("");
            }}
            sx={{ mt: 2, borderRadius: 10 }}
            variant="outlined"
            disabled={loading}
          >
            Change to {isSignup ? "Login" : "Signup"}
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default Auth;
