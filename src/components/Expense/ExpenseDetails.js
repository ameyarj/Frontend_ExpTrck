import React from 'react';
import { Paper, Typography, Box, Chip, Divider, Avatar, Grid } from '@mui/material';
import { 
  Description, 
  Receipt, 
  ShoppingCart, 
  Person, 
  CheckCircle, 
  PendingActions, 
  PriceCheck,
  AttachMoney
} from '@mui/icons-material';

export const ExpenseDetails = ({ expense }) => {
  return (
    <Paper elevation={3} className="rounded-xl overflow-hidden bg-white">
      {/* Header */}
      <Box className="bg-gradient-to-r from-purple-600 to-indigo-600 p-4 text-white">
        <Typography variant="h5" className="font-bold flex items-center gap-2">
          <Receipt /> {expense.title}
        </Typography>
        <Typography variant="body2" className="mt-1 flex items-center gap-1">
          <Description fontSize="small" /> {expense.description}
        </Typography>
      </Box>
      
      {/* Amount Summary */}
      <Box className="p-4 bg-gray-50">
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Box className="flex items-center gap-2">
              <AttachMoney className="text-green-600" />
              <div>
                <Typography variant="body2" className="text-gray-500">Total Amount</Typography>
                <Typography variant="h6" className="font-bold text-gray-800">${expense.total_amount}</Typography>
              </div>
            </Box>
          </Grid>
          <Grid item xs={6}>
            <Box className="flex items-center gap-2">
              <PriceCheck className="text-blue-600" />
              <div>
                <Typography variant="body2" className="text-gray-500">Tax Amount</Typography>
                <Typography variant="h6" className="font-bold text-gray-800">${expense.tax_amount}</Typography>
              </div>
            </Box>
          </Grid>
        </Grid>
      </Box>
      
      <Divider />
      
      {/* Items Section */}
      <Box className="p-4">
        <Typography variant="subtitle1" className="font-bold mb-3 flex items-center gap-2">
          <ShoppingCart className="text-purple-600" /> Items
        </Typography>
        
        {expense.items.map(item => (
          <Box key={item.id} className="mb-3 p-3 bg-gray-50 rounded-lg">
            <Box className="flex justify-between items-center">
              <Typography variant="body1" className="font-medium">{item.name}</Typography>
              <Typography variant="body1" className="font-bold text-gray-800">${item.amount}</Typography>
            </Box>
            
            <Box className="mt-2">
              {item.is_shared ? (
                <Chip 
                  size="small" 
                  label="Shared equally" 
                  color="info" 
                  variant="outlined"
                  className="text-xs"
                />
              ) : (
                <Box className="flex items-center gap-1">
                  <Avatar 
                    sx={{ width: 24, height: 24, bgcolor: 'indigo.600', fontSize: '0.75rem' }}
                  >
                    {item.assigned_to.username.charAt(0).toUpperCase()}
                  </Avatar>
                  <Typography variant="body2" className="text-gray-600">
                    Assigned to {item.assigned_to.username}
                  </Typography>
                </Box>
              )}
            </Box>
          </Box>
        ))}
      </Box>
      
      <Divider />
      
      {/* Shares Section */}
      <Box className="p-4">
        <Typography variant="subtitle1" className="font-bold mb-3 flex items-center gap-2">
          <Person className="text-indigo-600" /> Shares
        </Typography>
        
        <Grid container spacing={2}>
          {expense.shares.map(share => (
            <Grid item xs={12} sm={6} key={share.id}>
              <Box className="p-3 bg-gray-50 rounded-lg">
                <Box className="flex justify-between items-center">
                  <Box className="flex items-center gap-2">
                    <Avatar 
                      sx={{ width: 28, height: 28, bgcolor: 'purple.600', fontSize: '0.875rem' }}
                    >
                      {share.participant.username.charAt(0).toUpperCase()}
                    </Avatar>
                    <Typography variant="body1" className="font-medium">
                      {share.participant.username}
                    </Typography>
                  </Box>
                  <Typography variant="body1" className="font-bold text-gray-800">
                    ${share.amount}
                  </Typography>
                </Box>
                
                <Box className="mt-2 flex gap-2">
                  <Chip 
                    size="small" 
                    label={share.paid_by ? "Paid" : "Owes"}
                    color={share.paid_by ? "success" : "warning"}
                    variant="outlined"
                    className="text-xs"
                  />
                  
                  <Chip 
                    size="small" 
                    icon={share.settled ? <CheckCircle fontSize="small" /> : <PendingActions fontSize="small" />}
                    label={share.settled ? "Settled" : "Pending"}
                    color={share.settled ? "success" : "default"}
                    variant="outlined"
                    className="text-xs"
                  />
                </Box>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Paper>
  );
};