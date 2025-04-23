"use client"

import AdminLayout from "@/components/admin/base/AdminLayout";
import { Box, Typography } from "@mui/material";
import * as React from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';


const columns: GridColDef[] = [
  { field: 'id', headerName: 'ID', width: 160 },
  { field: 'username', headerName: 'Name', width: 350 },
  { field: 'wallet_address', headerName: 'Wallet Address', width: 500 },
  { field: 'image', headerName: 'Image', width: 100 ,renderCell: (params) => (<img src={`${process.env.NEXT_PUBLIC_API_URL}/${params.value}`} alt="Avatar" style={{ width: 40, height: 40, borderRadius: "50%" }}/>), },
  { field: 'email', headerName: 'Email', width: 340 },
  { field: 'state', headerName: 'State', width: 160 },
  { field: 'is_voted', headerName: 'Voted', width: 100 },
  
];


const paginationModel = { page: 0, pageSize: 15 };

const  User = () => {

  const [userdata,setUserData] = React.useState([])

  const  fetchdata = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/get-voters`)
      if(!res.ok){
        setUserData([])
      }
      else{
        const data = await res.json()
        setUserData(data)
      }
    } catch (error) {
      
    }
  }

  React.useEffect(() => {fetchdata()},[])
  
  return (
    <AdminLayout>
       <div className="flex  p-4 gap-4">
        <div className="flex-grow ">
          <Typography variant="h5" fontWeight={600} gutterBottom>Voters</Typography>
          <Typography variant="subtitle1" >Manage all users from here.</Typography>

          <Box sx={{py:3}} >
              <Paper sx={{ height: 780, width: '100%' }}>
                  <DataGrid
                    rows={userdata}
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
