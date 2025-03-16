import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Paper, Typography, TextField, Button, Box, InputAdornment } from "@mui/material";
import { PersonOutline, EmailOutlined, LockOutlined, AppRegistrationOutlined } from "@mui/icons-material";
import API from "../../api";

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ username: "", email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await API.post("/auth/register/", formData);
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      API.defaults.headers.common["Authorization"] = `Token ${response.data.token}`;
      navigate("/login");
    } catch (err) {
      console.error("Registration error", err);
      setError("Registration failed. Please try again.");
    }
  };

  return (
    <Container maxWidth="sm" className="mt-20">
      <Paper elevation={6} className="p-8 rounded-lg shadow-lg bg-gradient-to-br from-teal-50 to-cyan-50">
        <Box className="flex flex-col items-center mb-6">
          <div className="w-16 h-16 bg-teal-600 rounded-full flex items-center justify-center mb-4 shadow-md">
            <AppRegistrationOutlined fontSize="large" className="text-white" />
          </div>
          <Typography variant="h4" className="font-bold text-gray-800">
            Create Account
          </Typography>
          <Typography variant="body1" className="text-gray-600 mt-1">
            Join us to get started
          </Typography>
        </Box>
        
        {error && (
          <Box className="bg-red-50 p-3 rounded-md mb-4 border-l-4 border-red-500">
            <Typography color="error" align="center" className="font-medium">
              {error}
            </Typography>
          </Box>
        )}
        
        <form onSubmit={handleSubmit} className="mt-6">
          <TextField
            label="Username"
            name="username"
            fullWidth
            margin="normal"
            variant="outlined"
            value={formData.username}
            onChange={handleChange}
            className="mb-4"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PersonOutline className="text-gray-500" />
                </InputAdornment>
              ),
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '10px',
                '&:hover fieldset': {
                  borderColor: '#0D9488',
                },
              },
            }}
          />
          
          <TextField
            label="Email"
            name="email"
            type="email"
            fullWidth
            margin="normal"
            variant="outlined"
            value={formData.email}
            onChange={handleChange}
            className="mb-4"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <EmailOutlined className="text-gray-500" />
                </InputAdornment>
              ),
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '10px',
                '&:hover fieldset': {
                  borderColor: '#0D9488',
                },
              },
            }}
          />
          
          <TextField
            label="Password"
            name="password"
            type="password"
            fullWidth
            margin="normal"
            variant="outlined"
            value={formData.password}
            onChange={handleChange}
            className="mb-4"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockOutlined className="text-gray-500" />
                </InputAdornment>
              ),
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '10px',
                '&:hover fieldset': {
                  borderColor: '#0D9488',
                },
              },
            }}
          />
          
          <Button 
            type="submit" 
            variant="contained" 
            color="primary" 
            fullWidth 
            className="mt-6 py-3 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700"
            sx={{ 
              borderRadius: '10px',
              textTransform: 'none',
              fontSize: '1rem',
              fontWeight: 'bold',
              boxShadow: '0 4px 6px rgba(50, 50, 93, 0.11), 0 1px 3px rgba(0, 0, 0, 0.08)'
            }}
          >
            Create Account
          </Button>
        </form>
        
        <Box className="mt-6 text-center">
          <Typography variant="body2" className="text-gray-600">
            Already have an account?{" "}
            <a href="/login" className="text-teal-600 hover:text-teal-800 font-medium transition-colors">
              Login
            </a>
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default Register;