"use client"

import AdminLayout from "@/components/admin/base/AdminLayout";
import { Box, Button, Card, CardContent, CardHeader, CardMedia,  IconButton,  TextField, Typography } from "@mui/material";
import * as React from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import AddIcon from '@mui/icons-material/Add';
import Paper from '@mui/material/Paper';
import CloseIcon from '@mui/icons-material/Close';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import { useRouter } from "next/navigation";


const paginationModel = { page: 0, pageSize: 15 };

const  NationalElection = () => {

  const [openDialog,setOpenDialog] = React.useState<boolean>(false);
  const [contractaddress,setContractAddress] = React.useState<string>("");
  const router = useRouter();

  const [data,setData] = React.useState([
    { id: 1, electionYear: "2023", contarctAddress: "0x1234567890abcdef1234567890abcdef12345678",state:"Maharashtra"},
    { id: 2, electionYear: "2024", contarctAddress: "0xabcdef1234567890abcdef1234567890abcdef12",state:"Uttar prdesh"},
    { id: 3, electionYear: "2025", contarctAddress: "0x7890abcdef1234567890abcdef12345678901234",state:"Gujrat"},
    { id: 4, electionYear: "2026", contarctAddress: "0x567890abcdef1234567890abcdef123456789012",state:"Jharkhnad"},
  ]);

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 90},
    { field: 'electionYear', headerName: 'Election Year', width: 150 },
    { field: 'state', headerName: 'State', width: 200 },
    { field: 'contarctAddress', headerName: 'Contarct Address', width: 500  },
    { field: 'electedParty', headerName: 'ElectedParty', width: 200 ,renderCell: (params) => (<img src={`${process.env.NEXT_PUBLIC_API_URL}/${params.value}}`} alt="Avatar" style={{ width: 40, height: 40, borderRadius: "50%" }}/>), },
    { field: 'electedCandidateName', headerName: 'Elected Candidate Name', width: 400  },
    { field: 'electedCandidate', headerName: 'ElectedCandidate', width: 200 ,renderCell: (params) => (<img src={`${process.env.NEXT_PUBLIC_API_URL}/${params.value}}`} alt="Avatar" style={{ width: 40, height: 40, borderRadius: "50%" }}/>), },
  ];

  const handleClick = () => {
    sessionStorage.setItem("contractAddress",contractaddress);
    router.push("/admin/election/national-election-form")

  }
  return (
    <AdminLayout>
       <Box  p="1rem" gap="1rem" position="relative">
        <Box flexGrow={1} >
          <Box sx={{display:'flex',justifyContent:"space-between"}}>
              <Box>
                <Typography variant="h5" fontWeight={600} gutterBottom>National Elections</Typography>
                <Typography variant="subtitle1" >Manage all National Election From here.</Typography>
              </Box>
              <Button variant="contained" sx={{height:40,fontWeight:800}} onClick={() => {setOpenDialog(true)}} endIcon={<AddIcon/>} >Create New National Election</Button>
          </Box>
          <Box sx={{py:3}} >
              <Paper sx={{ height: 780, width: '100%' }}>
                  <DataGrid
                    rows={data}
                    columns={columns}
                    initialState={{ pagination: { paginationModel } }}
                    pageSizeOptions={[15, 20]}
                    sx={{ border: 0 }}
                  />
                </Paper>
          </Box>
        </Box>
       {openDialog? <Box height="100%" width="100%" zIndex={100}  bgcolor="rgba(0, 0, 0, 0.3)" position={"absolute"} display="flex"  sx={{ backdropFilter: "blur(10px)" }}  justifyContent="center" alignItems="center" top={0}>
               <Card variant="outlined" sx={{ height:400,width:600}}>
                 <CardHeader title="National Party Details" sx={{textAlign:"center"}} action={<IconButton aria-label="settings" onClick={() => {setOpenDialog(false)}}> <CloseIcon /> </IconButton>}/>

                 <CardContent sx={{display:"flex" ,flexDirection:"column", justifyContent:"space-between",gap:4,mt:6}}>
                   <TextField label="National Election Contract Address" variant="outlined" fullWidth onChange={(e) => (setContractAddress(e.target.value))}  />
                   <Button variant="contained" sx={{mt:6}} onClick={handleClick} >Submit</Button>
                 </CardContent>
               </Card>
               </Box>: ""}
    </Box>
    </AdminLayout>
  )
}

export default  NationalElection;
