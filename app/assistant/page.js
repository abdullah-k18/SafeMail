"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Box, IconButton, Stack, TextField, Avatar, AppBar, Toolbar, Typography, Paper, Divider, Fade, CircularProgress } from "@mui/material";
import SendIcon from '@mui/icons-material/Send';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import MicIcon from '@mui/icons-material/Mic';
import MicOffIcon from '@mui/icons-material/MicOff';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import 'regenerator-runtime/runtime';

const Assistant = () => {
  const router = useRouter();
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Hi! I'm the SafeMail Customer Support Assistant. How can I help you today?",
      profilePic: "https://www.shutterstock.com/image-vector/call-center-customer-support-vector-600nw-2285364015.jpg",
    },
  ]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [listening, setListening] = useState(false);

  const { transcript, resetTranscript } = useSpeechRecognition();

  useEffect(() => {
    if (listening) {
      setMessage(transcript);
    }
  }, [transcript, listening]);

  const sendMessage = async () => {
    if (!message.trim() || loading) return;

    setLoading(true);
    const userMessage = message;
    setMessage("");
    resetTranscript();
    setMessages((messages) => [
      ...messages,
      { role: "user", content: userMessage },
      { role: "assistant", content: "", profilePic: "https://www.shutterstock.com/image-vector/call-center-customer-support-vector-600nw-2285364015.jpg" },
    ]);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify([...messages, { role: "user", content: userMessage }]),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      let assistantMessage = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const text = decoder.decode(value, { stream: true });
        assistantMessage += text;
        setMessages((messages) => {
          const lastMessage = messages[messages.length - 1];
          const otherMessages = messages.slice(0, messages.length - 1);
          return [
            ...otherMessages,
            { ...lastMessage, content: assistantMessage },
          ];
        });
      }

      const utterance = new SpeechSynthesisUtterance(assistantMessage);
      window.speechSynthesis.speak(utterance);

    } catch (error) {
      console.error("Error:", error);
      setMessages((messages) => [
        ...messages,
        {
          role: "assistant",
          content: "I'm sorry, but I encountered an error. Please try again later.",
          profilePic: "https://www.shutterstock.com/image-vector/call-center-customer-support-vector-600nw-2285364015.jpg",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      sendMessage();
    }
  };

  const handleListen = () => {
    if (listening) {
      SpeechRecognition.stopListening();
      sendMessage();
      setTimeout(() => {
        setMessage("");
        resetTranscript();
      }, 100);
    } else {
      resetTranscript();
      setMessage("");
      SpeechRecognition.startListening({ continuous: true });
    }
    setListening(!listening);
  };

  return (
    <>
      <AppBar position="fixed" sx={{ height: 60, backgroundColor: '#1a1a2e', boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.5)' }}>
        <Toolbar>
          <IconButton edge="start" color="inherit" aria-label="back" onClick={() => router.push('/')}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1, textAlign: 'center', fontWeight: 'bold', color: '#f1f1f1' }}>
            Customer Support
          </Typography>
        </Toolbar>
      </AppBar>

      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: '#0f0f1a', padding: 2 }}>
        <Paper
          elevation={5}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            width: { xs: '100%', sm: '600px' },
            height: { xs: '85vh', sm: '75vh' },
            borderRadius: 3,
            overflow: 'hidden',
            backgroundColor: '#161625',
            color: '#fff',
          }}
        >
          <Stack
            direction="column"
            spacing={2}
            flexGrow={1}
            p={3}
            sx={{
              overflowY: 'auto',
              "&::-webkit-scrollbar": {
                width: "6px",
              },
              "&::-webkit-scrollbar-thumb": {
                backgroundColor: "#555",
                borderRadius: "10px",
              },
              "&::-webkit-scrollbar-thumb:hover": {
                backgroundColor: "#777",
              },
            }}
          >
            {messages.map((message, index) => (
              <Fade in={true} timeout={500} key={index}>
                <Box
                  display="flex"
                  justifyContent={message.role === "assistant" ? "flex-start" : "flex-end"}
                  alignItems="center"
                >
                  {message.role === "assistant" && (
                    <Avatar
                      src={message.profilePic}
                      alt="Assistant"
                      sx={{ marginRight: 1, width: 40, height: 40 }}
                    />
                  )}
                  <Box
                    sx={{
                      backgroundColor: message.role === "assistant" ? "#2d2d44" : "#0074e8",
                      color: "white",
                      borderRadius: "16px",
                      padding: "10px 15px",
                      maxWidth: "75%",
                      wordWrap: "break-word",
                      boxShadow: message.role === "assistant" ? '0 2px 10px rgba(0, 0, 0, 0.3)' : '0 2px 10px rgba(0, 118, 255, 0.4)',
                    }}
                  >
                    {message.content}
                  </Box>
                </Box>
              </Fade>
            ))}
          </Stack>

          {loading && (
            <Box display="flex" justifyContent="center" alignItems="center" py={1}>
              <CircularProgress color="white" size={24} />
            </Box>
          )}

          <Divider sx={{ backgroundColor: '#444' }} />

          <Stack direction="row" spacing={1} p={2}>
            <TextField
              placeholder="Type your message..."
              fullWidth
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={loading}
              variant="outlined"
              sx={{
                input: {
                  color: "#fff",
                  backgroundColor: "#1a1a2e",
                  borderRadius: '16px',
                  padding: '10px 15px',
                  "&::placeholder": {
                    color: "#999",
                  },
                },
                fieldset: { borderColor: "transparent" },
              }}
            />
            <IconButton
              onClick={sendMessage}
              sx={{
                borderRadius: '50%',
                backgroundColor: '#1a1a2e',
                color: "white",
                "&:hover": {
                  backgroundColor: '#2d2d44',
                },
              }}
              disabled={loading}
            >
              <SendIcon />
            </IconButton>
            <IconButton
              onClick={handleListen}
              sx={{
                borderRadius: '50%',
                color: listening ? "red" : "white",
                backgroundColor: listening ? '#2d2d44' : '#1a1a2e',
                "&:hover": {
                  backgroundColor: '#2d2d44',
                },
              }}
              disabled={loading}
            >
              {listening ? <MicOffIcon /> : <MicIcon />}
            </IconButton>
          </Stack>
        </Paper>
      </Box>
    </>
  );
};

export default Assistant;
