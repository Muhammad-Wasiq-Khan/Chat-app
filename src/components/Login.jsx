import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../config/supabase'
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import CheckIcon from '@mui/icons-material/Check';

const Login = () => {
  const [alertype, setAlertType] = useState("")
  const [showAlert, setShowAlert] = useState(false);
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async () => {

    if (email.trim() == "" && password.trim() == "") {
      setAlertType("error")
      setError("Please Enter email and password");
      setShowAlert(true);
      return
    }
    setError('')

    const { data, error } = await supabase.from("users")
      .select("")
      .eq("email", email)
      .eq("password", password)
      .maybeSingle()

    if (error) {
      setAlertType("error")
      setShowAlert(true)
      setError(error.message)
      return
    }
    if (data == null) {
      setError("Invalid Credentials")
      return
    }
    // console.log(data)
    localStorage.setItem("userData", JSON.stringify(data))
    navigate('/users')
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <Box className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto bg-indigo-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mb-4">
            🔐
          </div>

          <h1 className="text-3xl font-bold text-gray-800">
            Welcome Back
          </h1>

          <p className="text-gray-500 mt-2">
            Sign in to continue chatting
          </p>
        </div>

        {/* Form */}
        <Stack spacing={3}>
          <TextField
            fullWidth
            label="Email"
            variant="outlined"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <TextField
            fullWidth
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {showAlert && (
            <Alert severity={alertype}>
              {error}
            </Alert>
          )}
          <Button
            variant="contained"
            fullWidth
            onClick={handleSubmit}
            sx={{
              py: 1.5,
              borderRadius: "12px",
              textTransform: "none",
              fontSize: "16px",
              backgroundColor: "#4f46e5",
              "&:hover": {
                backgroundColor: "#4338ca",
              },
            }}
          >
            Log In
          </Button>


        </Stack>

        {/* Footer */}
        <div className="text-center mt-6">
          <span className="text-gray-600">
            Don't have an account?
          </span>

          <button
            onClick={() => navigate("/signup")}
            className="ml-2 text-indigo-600 font-semibold hover:text-indigo-800 transition"
          >
            Sign Up
          </button>
        </div>
      </Box>
    </div>
  );
}

export default Login
