"use client"

import React, { useState } from 'react';
import { AppBar, Toolbar, IconButton, Drawer, List, ListItem, ListItemIcon, ListItemText, Box, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button, Input, Typography } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import FeedbackIcon from '@mui/icons-material/Feedback';
import LogoutIcon from '@mui/icons-material/Logout';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
    const [file, setFile] = useState(null);
    const [fileName, setFileName] = useState("");
    const router = useRouter();

    const handleDashboardClick = () => {
        router.push('/dashboard');
    };

    const handleFeedbackClick = () => {
        router.push('/feedback');
    };

    const handleDrawerToggle = () => {
        setDrawerOpen(!drawerOpen);
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

    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            setFileName(selectedFile.name);
        }
    };

    const handleFileDrop = (event) => {
        event.preventDefault();
        const droppedFile = event.dataTransfer.files[0];
        if (droppedFile) {
            setFile(droppedFile);
            setFileName(droppedFile.name);
        }
    };

    const handleDragOver = (event) => {
        event.preventDefault();
    };

    return (
        <>
            <AppBar position="fixed">
                <Toolbar>
                    <IconButton
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        onClick={handleDrawerToggle}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" sx={{ flexGrow: 1, textAlign: 'center' }}>
                        Dashboard
                    </Typography>
                </Toolbar>
            </AppBar>

            <Drawer
                anchor="left"
                open={drawerOpen}
                onClose={handleDrawerToggle}
            >
                <Box
                    sx={{
                        width: 250,
                        bgcolor: 'primary.main',
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
                        button={true}
                        onClick={handleFeedbackClick}
                        sx={{ cursor: 'pointer' }}
                    >
                        <ListItemIcon>
                            <FeedbackIcon />
                        </ListItemIcon>
                        <ListItemText primary="Feedback" />
                    </ListItem>
                    <ListItem 
                        button={true}
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

            <Box sx={{ mt: 8, p: 3, textAlign: 'center' }}>
                <Typography variant="h6" mb={2}>
                    Upload Your Files
                </Typography>
                <Box
                    sx={{
                        border: '2px dashed #9e9e9e',
                        padding: 2,
                        borderRadius: 2,
                        backgroundColor: '#f5f5f5',
                        cursor: 'pointer',
                        mb: 2,
                        height: 200,
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}
                    onDrop={handleFileDrop}
                    onDragOver={handleDragOver}
                >
                    <Typography variant="body1">
                        Drop your PDF or Word files here or click to upload
                    </Typography>
                    <Input
                        type="file"
                        inputProps={{ accept: ".pdf, .doc, .docx" }}
                        onChange={handleFileChange}
                        sx={{ display: 'none' }}
                        id="file-input"
                    />
                </Box>
                <Button
                    variant="contained"
                    component="label"
                >
                    Upload
                    <Input
                        type="file"
                        inputProps={{ accept: ".pdf, .doc, .docx" }}
                        onChange={handleFileChange}
                        sx={{ display: 'none' }}
                    />
                </Button>
                {fileName && (
                    <Typography variant="body2" mt={2}>
                        Uploaded File: {fileName}
                    </Typography>
                )}
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
