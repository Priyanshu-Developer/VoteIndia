"use client"

import AdminLayout from "@/components/admin/base/AdminLayout";
import { Box, Button, Card, CardContent, CardHeader, CardMedia,  IconButton,  TextField, Typography } from "@mui/material";
import * as React from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import AddIcon from '@mui/icons-material/Add';
import Paper from '@mui/material/Paper';
import CloseIcon from '@mui/icons-material/Close';
import { param } from "framer-motion/client";


const paginationModel = { page: 0, pageSize: 15 };

const  NationalParty = () => {

  const [openDialog,setOpenDialog] = React.useState<boolean>(false);
  const [name, setName] = React.useState<string>("");
  const [symbol, setSymbol] = React.useState<string>("");
  const [image, setImage] = React.useState<string>("");
  const [logo, setlogo] = React.useState<File | string >("");
  const [error,setError] = React.useState<string>("");
  const [data,setData] = React.useState([]);
  

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 90},
    { field: 'name', headerName: 'Party Name', width: 400 },
    { field: 'logo', headerName: 'Party Logo', width: 300 ,renderCell: (params) => (<img src={`${process.env.NEXT_PUBLIC_IPFS_URL}/${params.value}`} alt="Avatar" style={{ width: 40, height: 40, borderRadius: "50%" }}/>), },
    { field: 'symbol', headerName: 'Party Symbol', width: 200 },
    { field: 'registered_time', headerName: 'Registered Date', width: 400 },
  ];

  const getdata = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/national-party/get-all`)
      if(!res.ok){
        setData([])
      }
      else{
        const data = await res.json()
        setData(data)
      }
    } catch (error) {
    }
  } 
  React.useEffect(() => {getdata()},[])
  const addNationalParty = async (e: React.MouseEvent<HTMLButtonElement>) => {
    console.log("fmd")
    e.preventDefault()
    const formdata = new FormData();

    if (name === ""){
      setError("please add  name")
    }
    else if(symbol === ""){
      setError("please add  symbol")
    }
    else if (!logo) {
      setError("please add image")
    }
    else{

      formdata.append("name",name);
      formdata.append("symbol",symbol);
      formdata.append("logo",logo);
      console.log(logo)
    }
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/national-party/register`, {
      method: 'POST',
      body:formdata

    });
    if (response.ok){
      setOpenDialog(false)
      getdata()
      
    }
  } 
  return (
    <AdminLayout>
       <Box  p="1rem" gap="1rem" position="relative">
        <Box flexGrow={1} >
          <Box sx={{display:'flex',justifyContent:"space-between"}}>
              <Box>
                <Typography variant="h5" fontWeight={600} gutterBottom>National Party</Typography>
                <Typography variant="subtitle1" >Manage all National Paty From here.</Typography>
              </Box>
              <Button variant="contained" sx={{height:40,fontWeight:800}} onClick={() => {setOpenDialog(true)}} endIcon={<AddIcon/>} >Add Party</Button>
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
        <Card variant="outlined" sx={{ height:800,width:500}}>
          <CardHeader title="National Party Details" sx={{textAlign:"center"}} action={<IconButton aria-label="settings" onClick={() => {setOpenDialog(false)}}> <CloseIcon /> </IconButton>}/>
          <Typography color="danger">{error}</Typography>
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",mt:3}}>
            <label htmlFor="upload-image">
              <CardMedia component="img" width={"100%"} sx={{ borderRadius: "50%", height: 150, width: 150, cursor: "pointer" }} image={image || "/user.png"}   alt="Upload Image"/>
            </label>
            <input id="upload-image" type="file" accept="image/*" style={{ display: "none" }} onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  setlogo(file)
                  const imageUrl = URL.createObjectURL(file); // Creates a temporary URL for preview
                  setImage(imageUrl);
                }
              }}/>
            
          </Box>
          <CardContent sx={{display:"flex" ,flexDirection:"column",gap:4,mt:4}}>
            <TextField id="name" label="Name"  fullWidth variant="outlined" value={name} onChange={(e) => setName(e.target.value)} />
            <TextField id="email" label="Symbol" fullWidth variant="outlined" value={symbol} onChange={(e) => setSymbol(e.target.value)} />
            <Button variant="contained" sx={{mt:2}} onClick={addNationalParty}>Submit</Button>
          </CardContent>
        </Card>
        </Box>: ""}
    </Box>
    </AdminLayout>
  )
}

export default  NationalParty;
