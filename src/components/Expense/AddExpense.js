import React, { useState, useEffect } from "react";
import {
  Container,
  TextField,
  Button,
  Typography,
  Paper,
  Checkbox,
  FormControlLabel,
  IconButton,
  Autocomplete,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Box,
  Divider,
  Chip,
  Alert,
  Stepper,
  Step,
  StepLabel,
  Grid,
  Avatar,
  Card,
  CardContent,
  InputAdornment,
} from "@mui/material";
import {
  Add as AddIcon,
  Remove as RemoveIcon,
  Description,
  AttachMoney,
  Receipt,
  ShoppingCart,
  CheckCircle,
  Save,
  PeopleAlt,
} from "@mui/icons-material";
import API from "../../api";
import NavigationBar from "../NavigationBar";

const ExpenseForm = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    total_amount: "",
    tax_amount: "",
  });
  const [items, setItems] = useState([
    { name: "", amount: "", is_shared: true, assigned_to_id: "" },
  ]);
  const [users, setUsers] = useState([]);
  const [selectedParticipants, setSelectedParticipants] = useState([]);
  const [message, setMessage] = useState("");
  const [activeStep, setActiveStep] = useState(0);

  const steps = ['Basic Information', 'Participants', 'Items Breakdown'];

  const validateItemsTotal = () => {
    const itemsTotal = items.reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0);
    const totalAmount = parseFloat(formData.total_amount) || 0;
    
    if (Math.abs(itemsTotal - totalAmount) > 0.01) { // Allow small rounding differences
      return `Items total (${itemsTotal.toFixed(2)}) must equal the expense total (${totalAmount.toFixed(2)})`;
    }
    return null;
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await API.get("/users/");
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching users", error);
      }
    };
    fetchUsers();
  }, []);

  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleItemChange = (index, e) => {
    const newItems = [...items];
    newItems[index][e.target.name] =
      e.target.name === "is_shared" ? e.target.checked : e.target.value;
    setItems(newItems);
  };

  const addItem = () => {
    setItems([
      ...items,
      { name: "", amount: "", is_shared: true, assigned_to_id: "" },
    ]);
  };

  const removeItem = (index) => {
    const newItems = items.filter((_, idx) => idx !== index);
    setItems(newItems);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(""); 
    const validationError = validateItemsTotal();
    if (validationError) {
      setMessage(validationError);
      return;
    }
    const currentUser = JSON.parse(localStorage.getItem("user"));
  
    const participantsArray = selectedParticipants.map((user) => user.id);
    if (!participantsArray.includes(currentUser.id)) {
      participantsArray.push(currentUser.id);
    }
  
    const expenseData = {
      ...formData,
      total_amount: parseFloat(formData.total_amount),
      tax_amount: parseFloat(formData.tax_amount) || 0,
      participants: participantsArray,
      items: items.map((item) => ({
        name: item.name,
        amount: parseFloat(item.amount),
        is_shared: item.is_shared,
        ...(item.is_shared
          ? {}
          : { assigned_to_id: item.assigned_to_id ? parseInt(item.assigned_to_id, 10) : null }),
      })),
    };
  
    try {
      await API.post("/expenses/", expenseData);
      setMessage("Expense added successfully.");
      setFormData({
        title: "",
        description: "",
        total_amount: "",
        tax_amount: "",
      });
      setItems([{ name: "", amount: "", is_shared: true, assigned_to_id: "" }]);
      setSelectedParticipants([]);
      setActiveStep(0);
    } catch (error) {
      console.error("Error adding expense", error.response?.data);
      setMessage(
        error.response?.data?.error || 
        "Failed to add expense. Please check your input."
      );
    }
  };

  const handleNext = () => {
    if (activeStep === 2) {
      const validationError = validateItemsTotal();
      if (validationError) {
        setMessage(validationError);
        return;
      }
    }
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Box className="p-4">
            <Typography variant="h6" className="mb-4 flex items-center gap-2">
              <Description className="text-indigo-600" /> Basic Information
            </Typography>
            <TextField
              label="Title"
              name="title"
              fullWidth
              margin="normal"
              value={formData.title}
              onChange={handleFormChange}
              variant="outlined"
              className="mb-4"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Receipt className="text-gray-500" />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              label="Description"
              name="description"
              fullWidth
              margin="normal"
              value={formData.description}
              onChange={handleFormChange}
              variant="outlined"
              multiline
              rows={3}
              className="mb-4"
            />
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Total Amount"
                  name="total_amount"
                  type="number"
                  fullWidth
                  margin="normal"
                  value={formData.total_amount}
                  onChange={handleFormChange}
                  variant="outlined"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <AttachMoney className="text-gray-500" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Tax Amount"
                  name="tax_amount"
                  type="number"
                  fullWidth
                  margin="normal"
                  value={formData.tax_amount}
                  onChange={handleFormChange}
                  variant="outlined"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <AttachMoney className="text-gray-500" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
            </Grid>
          </Box>
        );
      case 1:
        return (
          <Box className="p-4">
            <Typography variant="h6" className="mb-4 flex items-center gap-2">
              <PeopleAlt className="text-indigo-600" /> Select Participants
            </Typography>
            <Autocomplete
              multiple
              options={users.filter((user) => {
                const currentUser = JSON.parse(localStorage.getItem("user"));
                return user.id !== currentUser.id;
              })}
              getOptionLabel={(option) => option.username}
              value={selectedParticipants}
              onChange={(event, newValue) => setSelectedParticipants(newValue)}
              renderInput={(params) => (
                <TextField 
                  {...params} 
                  label="Select Participants" 
                  margin="normal"
                  variant="outlined"
                  placeholder="Add people to split this expense with"
                />
              )}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                  <Chip
                    avatar={<Avatar>{option.username.charAt(0).toUpperCase()}</Avatar>}
                    label={option.username}
                    {...getTagProps({ index })}
                    color="primary"
                    variant="outlined"
                  />
                ))
              }
              sx={{ mt: 2 }}
            />
            <Box className="mt-6 bg-gray-50 p-4 rounded-lg">
              <Typography variant="body2" className="text-gray-600 mb-2">
                Selected Participants:
              </Typography>
              {selectedParticipants.length > 0 ? (
                <Box className="flex flex-wrap gap-2">
                  {selectedParticipants.map((participant) => (
                    <Chip
                      key={participant.id}
                      avatar={<Avatar>{participant.username.charAt(0).toUpperCase()}</Avatar>}
                      label={participant.username}
                      color="primary"
                    />
                  ))}
                  <Chip
                    avatar={<Avatar>{JSON.parse(localStorage.getItem("user")).username.charAt(0).toUpperCase()}</Avatar>}
                    label={`${JSON.parse(localStorage.getItem("user")).username} (You)`}
                    color="secondary"
                  />
                </Box>
              ) : (
                <Typography variant="body2" className="text-gray-500">
                  No participants selected yet. The expense will be assigned to you only.
                </Typography>
              )}
            </Box>
          </Box>
        );
      case 2:
        const itemsTotal = items.reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0);
        const totalAmount = parseFloat(formData.total_amount) || 0;
        const difference = totalAmount - itemsTotal;
        return (
          <Box className="p-4">
            <Typography variant="h6" className="mb-4 flex items-center gap-2">
              <ShoppingCart className="text-indigo-600" /> Expense Items
            </Typography>
      
          <Box className="mb-4 p-3 bg-blue-50 rounded-lg">
            <Typography variant="subtitle2" className="font-medium">
              Total Amount: ${totalAmount.toFixed(2)}
            </Typography>
            <Typography variant="subtitle2" className="font-medium">
              Items Total: ${itemsTotal.toFixed(2)}
            </Typography>
            <Typography 
              variant="subtitle2" 
              className={`font-medium ${Math.abs(difference) > 0.01 ? 'text-red-600' : 'text-green-600'}`}
            >
              {Math.abs(difference) > 0.01 ? 
                `Difference: $${difference.toFixed(2)} (must be zero)` : 
                "✓ Amounts match"}
            </Typography>
          </Box>
            <Box className="mb-4">
              <Button
                variant="outlined"
                startIcon={<AddIcon />}
                onClick={addItem}
                className="mb-4"
                color="primary"
              >
                Add Item
              </Button>
            </Box>
            {items.map((item, index) => (
              <Card key={index} variant="outlined" className="mb-4">
                <CardContent className="p-4">
                  <Box className="flex justify-between items-center mb-2">
                    <Typography variant="subtitle1" className="font-medium">
                      Item #{index + 1}
                    </Typography>
                    <IconButton onClick={() => removeItem(index)} color="error" size="small">
                      <RemoveIcon />
                    </IconButton>
                  </Box>
                  <Divider className="mb-4" />
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <TextField
                        label="Item Name"
                        name="name"
                        fullWidth
                        margin="normal"
                        value={item.name}
                        onChange={(e) => handleItemChange(index, e)}
                        variant="outlined"
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        label="Amount"
                        name="amount"
                        type="number"
                        fullWidth
                        margin="normal"
                        value={item.amount}
                        onChange={(e) => handleItemChange(index, e)}
                        variant="outlined"
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <AttachMoney className="text-gray-500" />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>
                  </Grid>
                  <Box className="mt-2 p-3 bg-gray-50 rounded-lg">
                    <FormControlLabel
                      control={
                        <Checkbox
                          name="is_shared"
                          checked={item.is_shared}
                          onChange={(e) => handleItemChange(index, e)}
                          color="primary"
                        />
                      }
                      label={
                        <Typography variant="body2" className="flex items-center gap-1">
                          <PeopleAlt fontSize="small" className="text-indigo-600" /> 
                          Split equally among all participants
                        </Typography>
                      }
                    />
                    {!item.is_shared && (
                      <FormControl fullWidth margin="normal">
                        <InputLabel id={`assigned-to-label-${index}`}>Assigned To</InputLabel>
                        <Select
                          labelId={`assigned-to-label-${index}`}
                          value={item.assigned_to_id || ""}
                          label="Assigned To"
                          onChange={(e) =>
                            handleItemChange(index, {
                              target: { name: "assigned_to_id", value: e.target.value },
                            })
                          }
                        >
                          {selectedParticipants.map((participant) => (
                            <MenuItem key={participant.id} value={participant.id}>
                              <Box className="flex items-center gap-2">
                                <Avatar sx={{ width: 24, height: 24 }}>
                                  {participant.username.charAt(0).toUpperCase()}
                                </Avatar>
                                {participant.username}
                              </Box>
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    )}
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Box>
        );
      default:
        return "Unknown step";
    }
  };

  return (
    <>
      <NavigationBar />
      <Container maxWidth="md" sx={{ mt: 4, mb: 6 }}>
        <Paper elevation={3} className="rounded-lg overflow-hidden">
          <Box className="bg-gradient-to-r from-indigo-600 to-blue-600 p-4 text-white">
            <Typography variant="h4" className="font-bold">
              Add New Expense
            </Typography>
            <Typography variant="body1">
              Track and split expenses with your friends
            </Typography>
          </Box>

          {message && (
            <Alert 
              severity={message.includes("success") ? "success" : "error"}
              sx={{ m: 2 }}
              onClose={() => setMessage("")}
            >
              {message}
            </Alert>
          )}

          <Box className="p-4">
            <Stepper activeStep={activeStep} alternativeLabel className="mb-6">
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
            
            <form onSubmit={activeStep === steps.length - 1 ? handleSubmit : (e) => e.preventDefault()}>
              {getStepContent(activeStep)}
              
              <Box className="flex justify-between mt-6 p-4 bg-gray-50">
                <Button
                  disabled={activeStep === 0}
                  onClick={handleBack}
                  variant="outlined"
                >
                  Back
                </Button>
                <Box>
                  {activeStep === steps.length - 1 ? (
                    <Button
                      variant="contained"
                      color="primary"
                      type="submit"
                      endIcon={<Save />}
                      className="px-6 py-2"
                    >
                      Submit Expense
                    </Button>
                  ) : (
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleNext}
                      endIcon={<CheckCircle />}
                      className="px-6 py-2"
                    >
                      Continue
                    </Button>
                  )}
                </Box>
              </Box>
            </form>
          </Box>
        </Paper>
      </Container>
    </>
  );
};

export default ExpenseForm;