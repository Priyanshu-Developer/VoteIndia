"use client"

import AdminLayout from "@/components/admin/base/AdminLayout";
import { Box, Button, Card, Checkbox, Radio, Typography } from "@mui/material";
import * as React from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import AddIcon from '@mui/icons-material/Add';
import Paper from '@mui/material/Paper';
import DeleteIcon from '@mui/icons-material/Delete';
import ModeEditIcon from '@mui/icons-material/ModeEdit';


const dummyData = Array.from({ length: 30 }, (_, index) => ({
  id: index + 1,
  name: `User ${index + 1}`,
  image: `https://i.pravatar.cc/40?img=${(index % 70) + 1}`, // Random avatar from 1-70
  email: `user${index + 1}@example.com`, // Assigns different states
}));


const columns: GridColDef[] = [
  { field: 'id', headerName: 'ID', width: 90},
  { field: 'name', headerName: 'Name', width: 400 },
  { field: 'image', headerName: 'Image', width: 300 ,renderCell: (params) => (<img src={params.value} alt="Avatar" style={{ width: 40, height: 40, borderRadius: "50%" }}/>), },
  { field: 'email', headerName: 'Email', width: 400 },
  { field: 'isadmin', headerName: 'IsAdmin', width: 100,renderCell : () => (<Checkbox color="success"  />) },
  { field: 'edit', headerName: 'Edit', width: 100, renderCell : () => (<Button startIcon={<ModeEditIcon />} color="primary" size="large"></Button>) },
  { field: 'delete', headerName: 'Delete', width: 100, renderCell : () => (<Button startIcon={<DeleteIcon/>} color="error"  size="large"></Button>) },
  
];

const paginationModel = { page: 0, pageSize: 15 };

const  Admin = () => {
  return (
    <AdminLayout>
       <Box  p="1rem" gap="1rem" position="relative">
        <Box flexGrow={1} >
          <Box sx={{display:'flex',justifyContent:"space-between"}}>
              <Box>
                <Typography variant="h5" fontWeight={600} gutterBottom>Admin</Typography>
                <Typography variant="subtitle1" >Manage all Admins From here.</Typography>
              </Box>
              <Button variant="contained" sx={{height:40,fontWeight:800}} endIcon={<AddIcon/>} >Add Admin</Button>
          </Box>
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
        </Box>
        <Box height="100%" width="100%" zIndex={100}  bgcolor="rgba(0, 0, 0, 0.3)" position={"absolute"} display="flex"  sx={{ backdropFilter: "blur(10px)" }}  justifyContent="center" alignItems="center" top={0}>
                <Card sx={{bgcolor:"black", height:800,width:800}}>

                </Card>
          </Box>
        
      </Box>
    </AdminLayout>
  )
}

export default  Admin;
