import { Box, Button, Modal, Paper, Stack, TextField, Typography } from '@mui/material';
import { useState } from 'react';
import { signUp } from '../api/auth..ts';

interface SignUpModalProps {
    open: boolean;
    onClose: () => void;
    onSwitchToSignIn: () => void;
}

const SignUpModal: React.FC<SignUpModalProps> = ({ open, onClose, onSwitchToSignIn }) => {
    const [first_name, setFirstName] = useState('');
    const [last_name, setLastName] = useState('');
    const [phone_number, setPhoneNumber] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSignUp = async () => {
        try {
            await signUp({
                first_name,
                last_name,
                phone_number,
                email,
                password,
            });

            alert('Account created!');
            onSwitchToSignIn();
        } catch (error) {
            alert('Sign up failed.');
            console.error(error);
        }
    };

    // Handle Enter key press to trigger sign up
    const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            handleSignUp();
        }
    };

    return (
        <Modal open={open} onClose={onClose}>
            <Box
                component={Paper}
                onKeyDown={handleKeyDown}  // Listen for Enter key here
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
                    Sign Up
                </Typography>
                <Stack spacing={2}>
                    <TextField label="First Name" fullWidth value={first_name} onChange={e => setFirstName(e.target.value)} />
                    <TextField label="Last Name" fullWidth value={last_name} onChange={e => setLastName(e.target.value)} />
                    <TextField
                        label="Phone Number"
                        type="tel"
                        fullWidth
                        value={phone_number}
                        onChange={e => {
                            const onlyNums = e.target.value.replace(/\D/g, '');
                            setPhoneNumber(onlyNums);
                        }}
                        inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                    />
                    <TextField label="Email" fullWidth value={email} onChange={e => setEmail(e.target.value)} />
                    <TextField label="Password" type="password" fullWidth value={password} onChange={e => setPassword(e.target.value)} />
                    <Button variant="contained" onClick={handleSignUp}>
                        Create Account
                    </Button>
                    <Button variant="text" onClick={onSwitchToSignIn}>
                        Already have an account? Sign In
                    </Button>
                    <Button variant="text" onClick={onClose}>
                        Cancel
                    </Button>
                </Stack>
            </Box>
        </Modal>
    );
};

export default SignUpModal;
