"use client"

import AdminLayout from "@/components/admin/base/AdminLayout";
import { Box, Typography } from "@mui/material";
import * as React from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';


const dummyData = Array.from({ length: 30 }, (_, index) => ({
  id: index + 1,
  name: `User ${index + 1}`,
  walletaddress: `0x${Math.random().toString(35).substring(2, 42)}`, // Random wallet address
  image: `https://i.pravatar.cc/40?img=${(index % 70) + 1}`, // Random avatar from 1-70
  email: `user${index + 1}@example.com`,
  state: [
    "California", "Texas", "New York", "Florida", "Illinois", "Nevada", "Oregon",
    "Washington", "Arizona", "Colorado", "Georgia", "Ohio", "Michigan", "Virginia",
    "Massachusetts", "North Carolina", "Pennsylvania", "Tennessee", "Indiana",
    "Missouri", "Maryland", "Minnesota", "Wisconsin", "South Carolina", "Alabama",
    "Kentucky", "Louisiana", "Oklahoma", "Iowa", "Arkansas"
  ][index], // Assigns different states
}));


const columns: GridColDef[] = [
  { field: 'id', headerName: 'ID', width: 90 },
  { field: 'name', headerName: 'Name', width: 300 },
  { field: 'walletaddress', headerName: 'Wallet Address', width: 400 },
  { field: 'image', headerName: 'Image', width: 300 },
  { field: 'email', headerName: 'Email', width: 340 },
  { field: 'state', headerName: 'State', width: 160 },
  { field: 'voted', headerName: 'Voted', width: 100 },
  
];


const columns2 = [
  { key: "id", label: "ID" },
  { key: "name", label: "Name" },
  { key: "walletaddress", label: "Wallet Address" },
  { key: "image", label: "Image" },
  { key: "email", label: "Email" },
  { key: "state", label: "State" },
];

const paginationModel = { page: 0, pageSize: 15 };

const  User = () => {
  return (
    <AdminLayout>
       <div className="flex  p-4 gap-4">
        <div className="flex-grow ">
          <Typography variant="h5" fontWeight={600} gutterBottom>Voters</Typography>
          <Typography variant="subtitle1" >Manage all users from here.</Typography>

          <Box sx={{py:3}} >
              <Paper sx={{ height: 780, width: '100%' }}>
                  <DataGrid
                    rows={dummyData}
                    columns={columns}
                    initialState={{ pagination: { paginationModel } }}
                    pageSizeOptions={[15, 20]}
                    sx={{ border: 0 }}
                  />
                </Paper>
          </Box>
          
          
        
          
        </div>
        
      </div>
    </AdminLayout>
  )
}

export default  User;
