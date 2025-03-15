import React, { useState } from 'react';
import { Button, TextField, Box, Typography, Alert } from '@mui/material';
import API from '../api';

const SettleUpForm = ({ friend, onSuccess }) => {
    const [amount, setAmount] = useState(friend.total);
    const [notes, setNotes] = useState('');

    const isPartialPayment = parseFloat(amount) < parseFloat(friend.total);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await API.post('/payments/', {
                from_user_id: friend.from_user_id || JSON.parse(localStorage.getItem('user')).id,
                to_user_id: friend.id,
                amount: parseFloat(amount),
                notes: notes,
            });
            alert('Payment recorded successfully');
            onSuccess();
        } catch (error) {
            console.error('Error recording payment:', error);
            alert('Failed to record payment');
        }
    };

    return (
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            <Typography variant="body1" gutterBottom>
                Total amount owed to {friend.username}: ${friend.total}
            </Typography>
            
            <TextField
                label="Amount to Pay"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                fullWidth
                margin="normal"
                required
                inputProps={{ 
                    step: 0.01,
                    min: 0,
                    max: friend.total 
                }}
            />

            {isPartialPayment && (
                <Alert severity="info" sx={{ mt: 2, mb: 2 }}>
                    This is a partial payment. You will still owe ${(friend.total - amount).toFixed(2)} after this payment.
                </Alert>
            )}

            <TextField
                label="Notes (optional)"
                multiline
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                fullWidth
                margin="normal"
            />

            <Button 
                type="submit" 
                variant="contained" 
                color="primary" 
                fullWidth
                sx={{ mt: 2 }}
            >
                Record Payment
            </Button>
        </Box>
    );
};

export default SettleUpForm;