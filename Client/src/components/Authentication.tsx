import { Box, Button, Modal, Paper, Stack, TextField, Typography } from '@mui/material';
import { useState } from 'react';
import { signIn } from '../api/auth.';

interface AuthenticationProps {
    open: boolean;
    onClose: () => void;
    onSwitchToSignUp: () => void;
    onSignInSuccess: (token: string) => void; 
}
const Authentication: React.FC<AuthenticationProps> = ({ open, onClose, onSignInSuccess, onSwitchToSignUp }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSignIn = async () => {
        try {
            const accessToken = await signIn({ email, password });
            alert('Успешно влязохте в системата.');
            onSignInSuccess(accessToken);
        } catch (error) {
            alert('Входът не бе успешен. Моля, опитайте отново.');
            console.error(error);
        }
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            handleSignIn();
        }
    };

    return (
        <Modal open={open} onClose={onClose}>
            <Box
                component={Paper}
                onKeyDown={handleKeyDown} 
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
                    Вход
                </Typography>
                <Stack spacing={2}>
                    <TextField
                        label="Имейл"
                        fullWidth
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        autoFocus
                    />
                    <TextField
                        label="Парола"
                        type="password"
                        fullWidth
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                    />
                    <Button variant="contained" onClick={handleSignIn}>
                        Вход
                    </Button>
                    <Button variant="text" onClick={onSwitchToSignUp}>
                        Нямате акаунт? Регистрирайте се
                    </Button>
                    <Button variant="text" onClick={onClose}>
                        Отказ
                    </Button>
                </Stack>
            </Box>
        </Modal>
    );
};

export default Authentication;
