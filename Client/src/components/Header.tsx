import MenuIcon from '@mui/icons-material/Menu';
import { AppBar, Box, Button, IconButton, Toolbar, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import Authentication from './Authentication';
import SignUpModal from './SignUpModal';

interface HeaderProps {
    onMenuClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [signInOpen, setSignInOpen] = useState(false);
    const [signUpOpen, setSignUpOpen] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            setIsLoggedIn(true);
        }
    }, []);

    // Called on successful sign in, receive token and save it
    const handleSignInSuccess = () => {
        setIsLoggedIn(true);
        setSignInOpen(false);
    };

    const handleSignOut = () => {
        localStorage.removeItem('accessToken');
        setIsLoggedIn(false);
        alert('Излязохте от системата');
    };

    return (
        <>
            <AppBar position="static" sx={{ backgroundColor: '#F3F4F6' }}>
                <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <IconButton
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        onClick={onMenuClick}
                        sx={{ mr: 2 }}
                    >
                        <MenuIcon sx={{ color: '#1E3A8A' }} />
                    </IconButton>
                    <Typography variant="h4" component="div" sx={{ color: '#1E3A8A' }}>
                        Талант+
                    </Typography>
                    <Box>
                        {isLoggedIn ? (
                            <Button
                                sx={{ backgroundColor: '#CBD5E1', color: '#1E3A8A', mr: 1, '&:hover': { backgroundColor: '#94A3B8' } }}
                                onClick={handleSignOut}
                            >
                                Изход
                            </Button>
                        ) : (
                            <Button
                                sx={{ backgroundColor: '#CBD5E1', color: '#1E3A8A', mr: 1, '&:hover': { backgroundColor: '#94A3B8' } }}
                                onClick={() => setSignInOpen(true)}
                            >
                                Вход
                            </Button>
                        )}
                    </Box>
                </Toolbar>
            </AppBar>

            <Authentication
                open={signInOpen}
                onClose={() => setSignInOpen(false)}
                onSignInSuccess={handleSignInSuccess}
                onSwitchToSignUp={() => {
                    setSignInOpen(false);
                    setSignUpOpen(true);
                }}
            />

            <SignUpModal
                open={signUpOpen}
                onClose={() => setSignUpOpen(false)}
                onSwitchToSignIn={() => {
                    setSignUpOpen(false);
                    setSignInOpen(true);
                }}
            />
        </>
    );
};

export default Header;
