'use client';
import React, { useEffect, useState } from 'react';
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
    Typography,
    IconButton,
} from '@mui/material';
import axios from 'axios';
import MicIcon from '@mui/icons-material/Mic';
import ClearIcon from '@mui/icons-material/Clear';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';
import SendIcon from '@mui/icons-material/Send';
import { keyframes } from '@emotion/react';

declare global {
    interface Window {
        SpeechRecognition: any;
        webkitSpeechRecognition: any;
    }
}
interface LoanDialogProps {
    onConfirmYes: () => void;
}

const LoanDialog: React.FC<LoanDialogProps> = ({ onConfirmYes }) => {
    const [openMainDialog, setOpenMainDialog] = useState(false);
    const [openAiDialog, setOpenAiDialog] = useState(false);
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState<{ sender: string; text: string }[]>([]);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const getToken = () => {
        if (typeof window !== "undefined") {
            const token = localStorage.getItem('accessToken');
            return token;
        }
    }
    const getTokenData = getToken();

    useEffect(() => {
        if (!getTokenData) {
            router.push("/authentication/login");
        }
        if (getTokenData) {
            const decoded: any = jwtDecode(getTokenData);
            if (decoded.exp * 1000 < Date.now()) {
                localStorage.removeItem("accessToken");
                localStorage.removeItem("roleId");
                localStorage.removeItem("user");
                router.push("/authentication/login");
            }
        } else {
            router.push("/authentication/login");
        }
    }, [router, getTokenData]);

    const handleSend = async (prompt: string) => {
        if (!prompt.trim()) return;
        setLoading(true);
        try {
            const res = await axios.post('http://localhost:4000/ai/ask', {
                message: prompt,
            });
            const aiResponse = res.data.choices[0].text.trim();
            setMessages((prev) => [
                ...prev,
                { sender: 'You', text: prompt },
                { sender: 'Assistant', text: aiResponse },
            ]);
        } catch (error) {
            console.error('API Error:', error);
            setMessages((prev) => [
                ...prev,
                { sender: 'You', text: prompt },
                { sender: 'Assistant', text: 'Failed to fetch data from AI, please try again later.' },
            ]);
        } finally {
            setInput('');
            setLoading(false);
        }
    };

    const openAiAndSendPrompt = (prompt: string) => {
        setOpenAiDialog(true);
        setOpenMainDialog(false);
        handleSend(prompt);
    };

    const handleAiDialogClose = () => {
        setOpenAiDialog(false);
        setShowConfirmDialog(true);
        setInput('');
        setMessages([]);
    };

    const handleUserResponse = (isYes: boolean) => {
        setShowConfirmDialog(false);
        if (isYes) {
            onConfirmYes();
        }
    };

    const handleVoiceRecognition = () => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            alert('Speech recognition not supported in this browser.');
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.lang = 'en-US';
        recognition.onresult = (event: any) => {
            const speechResult = event.results[0][0].transcript;
            setInput(speechResult);
            handleSend(speechResult);
        };
        recognition.onerror = (event: any) => {
            console.error('Speech recognition error:', event);
        };
        recognition.start();
    };

    const handleClearConversation = () => {
        setMessages([]);
        setInput('');
    };

    const typingAnimation = keyframes`
                0% {
                    opacity: 0;
                }
                100% {
                    opacity: 1;
                }
            `;
    const renderMessages = () => {
        return messages.map((msg, index) => {
            const words = msg.text.split(/(\s+)/);
            const isAssistant = msg.sender === 'Assistant';

            return (
                <Box
                    key={index}
                    sx={{
                        mb: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: msg.sender === 'You' ? 'flex-end' : 'flex-start',
                    }}
                >
                    <Typography sx={{ fontWeight: 500, fontSize: '1rem' }}>{msg.sender}:</Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
                        {words.map((word, wordIndex) => (
                            <Typography
                                key={wordIndex}
                                variant="body2"
                                sx={
                                    isAssistant
                                        ? {
                                            whiteSpace: 'pre-wrap',
                                            animation: `${typingAnimation} 0.5s forwards`,
                                            animationDelay: `${0.2 + wordIndex * 0.1}s`,
                                            opacity: 0,
                                        }
                                        : {
                                            whiteSpace: 'pre-wrap',
                                            opacity: 1,
                                        }
                                }
                            >
                                {word}
                            </Typography>
                        ))}
                    </Box>
                </Box>
            );
        });
    };
    return (
        <Box bottom={16} right={80}>
            <IconButton
                onClick={() => setOpenMainDialog(true)}
                sx={{
                    background: 'radial-gradient(circle at center,rgb(243, 234, 234) 0%, #000 90%)',
                    color: '#00e5ff',
                    boxShadow: '0 0 10px rgb(165, 42, 42), 0 0 20px rgb(87, 34, 79)',
                    '&:hover': {
                        background: 'radial-gradient(circle at center, #000 0%,rgb(55, 186, 209) 40%)',
                        boxShadow: '0 0 15px rgb(64, 88, 221), 0 0 25px rgb(35, 148, 120)',
                    },
                    animation: 'rotate360 6s linear infinite, pulse 2s ease-in-out infinite',
                    '@keyframes rotate360': {
                        '0%': { transform: 'rotate(0deg)' },
                        '100%': { transform: 'rotate(360deg)' },
                    },
                    '@keyframes pulse': {
                        '0%': { transform: 'scale(1)' },
                        '50%': { transform: 'scale(1.1)' },
                        '100%': { transform: 'scale(1)' },
                    },
                    p: 1,
                }}
            >
                <Image src="/images/logos/smallLogo.png" alt="Investment" width={24} height={24} />
            </IconButton>

            {/* Loan Options Dialog */}
            <Dialog
                open={openMainDialog}
                onClose={() => setOpenMainDialog(false)}
                fullWidth
                maxWidth="md"
                PaperProps={{ sx: { minWidth: 600, maxWidth: 800 } }}
            >
                <DialogTitle sx={{ color: 'brown', textAlign: 'center' }}>Select an Loan Type</DialogTitle>
                <DialogContent sx={{ p: 2 }}>
                    <Box
                        sx={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
                            gap: 2,
                            pb: 2,
                        }}
                    >
                        {['Home', 'Personal', 'Education', 'Business'].map((type) => (
                            <Button
                                key={type}
                                variant="contained"
                                onClick={() => openAiAndSendPrompt(`What can you tell me about ${type} Insurance?`)}
                            >
                                {type} Loan
                            </Button>
                        ))}
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenMainDialog(false)}>Close</Button>
                </DialogActions>
            </Dialog>
            {/* AI Assistant Dialog */}
            <Dialog
                open={openAiDialog}
                onClose={handleAiDialogClose}
                fullWidth
                maxWidth="md"
                PaperProps={{ sx: { minWidth: 600, maxWidth: 800, minHeight: 500 } }}
            >
                <DialogTitle
                    sx={{
                        color: 'brown',
                        textAlign: 'center',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: 1,
                        '@keyframes rotate360': {
                            '0%': { transform: 'rotate(0deg)' },
                            '100%': { transform: 'rotate(360deg)' },
                        },
                        '@keyframes pulse': {
                            '0%': { transform: 'scale(1)' },
                            '50%': { transform: 'scale(1.1)' },
                            '100%': { transform: 'scale(1)' },
                        },
                    }}
                >
                    <IconButton
                        sx={{
                            background: 'radial-gradient(circle at center,rgb(243, 234, 234) 0%, #000 90%)',
                            color: '#00e5ff',
                            boxShadow: '0 0 10px rgb(165, 42, 42), 0 0 20px rgb(87, 34, 79)',
                            '&:hover': {
                                background: 'radial-gradient(circle at center, #000 0%,rgb(55, 186, 209) 40%)',
                                boxShadow: '0 0 15px rgb(64, 88, 221), 0 0 25px rgb(35, 148, 120)',
                            },
                            animation: 'rotate360 6s linear infinite, pulse 2s ease-in-out infinite',
                            '@keyframes rotate360': {
                                '0%': { transform: 'rotate(0deg)' },
                                '100%': { transform: 'rotate(360deg)' },
                            },
                            '@keyframes pulse': {
                                '0%': { transform: 'scale(1)' },
                                '50%': { transform: 'scale(1.1)' },
                                '100%': { transform: 'scale(1)' },
                            },
                            p: 1,
                        }}
                    >
                        <Image src="/images/logos/smallLogo.png" alt="Investment" width={24} height={24} />
                    </IconButton>
                    Connect India AI Assistant
                </DialogTitle>

                <DialogContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', p: 2 }}>
                    <Box sx={{ flexGrow: 1, overflowY: 'auto', mb: 2, p: 2, border: '1px solid #ccc', borderRadius: 2, backgroundColor: '#f7f7f7' }}>
                        {renderMessages()}
                    </Box>
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            borderRadius: 2,
                            border: '1px solid #ccc',
                            px: 2,
                            py: 1,
                            backgroundColor: '#fff',
                            justifyContent: 'space-between',
                        }}
                    >
                        <TextField
                            placeholder="Ask more about this..."
                            variant="standard"
                            multiline
                            fullWidth
                            InputProps={{ disableUnderline: true }}
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    handleSend(input);
                                }
                            }}
                            sx={{
                                '& .MuiInputBase-input': {
                                    fontSize: '16px',
                                    maxHeight: '200px',
                                    overflowY: 'auto',
                                },
                            }}
                        />
                        <Box sx={{ display: 'flex', gap: 1, ml: 1 }}>
                            <IconButton onClick={() => handleSend(input)} color="primary">
                                <SendIcon />
                            </IconButton>
                            <IconButton onClick={handleVoiceRecognition} color="secondary">
                                <MicIcon />
                            </IconButton>
                            <IconButton onClick={handleClearConversation} color="error">
                                <ClearIcon />
                            </IconButton>
                        </Box>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleAiDialogClose}>Close</Button>
                </DialogActions>
            </Dialog>

            {/* Confirm Dialog */}
            <Dialog open={showConfirmDialog} onClose={() => setShowConfirmDialog(false)}>
                <DialogTitle sx={{ color: 'brown', textAlign: 'center' }}>
                    Would you like to explore more about loans?
                </DialogTitle>
                <DialogActions>
                    <Button onClick={() => handleUserResponse(false)}>No</Button>
                    <Button onClick={() => handleUserResponse(true)} variant="contained" color="primary">
                        Yes
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default LoanDialog;
