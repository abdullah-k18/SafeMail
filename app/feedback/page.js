"use client";

import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, IconButton, Typography, Drawer, List, ListItem, ListItemIcon, ListItemText, Box, TextField, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import DashboardIcon from '@mui/icons-material/Dashboard';
import LogoutIcon from '@mui/icons-material/Logout';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useRouter } from 'next/navigation';
import { db, auth } from '../../firebase';
import { collection, addDoc, getDocs } from 'firebase/firestore';
import './CustomButton.css';

export default function Feedback() {
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
    const [feedbackData, setFeedbackData] = useState({ name: '', review: '' });
    const [feedbackError, setFeedbackError] = useState('');
    const [reviews, setReviews] = useState([]);
    const [currentReviewIndex, setCurrentReviewIndex] = useState(0);
    const router = useRouter();

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, 'feedbacks'));
                const reviewsList = querySnapshot.docs.map(doc => doc.data());
                setReviews(reviewsList);
            } catch (error) {
                console.error("Error fetching reviews: ", error);
            }
        };

        fetchReviews();
    }, []);

    const handleDrawerToggle = () => {
        setDrawerOpen(!drawerOpen);
    };

    const handleFeedbackChange = (e) => {
        setFeedbackData({ ...feedbackData, [e.target.name]: e.target.value });
    };

    const handleFeedbackSubmit = async () => {
        if (!feedbackData.name || !feedbackData.review) {
            setFeedbackError('All fields are required');
            return;
        }

        try {
            const user = auth.currentUser;
            if (user) {
                await addDoc(collection(db, 'feedbacks'), {
                    ...feedbackData,
                    userId: user.uid,
                    createdAt: new Date(),
                });
                setFeedbackData({ name: '', review: '' });
                setFeedbackError('');
                const querySnapshot = await getDocs(collection(db, 'feedbacks'));
                const reviewsList = querySnapshot.docs.map(doc => doc.data());
                setReviews(reviewsList);
            } else {
                setFeedbackError('You need to be logged in to submit feedback');
            }
        } catch (error) {
            setFeedbackError('Failed to submit feedback');
        }
    };

    const handleLogoutClick = () => {
        setLogoutDialogOpen(true);
    };

    const handleLogoutConfirm = () => {
        setLogoutDialogOpen(false);
        router.push('/');
    };

    const handleLogoutCancel = () => {
        setLogoutDialogOpen(false);
    };

    const handleNextReview = () => {
        setCurrentReviewIndex((prevIndex) => (prevIndex + 1) % reviews.length);
    };

    const handlePreviousReview = () => {
        setCurrentReviewIndex((prevIndex) => (prevIndex - 1 + reviews.length) % reviews.length);
    };

    return (
        <>
            <AppBar position="fixed" sx={{ backgroundColor: '#949090'}}>
                <Toolbar>
                    <IconButton
                        edge="start"
                        aria-label="menu"
                        onClick={handleDrawerToggle}
                        sx={{ color: 'white' }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" sx={{ flexGrow: 1, textAlign: 'center' }}>
                        Feedback
                    </Typography>
                </Toolbar>
            </AppBar>

            <Drawer
                anchor="left"
                open={drawerOpen}
                onClose={handleDrawerToggle}
                sx={{ '& .MuiDrawer-paper': { backgroundColor: 'white', color: 'black' } }}
            >
                <Box
                    sx={{
                        width: 250,
                        bgcolor: 'gray',
                        color: 'white',
                        textAlign: 'center',
                        p: 2,
                    }}
                >
                    <Typography variant="h6" noWrap>
                        MENU
                    </Typography>
                </Box>
                <List>
                    <ListItem 
                        button 
                        onClick={() => router.push('/dashboard')}
                        sx={{ cursor: 'pointer' }}
                    >
                        <ListItemIcon>
                            <DashboardIcon />
                        </ListItemIcon>
                        <ListItemText primary="Dashboard" />
                    </ListItem>
                    <ListItem 
                        button 
                        onClick={handleLogoutClick} 
                        sx={{ cursor: 'pointer' }}
                    >
                        <ListItemIcon>
                            <LogoutIcon />
                        </ListItemIcon>
                        <ListItemText primary="Logout" />
                    </ListItem>
                </List>
            </Drawer>

            <Box sx={{ mt: 8, p: 3, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Typography variant="h6" gutterBottom style={{ fontWeight: 'bold', fontSize: '2rem' }}>
    Leave your feedback
</Typography>

                <TextField
                    margin="normal"
                    label="Name"
                    name="name"
                    variant="outlined"
                    value={feedbackData.name}
                    onChange={handleFeedbackChange}
                    size="large"
                    sx={{ width: '400px', mx: 'auto' }}
                />
                <TextField
                    margin="normal"
                    label="Review"
                    name="review"
                    variant="outlined"
                    multiline
                    rows={4}
                    value={feedbackData.review}
                    onChange={handleFeedbackChange}
                    size="small"
                    sx={{ width: '400px', mx: 'auto' }}
                />
                {feedbackError && (
                    <Typography color="error" variant="body2" sx={{ mt: 1 }}>
                        {feedbackError}
                    </Typography>
                )}
                <button className="custom-button" onClick={handleFeedbackSubmit}>
                    <span>Submit Feedback</span>
                    <svg viewBox="-5 -5 110 110" preserveAspectRatio="none" aria-hidden="true">
                        <path d="M0,0 C0,0 100,0 100,0 C100,0 100,100 100,100 C100,100 0,100 0,100 C0,100 0,0 0,0"/>
                    </svg>
                </button>
            </Box>

            

            <Dialog
                open={logoutDialogOpen}
                onClose={handleLogoutCancel}
            >
                <DialogTitle>Logout</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to logout?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleLogoutCancel} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleLogoutConfirm} color="primary" autoFocus>
                        Yes
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}
