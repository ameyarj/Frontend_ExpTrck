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
  Divider,
  Chip,
} from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import API from "../../api";
import NavigationBar from "../NavigationBar";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";
import EventNoteOutlinedIcon from "@mui/icons-material/EventNoteOutlined";
import SearchIcon from "@mui/icons-material/Search";
import ReceiptLongOutlinedIcon from "@mui/icons-material/ReceiptLongOutlined";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";

const FriendExpenses = () => {
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [friendOptions, setFriendOptions] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [balanceWithFriend, setBalanceWithFriend] = useState(null);
  const [error, setError] = useState("");
  const [hasSearched, setHasSearched] = useState(false);

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
      setHasSearched(true);
    } catch (err) {
      console.error("Error fetching friend expenses", err);
      setError("Failed to fetch friend expenses.");
    }
  };

  const handleFriendChange = (event, newValue) => {
    setSelectedFriend(newValue);
    if (!newValue) {
      setExpenses([]);
      setBalanceWithFriend(null);
      setHasSearched(false);
    }
  };

  const renderExpenseDetails = (expense) => (
    <Card 
      sx={{ 
        mb: 3, 
        borderRadius: 2, 
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        transition: "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: "0 8px 16px rgba(0,0,0,0.12)",
        }
      }} 
      key={expense.id}
    >
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>{expense.title}</Typography>
          <Chip 
            icon={<AttachMoneyIcon />} 
            label={`$${expense.total_amount}`} 
            color="primary" 
            variant="outlined" 
            sx={{ fontWeight: "bold" }}
          />
        </Box>
        
        {expense.description && (
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {expense.description}
          </Typography>
        )}
        
        <Divider sx={{ my: 2 }} />
        
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
              <PersonOutlineIcon sx={{ mr: 1, color: "primary.main" }} />
              <Typography variant="body2">
                Created by: <b>{expense.created_by.username}</b>
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
              <EventNoteOutlinedIcon sx={{ mr: 1, color: "primary.main" }} />
              <Typography variant="body2">
                Date: <b>{new Date(expense.created_at).toLocaleDateString()}</b>
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <AccountBalanceWalletOutlinedIcon sx={{ mr: 1, color: "primary.main" }} />
              <Typography variant="body2">
                Tax: <b>${expense.tax_amount}</b>
              </Typography>
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ my: 2 }} />

        <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1, display: "flex", alignItems: "center" }}>
          <ReceiptLongOutlinedIcon sx={{ mr: 1, fontSize: 20 }} />
          Items
        </Typography>
        <Box sx={{ backgroundColor: "rgba(0,0,0,0.02)", borderRadius: 1, p: 1 }}>
          <List dense disablePadding>
            {expense.items.map((item, index) => (
              <React.Fragment key={item.id}>
                {index > 0 && <Divider component="li" sx={{ my: 1 }} />}
                <ListItem disableGutters>
                  <ListItemText
                    primary={
                      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>{item.name}</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>${item.amount}</Typography>
                      </Box>
                    }
                    secondary={
                      <Typography variant="caption" color="text.secondary">
                        {item.is_shared ? 
                          "Shared equally" : 
                          `Assigned to: ${item.assigned_to?.username}`}
                      </Typography>
                    }
                  />
                </ListItem>
              </React.Fragment>
            ))}
          </List>
        </Box>

        <Divider sx={{ my: 2 }} />

        <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1, display: "flex", alignItems: "center" }}>
          <PersonOutlineIcon sx={{ mr: 1, fontSize: 20 }} />
          Shares
        </Typography>
        <Box sx={{ backgroundColor: "rgba(0,0,0,0.02)", borderRadius: 1, p: 1 }}>
          <List dense disablePadding>
            {expense.shares.map((share, index) => (
              <React.Fragment key={share.id}>
                {index > 0 && <Divider component="li" sx={{ my: 1 }} />}
                <ListItem disableGutters>
                  <ListItemText
                    primary={
                      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {share.participant.username}
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>${share.amount}</Typography>
                      </Box>
                    }
                    secondary={
                      <Box sx={{ display: "flex", gap: 1, mt: 0.5 }}>
                        <Chip 
                          label={share.paid_by ? "Paid" : "Owes"} 
                          size="small"
                          color={share.paid_by ? "success" : "warning"}
                          sx={{ height: 20, fontSize: '0.7rem' }}
                        />
                        <Chip 
                          label={share.settled ? "Settled" : "Pending"} 
                          size="small"
                          color={share.settled ? "success" : "default"}
                          variant={share.settled ? "filled" : "outlined"}
                          sx={{ height: 20, fontSize: '0.7rem' }}
                        />
                      </Box>
                    }
                  />
                </ListItem>
              </React.Fragment>
            ))}
          </List>
        </Box>
      </CardContent>
    </Card>
  );

  return (
    <>
      <NavigationBar />
      <Container maxWidth="md" sx={{ mt: 5, mb: 8 }}>
        <Paper 
          elevation={3}
          sx={{ 
            p: 4, 
            borderRadius: 3,
            backgroundImage: "linear-gradient(to bottom, #f9fafc, #ffffff)"
          }}
        >
          <Typography 
            variant="h4" 
            gutterBottom 
            sx={{ 
              fontWeight: 700, 
              color: "primary.main",
              mb: 3
            }}
          >
            Friend Expenses
          </Typography>
          
          <Box sx={{ 
            display: "flex", 
            gap: 2, 
            alignItems: "stretch",
            flexDirection: { xs: "column", sm: "row" } 
          }}>
            <Autocomplete
              options={friendOptions}
              getOptionLabel={(option) => option.username}
              value={selectedFriend}
              onChange={handleFriendChange}
              sx={{ flexGrow: 1 }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Select Friend"
                  variant="outlined"
                  fullWidth
                  InputProps={{
                    ...params.InputProps,
                    startAdornment: (
                      <>
                        <PersonOutlineIcon color="action" sx={{ ml: 1, mr: -0.5 }} />
                        {params.InputProps.startAdornment}
                      </>
                    ),
                  }}
                />
              )}
            />
            
            <Button
              variant="contained"
              color="primary"
              onClick={handleFetchExpenses}
              sx={{ 
                minWidth: { xs: "100%", sm: "160px" },
                borderRadius: 2,
                py: 1.5,
                fontWeight: 600,
                boxShadow: 2
              }}
              startIcon={<SearchIcon />}
            >
              Find Expenses
            </Button>
          </Box>
          
          {error && (
            <Typography 
              color="error" 
              sx={{ 
                mt: 2, 
                p: 1.5, 
                bgcolor: "error.light", 
                color: "error.dark",
                borderRadius: 1,
                fontWeight: 500,
                opacity: 0.9
              }}
            >
              {error}
            </Typography>
          )}

          {balanceWithFriend && (
            <Card 
              sx={{ 
                mt: 4, 
                mb: 4, 
                borderRadius: 2,
                overflow: "hidden",
                boxShadow: "0 4px 12px rgba(0,0,0,0.08)"
              }}
            >
              <Box sx={{ bgcolor: "primary.main", p: 2, color: "white" }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Balance with {selectedFriend.username}
                </Typography>
              </Box>
              <CardContent sx={{ p: 3 }}>
                <Grid container spacing={3} alignItems="center">
                  <Grid item xs={12} textAlign="center">
                    <Typography 
                      variant="h4" 
                      sx={{ 
                        fontWeight: 700,
                        color: balanceWithFriend.total_balance >= 0 ? 'success.main' : 'error.main',
                        mb: 2
                      }}
                    >
                      ${balanceWithFriend.total_balance}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                      Net Balance
                    </Typography>
                    <Divider />
                  </Grid>
                  
                  <Grid item xs={6}>
                    <Box 
                      sx={{ 
                        p: 2, 
                        borderRadius: 2, 
                        bgcolor: "success.light",
                        textAlign: "center"
                      }}
                    >
                      <Typography variant="body2" color="success.dark">They owe you</Typography>
                      <Typography variant="h6" color="success.dark" sx={{ fontWeight: 600 }}>
                        ${balanceWithFriend.total_due_to_user}
                      </Typography>
                    </Box>
                  </Grid>
                  
                  <Grid item xs={6}>
                    <Box 
                      sx={{ 
                        p: 2, 
                        borderRadius: 2, 
                        bgcolor: "error.light",
                        textAlign: "center"
                      }}
                    >
                      <Typography variant="body2" color="error.dark">You owe them</Typography>
                      <Typography variant="h6" color="error.dark" sx={{ fontWeight: 600 }}>
                        ${balanceWithFriend.total_user_owes}
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          )}

          {expenses.length > 0 ? (
            <>
              <Typography variant="h6" sx={{ mt: 4, mb: 2, fontWeight: 500 }}>
                Expense History
              </Typography>
              <List>
                {expenses.map((expense) => renderExpenseDetails(expense))}
              </List>
            </>
          ) : hasSearched && selectedFriend ? (
            <Box 
              sx={{ 
                textAlign: "center", 
                py: 6, 
                px: 2,
                mt: 4,
                bgcolor: "rgba(0,0,0,0.02)",
                borderRadius: 2
              }}
            >
              <Typography variant="body1" color="text.secondary">
                No expenses found with this friend.
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Try selecting a different friend or creating a new expense.
              </Typography>
            </Box>
          ) : null}
        </Paper>
      </Container>
    </>
  );
};

export default FriendExpenses;