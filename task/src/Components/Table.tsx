import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import Alert from '@mui/material/Alert';
import { RootState } from '../Redux/rootReducer';
import { addUser, editUser, deleteUser } from '../Redux/userSlice';
import apiConfig from '../Service/apiService';

interface Unicorn {
  _id: string; // Change '_id' to '_id'
  name: string;
  age: number;
  colour: string;
}


const MyTable: React.FC = () => {
  const dispatch = useDispatch();
  const [unicorns, setUnicorns] = useState<Unicorn[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [open, setOpen] = useState(false);
  const [newUserData, setNewUserData] = useState<Unicorn>({
    _id: '',
    name: '',
    age: 0,
    colour: '',
  });
  const [selectedUser, setSelectedUser] = useState<Unicorn | null>(null);
  const [nameError, setNameError] = useState('');
  const [ageError, setAgeError] = useState('');
  const [colourError, setColourError] = useState('');

  useEffect(() => {
    const fetchUnicorns = async () => {
      try {
        const response = await apiConfig.get('/unicorns');
        const data = response.data;
    
        // Transform the data to match the expected format
        const transformedData = data.map((unicorn: any) => ({
          _id: unicorn._id, // Use the `_id` field from the response as the `_id`
          name: unicorn.name,
          age: unicorn.age,
          colour: unicorn.colour
        }));
    
        setUnicorns(transformedData); // Set the transformed data to the component state
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchUnicorns();
  }, []);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };
  
  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };



  
  
  const handleDelete = (row: Unicorn) => {
    const confirmed = window.confirm('Are you sure you want to delete this unicorn?');

    if (confirmed) {
      dispatch(deleteUser(row));
    } else {
      console.log('Delete canceled');
    }
  };

  const handleAddUser = () => {
    setSelectedUser(null);
    setNewUserData({
      _id: '',
      name: '',
      age: 0,
      colour: '',
    });
    setOpen(true);
  };

  const handleDialogClose = () => {
    setOpen(false);
    setSelectedUser(null);
    setNewUserData({
      _id: '',
      name: '',
      age: 0,
      colour: '',
    });
    setNameError('');
    setAgeError('');
    setColourError('');
  };

  const handleSaveUser = () => {
    // Perform input validations
    let isValid = true;
  
    if (!newUserData.name) {
      setNameError('Please enter a name');
      isValid = false;
    } else {
      setNameError('');
    }
  
    if (newUserData.age <= 0) {
      setAgeError('Please enter a valid age');
      isValid = false;
    } else {
      setAgeError('');
    }
  
    if (!newUserData.colour) {
      setColourError('Please enter a colour');
      isValid = false;
    } else {
      setColourError('');
    }
  
    if (isValid) {
      if (selectedUser) {
        // Update existing unicorn using the API endpoint
        apiConfig
          .put(`/unicorns/${selectedUser._id}`, newUserData)
          .then((response) => {
            // Handle successful response
            const updatedUnicorn = response.data;
            console.log('Unicorn updated:', updatedUnicorn);
            dispatch(editUser({ _id: selectedUser._id, user: updatedUnicorn }));
            setOpen(false);
          })
          .catch((error) => {
            // Handle error
            console.error('Error updating unicorn:', error);
          });
      } else {
        // Create a new unicorn using the API endpoint
        apiConfig
          .post('/unicorns', { ...newUserData, _id: '' }) // Send a request without _id
          .then((response) => {
            // Handle successful response
            const createdUnicorn = response.data;
            console.log('New unicorn saved:', createdUnicorn);
            dispatch(addUser(createdUnicorn)); // Assuming the response contains the newly created unicorn
            setOpen(false);
          })
          .catch((error) => {
            // Handle error
            console.error('Error saving new unicorn:', error);
          });
      }
    }
  };
  
  const handleEdit = (row: Unicorn) => {
    // Retrieve the unicorn data by _id using the API endpoint
    apiConfig
      .get(`/unicorns/${row._id}`)
      .then((response) => {
        // Handle successful response
        const unicornData = response.data;
        
        setSelectedUser(unicornData);
        setNewUserData({
          ...unicornData,
          _id: unicornData._id // Bind the selected user's _id to the newUserData
        });
        setOpen(true);
      })
      .catch((error) => {
        // Handle error
        console.error('Error fetching unicorn data:', error);
      });
  };
  

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    setNewUserData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const columns = [
    { _id: 'name', label: 'Name' },
    { _id: 'age', label: 'Age' },
    { _id: 'colour', label: 'Colour' },
    {
      label: 'Actions',
      render: (row: Unicorn) => (
        <>
          <Button variant="contained" color="primary" onClick={() => handleEdit(row)}>
            Edit
          </Button>
          <Button
            variant="contained"
            color="secondary"
            sx={{ bgcolor: 'red', marginLeft: '10px' }}
            onClick={() => handleDelete(row)}
          >
            Delete
          </Button>
        </>
      ),
    },
  ];

  return (
    <>
      <div style={{ textAlign: 'end', marginRight: '2%' }}>
        <Button variant="contained" color="primary" sx={{ bgcolor: 'green' }} onClick={handleAddUser}>
          Add Unicorn
        </Button>
      </div>

      <TableContainer style={{ marginTop: '1%' }}>
        <Table stickyHeader aria-label="Unicorn Table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell key={column._id}>{column.label}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {unicorns
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row: Unicorn) => (
                <TableRow key={row._id}>
                  {columns.map((column) => (
                    <TableCell key={column._id}>
                      {column.render ? column.render(row) : row[column._id as keyof Unicorn]}

                {/* <h1> {row._id}</h1>      */}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
          </TableBody>
        </Table>
      <TablePagination
  rowsPerPageOptions={[5, 10, 25]}
  component="div"
  count={unicorns.length}
  rowsPerPage={rowsPerPage}
  page={page}
  onPageChange={handleChangePage}
  onRowsPerPageChange={handleChangeRowsPerPage}
/>
      </TableContainer>

      <Dialog open={open} onClose={handleDialogClose}>
        <DialogTitle>{selectedUser ? 'Edit Unicorn' : 'Add Unicorn'}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Name"
                name="name"
                value={newUserData.name}
                onChange={handleInputChange}
                fullWidth
                error={!!nameError}
                helperText={nameError}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Age"
                name="age"
                type="number"
                value={newUserData.age}
                onChange={handleInputChange}
                fullWidth
                error={!!ageError}
                helperText={ageError}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Colour"
                name="colour"
                value={newUserData.colour}
                onChange={handleInputChange}
                fullWidth
                error={!!colourError}
                helperText={colourError}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Cancel</Button>
          <Button onClick={handleSaveUser} variant="contained" color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default MyTable;
