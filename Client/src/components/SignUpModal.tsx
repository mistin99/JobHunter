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

            alert('Акаунтът беше създаден!');
            onSwitchToSignIn();
        } catch (error) {
            alert('Регистрацията не беше успешна.');
        }
    };

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
                    Регистрация
                </Typography>
                <Stack spacing={2}>
                    <TextField label="Име" fullWidth value={first_name} onChange={e => setFirstName(e.target.value)} />
                    <TextField label="Фамилия" fullWidth value={last_name} onChange={e => setLastName(e.target.value)} />
                    <TextField
                        label="Телефонен номер"
                        type="tel"
                        fullWidth
                        value={phone_number}
                        onChange={e => {
                            const onlyNums = e.target.value.replace(/\D/g, '');
                            setPhoneNumber(onlyNums);
                        }}
                        inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                    />
                    <TextField label="Имейл" fullWidth value={email} onChange={e => setEmail(e.target.value)} />
                    <TextField label="Парола" type="password" fullWidth value={password} onChange={e => setPassword(e.target.value)} />
                    <Button variant="contained" onClick={handleSignUp}>
                        Създай акаунт
                    </Button>
                    <Button variant="text" onClick={onSwitchToSignIn}>
                        Вече имаш акаунт? Вход
                    </Button>
                    <Button variant="text" onClick={onClose}>
                        Отказ
                    </Button>
                </Stack>
            </Box>
        </Modal>
    );
};

export default SignUpModal;
