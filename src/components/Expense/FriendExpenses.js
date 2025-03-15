import React, { useState, useEffect } from "react";
import {
  Container,
  TextField,
  Button,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  Box,
  Grid,
  Card,
  CardContent,
} from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import API from "../../api";
import NavigationBar from "../NavigationBar";

const FriendExpenses = () => {
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [friendOptions, setFriendOptions] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [balanceWithFriend, setBalanceWithFriend] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const response = await API.get("/users/");
        const currentUser = JSON.parse(localStorage.getItem("user"));
        const filteredFriends = response.data.filter(
          (user) => user.id !== currentUser.id
        );
        setFriendOptions(filteredFriends);
      } catch (err) {
        console.error("Error fetching users", err);
        setError("Failed to fetch users.");
      }
    };
    fetchFriends();
  }, []);

  const handleFetchExpenses = async () => {
    if (!selectedFriend) {
      setError("Please select a friend.");
      return;
    }
    try {
      const [expensesRes, balanceRes] = await Promise.all([
        API.get(`/expenses/friend_expenses/?friend_id=${selectedFriend.id}`),
        API.get(`/friends/${selectedFriend.id}/balance/`)
      ]);

      setExpenses(expensesRes.data);
      setBalanceWithFriend(balanceRes.data);
      setError("");
    } catch (err) {
      console.error("Error fetching friend expenses", err);
      setError("Failed to fetch friend expenses.");
    }
  };

  const renderExpenseDetails = (expense) => (
    <Card sx={{ mb: 2 }} key={expense.id}>
      <CardContent>
        <Typography variant="h6">{expense.title}</Typography>
        <Typography variant="body2" color="textSecondary" gutterBottom>
          {expense.description}
        </Typography>
        
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={6}>
            <Typography variant="subtitle2">Total Amount: ${expense.total_amount}</Typography>
            <Typography variant="subtitle2">Tax Amount: ${expense.tax_amount}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="subtitle2">
              Created by: {expense.created_by.username}
            </Typography>
            <Typography variant="subtitle2">
              Date: {new Date(expense.created_at).toLocaleDateString()}
            </Typography>
          </Grid>
        </Grid>

        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle1">Items:</Typography>
          <List dense>
            {expense.items.map((item) => (
              <ListItem key={item.id}>
                <ListItemText
                  primary={item.name}
                  secondary={
                    <>
                      Amount: ${item.amount}
                      {item.is_shared ? 
                        " (Shared equally)" : 
                        ` (Assigned to: ${item.assigned_to?.username})`}
                    </>
                  }
                />
              </ListItem>
            ))}
          </List>
        </Box>

        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle1">Shares:</Typography>
          <List dense>
            {expense.shares.map((share) => (
              <ListItem key={share.id}>
                <ListItemText
                  primary={`${share.participant.username}: $${share.amount}`}
                  secondary={`${share.paid_by ? "Paid" : "Owes"} | ${
                    share.settled ? "Settled" : "Pending"
                  }`}
                />
              </ListItem>
            ))}
          </List>
        </Box>
      </CardContent>
    </Card>
  );

  return (
    <>
      <NavigationBar />
      <Container sx={{ mt: 4 }}>
        <Paper sx={{ p: 3 }}>
          <Typography variant="h4" gutterBottom>
            Friend Expenses
          </Typography>
          
          <Autocomplete
            options={friendOptions}
            getOptionLabel={(option) => option.username}
            value={selectedFriend}
            onChange={(event, newValue) => setSelectedFriend(newValue)}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Select Friend"
                variant="outlined"
                margin="normal"
                fullWidth
              />
            )}
          />
          
          {error && (
            <Typography color="error" sx={{ mb: 2 }}>
              {error}
            </Typography>
          )}
          
          <Button
            variant="contained"
            color="primary"
            onClick={handleFetchExpenses}
            sx={{ mt: 2, mb: 4 }}
          >
            Fetch Expenses
          </Button>

          {balanceWithFriend && (
            <Paper sx={{ p: 2, mb: 4, backgroundColor: '#f5f5f5' }}>
              <Typography variant="h6" gutterBottom>
                Balance with {selectedFriend.username}
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography variant="h5" color={balanceWithFriend.total_balance >= 0 ? 'success.main' : 'error.main'}>
                    Net Balance: ${balanceWithFriend.total_balance}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography color="success.main">
                    They owe you: ${balanceWithFriend.total_due_to_user}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography color="error.main">
                    You owe them: ${balanceWithFriend.total_user_owes}
                  </Typography>
                </Grid>
              </Grid>
            </Paper>
          )}

          <List>
            {expenses.length > 0 ? (
              expenses.map((expense) => renderExpenseDetails(expense))
            ) : (
              <Typography variant="body1" sx={{ mt: 2 }}>
                No expenses found with this friend.
              </Typography>
            )}
          </List>
        </Paper>
      </Container>
    </>
  );
};

export default FriendExpenses;