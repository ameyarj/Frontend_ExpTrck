import React, { useEffect, useState, useCallback } from "react";
import {
  Container,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  Divider,
  Grid,
  Box,
  Avatar,
  Skeleton,
  Chip,
  Card,
  CardContent,
  ListItemAvatar,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import {
  AccountBalance,
  ArrowUpward,
  ArrowDownward,
  AccessTime,
  PeopleAlt,
  Receipt,
  AttachMoney,
  PaymentOutlined,
} from "@mui/icons-material";
import API from "../../api";
import NavigationBar from "../NavigationBar";
import SettleUpForm from "../SettleUpForm";

const Dashboard = () => {
  const [expenses, setExpenses] = useState([]);
  const [balance, setBalance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [settleModalOpen, setSettleModalOpen] = useState(false);
  const [selectedFriend, setSelectedFriend] = useState(null);

  const fetchBalance = useCallback(async () => {
    try {
      const response = await API.get('/friends/overall_balance/');
      setBalance(response.data);
    } catch (error) {
      console.error("Error fetching balance", error);
      setBalance({
        total_balance: 0,
        total_due_to_user: 0,
        total_user_owes: 0,
        friends_owing_user: [],
        user_owing_friends: [],
      });
    }
  }, []);

  const fetchExpenses = useCallback(async () => {
    try {
      const response = await API.get("/expenses/my_expenses/");
      setExpenses(response.data);
    } catch (error) {
      console.error("Error fetching expenses", error);
    }
  }, []);

  useEffect(() => {
    const loadData = async () => {
      try {
        await fetchBalance();
        await fetchExpenses();
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [fetchBalance, fetchExpenses]);

  const handleSettleUpClick = (friend) => {
    setSelectedFriend({
      id: friend.expense__created_by,
      username: friend.username,
      total: friend.total,
    });
    setSettleModalOpen(true);
  };

  if (loading) {
    return (
      <>
        <NavigationBar />
        <Container sx={{ mt: 6 }}>
          <Skeleton variant="rectangular" height={60} width="40%" />
          <Box sx={{ mt: 4 }}>
            <Skeleton variant="rectangular" height={180} />
          </Box>
          <Grid container spacing={3} sx={{ mt: 2 }}>
            <Grid item xs={12} md={6}>
              <Skeleton variant="rectangular" height={240} />
            </Grid>
            <Grid item xs={12} md={6}>
              <Skeleton variant="rectangular" height={240} />
            </Grid>
          </Grid>
        </Container>
      </>
    );
  }

  return (
    <>
      <NavigationBar />
      <Container sx={{ mt: 4, mb: 6 }}>
        <Typography variant="h4" gutterBottom className="font-bold text-gray-800 mb-6">
          Dashboard
        </Typography>

        {balance && (
          <Grid container spacing={3}>
            {/* Overall Balance Summary */}
            <Grid item xs={12}>
              <Paper 
                elevation={3} 
                sx={{ 
                  p: 3, 
                  borderRadius: 2,
                  background: 'linear-gradient(to right, #f5f7fa, #e4e8f0)',
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)'
                }}
              >
                <Box className="flex items-center gap-3 mb-4">
                  <AccountBalance className="text-indigo-600" fontSize="large" />
                  <Typography variant="h5" className="font-bold text-gray-800">
                    Balance Summary
                  </Typography>
                </Box>
                
                <Box className="flex justify-center mb-4">
                  <Card 
                    elevation={2} 
                    sx={{ 
                      width: '100%', 
                      maxWidth: 500, 
                      borderRadius: 4,
                      backgroundColor: balance.total_balance >= 0 ? 'rgba(46, 125, 50, 0.08)' : 'rgba(211, 47, 47, 0.08)'
                    }}
                  >
                    <CardContent sx={{ py: 3 }}>
                      <Typography variant="h6" className="text-center mb-2 text-gray-600">
                        Your Total Balance
                      </Typography>
                      <Typography 
                        variant="h3" 
                        className="text-center font-bold"
                        color={balance.total_balance >= 0 ? 'success.main' : 'error.main'}
                      >
                        ${Math.abs(balance.total_balance).toFixed(2)}
                        {balance.total_balance >= 0 ? 
                          <span className="text-green-500 ml-2">
                            <ArrowUpward />
                          </span> : 
                          <span className="text-red-500 ml-2">
                            <ArrowDownward />
                          </span>
                        }
                      </Typography>
                      <Typography variant="body1" className="text-center mt-1 text-gray-600">
                        {balance.total_balance >= 0 ? 'Overall, you are owed money' : 'Overall, you owe money'}
                      </Typography>
                    </CardContent>
                  </Card>
                </Box>
                
                <Divider sx={{ my: 3 }} />
                
                <Grid container spacing={4}>
                  <Grid item xs={12} md={6}>
                    <Box className="p-4 rounded-xl bg-white flex items-center">
                      <Avatar sx={{ bgcolor: 'success.light', mr: 2 }}>
                        <AttachMoney />
                      </Avatar>
                      <Box>
                        <Typography variant="body2" className="text-gray-600">
                          Total Due to You
                        </Typography>
                        <Typography variant="h5" color="success.main" className="font-bold">
                          ${balance.total_due_to_user.toFixed(2)}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Box className="p-4 rounded-xl bg-white flex items-center">
                      <Avatar sx={{ bgcolor: 'error.light', mr: 2 }}>
                        <PaymentOutlined />
                      </Avatar>
                      <Box>
                        <Typography variant="body2" className="text-gray-600">
                          Total You Owe
                        </Typography>
                        <Typography variant="h5" color="error.main" className="font-bold">
                          ${balance.total_user_owes.toFixed(2)}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>

            {/* Friends who owe you */}
            <Grid item xs={12} md={6}>
              <Paper elevation={2} sx={{ p: 3, borderRadius: 2, height: '100%' }}>
                <Box className="flex items-center gap-2 mb-4">
                  <ArrowDownward className="text-green-600" />
                  <Typography variant="h6" className="font-bold text-gray-800">
                    Friends Who Owe You
                  </Typography>
                </Box>
                {!balance.friends_owing_user || balance.friends_owing_user.length === 0 ? (
                  <Typography variant="body1" className="text-gray-500 text-center py-4">
                    No friends currently owe you money
                  </Typography>
                ) : (
                  <List>
                    {balance.friends_owing_user.map((friend, index) => (
                      <ListItem key={index} sx={{ 
                        mb: 1, 
                        backgroundColor: 'rgba(46, 125, 50, 0.04)', 
                        borderRadius: 2 
                      }}>
                        <ListItemAvatar>
                          <Avatar sx={{ bgcolor: 'success.main' }}>
                            {friend.username.charAt(0).toUpperCase()}
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={
                            <Typography variant="body1" className="font-medium">
                              {friend.username}
                            </Typography>
                          }
                          secondary={
                            <Chip 
                              label={`Owes you: $${friend.total.toFixed(2)}`}
                              color="success"
                              size="small"
                              sx={{ mt: 0.5 }}
                            />
                          }
                        />
                      </ListItem>
                    ))}
                  </List>
                )}
              </Paper>
            </Grid>

            {/* Friends you owe */}
            <Grid item xs={12} md={6}>
              <Paper elevation={2} sx={{ p: 3, borderRadius: 2, height: '100%' }}>
                <Box className="flex items-center gap-2 mb-4">
                  <ArrowUpward className="text-red-600" />
                  <Typography variant="h6" className="font-bold text-gray-800">
                    Friends You Owe
                  </Typography>
                </Box>
                {!balance.user_owing_friends || balance.user_owing_friends.length === 0 ? (
                  <Typography variant="body1" className="text-gray-500 text-center py-4">
                    You don't owe any friends money
                  </Typography>
                ) : (
                  <List>
                    {balance.user_owing_friends.map((friend, index) => (
                      <ListItem
                        key={index}
                        sx={{
                          mb: 1,
                          backgroundColor: 'rgba(211, 47, 47, 0.04)',
                          borderRadius: 2,
                        }}
                        secondaryAction={
                          <Button
                            variant="contained"
                            color="primary"
                            onClick={() => handleSettleUpClick(friend)}
                          >
                            Settle Up
                          </Button>
                        }
                      >
                        <ListItemAvatar>
                          <Avatar sx={{ bgcolor: 'error.main' }}>
                            {friend.username.charAt(0).toUpperCase()}
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={
                            <Typography variant="body1" className="font-medium">
                              {friend.username}
                            </Typography>
                          }
                          secondary={
                            <Chip
                              label={`You owe: $${friend.total.toFixed(2)}`}
                              color="error"
                              size="small"
                              sx={{ mt: 0.5 }}
                            />
                          }
                        />
                      </ListItem>
                    ))}
                  </List>
                )}
              </Paper>
            </Grid>

            {/* Recent Expenses */}
            <Grid item xs={12}>
              <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
                <Box className="flex items-center gap-2 mb-4">
                  <Receipt className="text-indigo-600" />
                  <Typography variant="h6" className="font-bold text-gray-800">
                    My Recent Expenses
                  </Typography>
                </Box>
                
                {!expenses || expenses.length === 0 ? (
                  <Typography variant="body1" className="text-gray-500 text-center py-4">
                    No expenses found
                  </Typography>
                ) : (
                  <List>
                    {expenses.map((expense) => (
                      <React.Fragment key={expense.id}>
                        <ListItem sx={{ 
                          py: 2, 
                          px: 3, 
                          my: 1, 
                          backgroundColor: 'rgba(63, 81, 181, 0.04)', 
                          borderRadius: 2
                        }}>
                          <Grid container spacing={2}>
                            <Grid item xs={12} md={8}>
                              <Box>
                                <Typography variant="h6" className="font-medium text-gray-800">
                                  {expense.title}
                                </Typography>
                                <Box className="flex gap-2 flex-wrap mt-2">
                                  <Chip 
                                    icon={<AttachMoney fontSize="small" />}
                                    label={`$${expense.total_amount}`}
                                    color="primary"
                                    size="small"
                                    variant="outlined"
                                  />
                                  <Chip 
                                    icon={<AccessTime fontSize="small" />}
                                    label={new Date(expense.created_at).toLocaleDateString()}
                                    color="default"
                                    size="small"
                                    variant="outlined"
                                  />
                                  <Chip 
                                    icon={<PeopleAlt fontSize="small" />}
                                    label={`${expense.shares.length} participants`}
                                    color="secondary"
                                    size="small"
                                    variant="outlined"
                                  />
                                </Box>
                              </Box>
                            </Grid>
                            <Grid item xs={12} md={4}>
                              <Box className="flex flex-wrap gap-1 justify-end">
                                {expense.shares.map(share => (
                                  <Chip 
                                    key={share.id}
                                    label={share.participant.username}
                                    size="small"
                                    sx={{ mt: 1 }}
                                    avatar={<Avatar>{share.participant.username.charAt(0).toUpperCase()}</Avatar>}
                                  />
                                ))}
                              </Box>
                            </Grid>
                          </Grid>
                        </ListItem>
                      </React.Fragment>
                    ))}
                  </List>
                )}
              </Paper>
            </Grid>
          </Grid>
        )}

        {/* Settlement Modal */}
        <Dialog open={settleModalOpen} onClose={() => setSettleModalOpen(false)}>
          <DialogTitle>Settle Up with {selectedFriend?.username}</DialogTitle>
          <DialogContent>
            {selectedFriend && (
              <SettleUpForm
                friend={selectedFriend}
                onSuccess={() => {
                  setSettleModalOpen(false);
                  fetchBalance();
                  fetchExpenses();
                }}
              />
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setSettleModalOpen(false)}>Cancel</Button>
          </DialogActions>
        </Dialog>
      </Container>
    </>
  );
};

export default Dashboard;