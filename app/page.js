"use client"

import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Typography, Button, Box, Container, Card, CardContent, Grid, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField, Link } from '@mui/material';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import HeadsetMicIcon from '@mui/icons-material/HeadsetMic';
import { auth, db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import 'regenerator-runtime/runtime';
import './f.css'

export default function Home() {
    const router = useRouter();
    const [openSignup, setOpenSignup] = useState(false);
    const [openLogin, setOpenLogin] = useState(false);
    const [openForgotPassword, setOpenForgotPassword] = useState(false);
    const [signupData, setSignupData] = useState({ email: '', password: '', confirmPassword: '' });
    const [loginData, setLoginData] = useState({ email: '', password: '' });
    const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');
    const [signupError, setSignupError] = useState('');
    const [loginError, setLoginError] = useState('');
    const [forgotPasswordError, setForgotPasswordError] = useState('');
    const [forgotPasswordMessage, setForgotPasswordMessage] = useState('');
    const [reviews, setReviews] = useState([]);
    

    useEffect(() => {
        const style = document.createElement('style');
        style.textContent = `
          @import url('https://fonts.googleapis.com/css?family=Roboto:700');
          /* Additional styles */
        `;
        document.head.appendChild(style);
      }, []);
      

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, 'feedbacks'));
                const reviewsData = querySnapshot.docs.map(doc => doc.data());
                setReviews(reviewsData);
            } catch (error) {
                console.error("Error fetching reviews: ", error);
            }
        };

        fetchReviews();
    }, []);

    const handleSignupOpen = () => {
        setOpenSignup(true);
        setSignupError('');
    };

    const handleSignupClose = () => {
        setOpenSignup(false);
    };

    const handleLoginOpen = () => {
        setOpenLogin(true);
        setLoginError('');
    };

    const handleLoginClose = () => {
        setOpenLogin(false);
    };

    const handleForgotPasswordOpen = () => {
        setOpenForgotPassword(true);
        setForgotPasswordError('');
        setForgotPasswordMessage('');
    };

    const handleForgotPasswordClose = () => {
        setOpenForgotPassword(false);
    };

    const handleSignupChange = (e) => {
        setSignupData({ ...signupData, [e.target.name]: e.target.value });
    };

    const handleLoginChange = (e) => {
        setLoginData({ ...loginData, [e.target.name]: e.target.value });
    };

    const handleForgotPasswordChange = (e) => {
        setForgotPasswordEmail(e.target.value);
    };

    const handleSignupSubmit = async () => {
        if (signupData.password !== signupData.confirmPassword) {
            setSignupError("Passwords do not match");
            return;
        }

        try {
            await createUserWithEmailAndPassword(auth, signupData.email, signupData.password);
            handleSignupClose();
            handleLoginOpen();
        } catch (error) {
            setSignupError(error.message);
        }
    };

    const handleLoginSubmit = async () => {
        try {
            await signInWithEmailAndPassword(auth, loginData.email, loginData.password);
            handleLoginClose();
            router.push('/dashboard');
        } catch (error) {
            setLoginError(error.message);
        }
    };

    const handleForgotPasswordSubmit = async () => {
        try {
            await sendPasswordResetEmail(auth, forgotPasswordEmail);
            setForgotPasswordMessage("Password reset link sent! Check your email.");
        } catch (error) {
            setForgotPasswordError(error.message);
        }
    };

    return (
        <>
            
            <AppBar position="fixed" sx={{
  height: 55,
  backgroundColor: '#191212ad',
  boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.2)',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '0 20px',
  zIndex: 10,
  '& .MuiToolbar-root': {
    padding: 0,
  },
  '& .MuiButton-root': {
    textTransform: 'none',
    fontSize: 14,
    fontWeight: 500,
    padding: '6px 12px',
    borderRadius: 4,
    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
    },
  },
  '& .MuiTypography-root': {
    fontSize: 18,
    fontWeight: 600,
    cursor: 'pointer',
  },
  '& .MuiLink-root': {
    color: 'inherit',
    textDecoration: 'none',
    '&:hover': {
      textDecoration: 'underline',
    },
  },
}}>
  <Toolbar sx={{ padding: 0, width: '100%' }}>
    <Typography variant="h6" sx={{ fontSize: 18, fontWeight: 600, cursor: 'pointer', flexGrow: 1 }}>
      SafeMail
    </Typography>
    <Box sx={{
      display: 'flex',
      justifyContent: 'flex-end',
      alignItems: 'center',
      marginLeft: 'auto'
    }}>
      <Button href="#home" color="inherit" sx={{
        '&:hover': {
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
        },
      }}>
        Home
      </Button>
      <Button href="#features" color="inherit" sx={{
        '&:hover': {
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
        },
      }}>
        Features
      </Button>
      <Button href="#reviews" color="inherit" sx={{
        '&:hover': {
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
        },
      }}>
        Reviews
      </Button>
      <Button onClick={handleLoginOpen} color="inherit" sx={{
        '&:hover': {
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
        },
      }}>
        Login
      </Button>
      <Button onClick={handleSignupOpen} color="inherit" variant="outlined" sx={{
        borderColor: 'white',
        '&:hover': {
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          borderColor: 'white',
        },
      }}>
        Sign Up
      </Button>
    </Box>
  </Toolbar>
</AppBar>

            <Box id="home" height="100vh" sx={{
              bgcolor: 'black',
                
                padding: '80px 0',
                textAlign: 'center',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                '& .lines': {
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '100%',
                    margin: 'auto',
                    width: '90vw',
                },
                '& .line': {
                    position: 'absolute',
                    width: '1px',
                    height: '100%',
                    top: 0,
                    left: '50%',
                    background: 'rgba(255, 255, 255, 0.1)',
                    overflow: 'hidden',
                },
                '& .line::after': {
                    content: '""',
                    display: 'block',
                    position: 'absolute',
                    height: '15vh',
                    width: '100%',
                    top: '-50%',
                    left: 0,
                    background: 'linear-gradient(to bottom, rgba(255, 255, 255, 0) 0%, #ffffff 75%, #ffffff 100%)',
                    animation: 'drop 7s 0s infinite',
                    animationFillMode: 'forwards',
                    animationTimingFunction: 'cubic-bezier(0.4, 0.26, 0, 0.97)',
                },
                '& .line:nth-of-type(1)': {
                    marginLeft: '-25%',
                },
                '& .line:nth-of-type(1)::after': {
                    animationDelay: '2s',
                },
                '& .line:nth-of-type(3)': {
                    marginLeft: '25%',
                },
                '& .line:nth-of-type(3)::after': {
                    animationDelay: '2.5s',
                },
                '@keyframes drop': {
                    '0%': {
                        top: '-50%',
                    },
                    '100%': {
                        top: '110%',
                    },
                },
            }}>
                <div className="lines">
                    <div className="line"></div>
                    <div className="line"></div>
                    <div className="line"></div>
                </div>

                <Container maxWidth="md">
                <p style={{
      fontWeight: 700,
      textAlign: 'center',
      fontSize: 40,
      fontFamily: 'Hack, sans-serif',
      textTransform: 'uppercase',
      background: 'linear-gradient(90deg, #000, #fff, #000)',
      letterSpacing: 5,
      WebkitBackgroundClip: 'text',
      backgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundRepeat: 'no-repeat',
      backgroundSize: '80%',
      animation: 'shine 5s linear infinite',
      position: 'relative',
    }}>
      Welcome to safemail <br />
      <a href="#" style={{
        textDecoration: 'none',
        color: 'inherit',
        fontSize: 24,
      }}>
        A Digital Shield Against Harmful Content
      </a>
    </p>
         
    <Button
  variant="contained"
  size="large"
  sx={{
    mt: 4,
    border: '1px solid grey',
    backgroundColor: 'black',
    color: 'white',
    padding: '12px 32px',
    fontWeight: 'bold',
    textTransform: 'none',
    '& .label': {
      transition: 'transform 0.5s cubic-bezier(0.86, 0, 0.07, 1)',
    },
    '& .icon-arrow': {
      fill: '#FFF',
      height: '27px',
      width: '35px',
      transition: 'transform 0.5s cubic-bezier(0.86, 0, 0.07, 1), opacity 0.4s cubic-bezier(0.86, 0, 0.07, 1)',
    },
    '& .icon-arrow.before': {
      marginRight: '15px',
      transformOrigin: 'left center',
    },
    '& .icon-arrow.after': {
      marginLeft: '15px',
      opacity: 0,
      position: 'absolute',
      right: '32px',
      transform: 'translateX(75%) scaleX(0.1)',
      transformOrigin: 'right center',
    },
    '& .MuiSvgIcon-root': {
      transition: 'transform 0.5s cubic-bezier(0.86, 0, 0.07, 1)',
    },
    '&:hover': {
      backgroundColor: 'black',
      borderColor: 'grey',
    },
    '&:hover .label': {
      transform: 'translateX(-52px)',
    },
    '&:hover .icon-arrow.before': {
      opacity: 0,
      transform: 'translateX(-75%) scaleX(0.1)',
    },
    '&:hover .icon-arrow.after': {
      opacity: 1,
      transform: 'translateX(0) scaleX(1)',
    },
    '&:hover .MuiSvgIcon-root': {
      transform: 'translateX(-52px)',
    },
  }}
  onClick={() => router.push('/assistant')}
>
  <svg className="icon-arrow before" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 35 15">
    <path d="M27.172 5L25 2.828 27.828 0 34.9 7.071l-7.07 7.071L25 11.314 27.314 9H0V5h27.172z" />
  </svg>
  <span className="label">Customer Support</span>
  <span className="icon-arrow before">
    <HeadsetMicIcon sx={{ ml: 1 }} />
  </span>
  <svg className="icon-arrow after" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 35 15">
    <path d="M27.172 5L25 2.828 27.828 0 34.9 7.071l-7.07 7.071L25 11.314 27.314 9H0V5h27.172z" />
  </svg>
</Button>
                </Container>
            </Box>
            
            <Box
  id="features"
  height="100vh"
  sx={{
    padding: '80px 0',
    textAlign: 'center',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#000',
    position: 'relative',
  }}
>
  <Container maxWidth="md">
    <div className="animated-title">
      <div className="text-top">
        <div>
          <span>Key Feature</span>
          <span>Detection of</span>
        </div>
      </div>
      <div className="text-bottom">
        <div>toxic language</div>
      </div>
    </div>
    <Grid container spacing={4} justifyContent="center" sx={{ marginTop: '200px' }}>
      <Grid item xs={12}>
        <Typography
          variant="body1"
          align="center"
          sx={{
            color: '#ddd',
            maxWidth: '600px',
            margin: '150px auto 0 auto',
            fontSize: '1.6rem',
          }}
        >
          <strong>Use It For:</strong> Scanning documents for harmful and toxic language to maintain a safe communication environment.
        </Typography>
      </Grid>
    </Grid>
  </Container>
</Box>

            <Box id="reviews" height="100vh" sx={{
                bgcolor: 'black',
                padding: '80px 0',
                textAlign: 'center',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                <Container maxWidth="md">
                <Typography
  variant="h3"
  gutterBottom
  align="center"
  sx={{ color: 'white' }}
>
  Reviews
</Typography>

                    <Grid container spacing={4} justifyContent="center">
                        {reviews.map((review, index) => (
                            <Grid item xs={12} sm={4} key={index}>
                                <Card>
                                    <CardContent>
                                        <Typography variant="body1" gutterBottom>
                                            {`"${review.review}"`}
                                        </Typography>
                                        <Typography variant="subtitle1">
                                            - {review.name}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Container>
            </Box>

            <Dialog open={openSignup} onClose={handleSignupClose}>
                <DialogTitle>Sign Up</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Please fill out the form to create an account.
                    </DialogContentText>
                    <TextField
                        margin="dense"
                        label="Email"
                        name="email"
                        type="email"
                        fullWidth
                        variant="outlined"
                        value={signupData.email}
                        onChange={handleSignupChange}
                    />
                    <TextField
                        margin="dense"
                        label="Password"
                        name="password"
                        type="password"
                        fullWidth
                        variant="outlined"
                        value={signupData.password}
                        onChange={handleSignupChange}
                    />
                    <TextField
                        margin="dense"
                        label="Confirm Password"
                        name="confirmPassword"
                        type="password"
                        fullWidth
                        variant="outlined"
                        value={signupData.confirmPassword}
                        onChange={handleSignupChange}
                    />
                    {signupError && (
                        <Typography color="error" variant="body2">
                            {signupError}
                        </Typography>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleSignupClose} color="black">
                        Cancel
                    </Button>
                    <Button onClick={handleSignupSubmit} color="primary">
                        Sign Up
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog open={openLogin} onClose={handleLoginClose}PaperProps={{
    sx: {
      backgroundColor: '#e0e0e0',
      boxShadow: 'none',
      border: '1px solid white',
      backdropFilter: 'blur(10px)'
    },
  }}>
                <DialogTitle>Login</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Please enter your email and password to log in.
                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Email"
                        name="email"
                        type="email"
                        fullWidth
                        variant="outlined"
                        value={loginData.email}
                        onChange={handleLoginChange}
                    />
                    <TextField
                        margin="dense"
                        label="Password"
                        name="password"
                        type="password"
                        fullWidth
                        variant="outlined"
                        value={loginData.password}
                        onChange={handleLoginChange}
                    />
                    {loginError && (
                        <Typography color="error" variant="body2">
                            {loginError}
                        </Typography>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleForgotPasswordOpen} color="black">
                        Forgot Password?
                    </Button>
                    <Button onClick={handleLoginClose} color="black">
                        Cancel
                    </Button>
                    <Button onClick={handleLoginSubmit} color="primary">
                        Login
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog open={openForgotPassword} onClose={handleForgotPasswordClose}>
                <DialogTitle>Forgot Password</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Enter your email address to receive a password reset link.
                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Email"
                        type="email"
                        fullWidth
                        variant="outlined"
                        value={forgotPasswordEmail}
                        onChange={handleForgotPasswordChange}
                    />
                    {forgotPasswordError && (
                        <Typography color="error" variant="body2">
                            {forgotPasswordError}
                        </Typography>
                    )}
                    {forgotPasswordMessage && (
                        <Typography color="success" variant="body2">
                            {forgotPasswordMessage}
                        </Typography>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleForgotPasswordClose} color="black">
                        Cancel
                    </Button>
                    <Button onClick={handleForgotPasswordSubmit} color="primary">
                        Send Reset Link
                    </Button>
                </DialogActions>
            </Dialog>

            <Box sx={{ bgcolor: 'primary.main', color: 'white', p: 3, textAlign: 'center' }}>
                <Typography variant="body1">
                    © 2024 SafeMail. All rights reserved.
                </Typography>
                <Button variant="text" sx={{ color: 'white', textTransform: 'none' }}>
                    <Link href="/privacy-policy" sx={{ color: 'inherit' }}>
                        Privacy Policy
                    </Link>
                </Button>
            </Box>
        </>
    );
}