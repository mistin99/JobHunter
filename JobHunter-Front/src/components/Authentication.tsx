import { Box, Button, Modal, Paper, Stack, TextField, Typography } from '@mui/material';
import { useState } from 'react';
import { signIn } from '../api/auth.';

interface AuthenticationProps {
    open: boolean;
    onClose: () => void;
    onSwitchToSignUp: () => void;
    onSignInSuccess: (token: string) => void;  // <-- accept token param
}
const Authentication: React.FC<AuthenticationProps> = ({ open, onClose, onSignInSuccess, onSwitchToSignUp }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSignIn = async () => {
        try {
            const accessToken = await signIn({ email, password });
            alert('Signed in successfully.');
             onSignInSuccess(accessToken);;
        } catch (error) {
            alert('Login failed. Please try again.');
            console.error(error);
        }
    };

    // Keydown handler for Enter key
    const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
        if (event.key === 'Enter') {
            event.preventDefault(); // prevent form submit reload
            handleSignIn();
        }
    };

    return (
        <Modal open={open} onClose={onClose}>
            <Box
                component={Paper}
                onKeyDown={handleKeyDown} // <-- Listen here for key presses
                sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 350,
                    p: 4,
                    borderRadius: 2,
                }}
            >
                <Typography variant="h6" textAlign="center" mb={2}>
                    Sign In
                </Typography>
                <Stack spacing={2}>
                    <TextField
                        label="Email"
                        fullWidth
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        autoFocus
                    />
                    <TextField
                        label="Password"
                        type="password"
                        fullWidth
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                    />
                    <Button variant="contained" onClick={handleSignIn}>
                        Sign In
                    </Button>
                    <Button variant="text" onClick={onSwitchToSignUp}>
                        Don't have an account? Sign Up
                    </Button>
                    <Button variant="text" onClick={onClose}>
                        Cancel
                    </Button>
                </Stack>
            </Box>
        </Modal>
    );
};

export default Authentication;
