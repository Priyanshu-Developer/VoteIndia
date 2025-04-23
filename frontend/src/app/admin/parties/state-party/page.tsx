"use client"

import AdminLayout from "@/components/admin/base/AdminLayout";
import { Box, Button, Card, CardContent, CardHeader, CardMedia,  IconButton,  MenuItem,  TextField, Typography } from "@mui/material";
import * as React from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import AddIcon from '@mui/icons-material/Add';
import Paper from '@mui/material/Paper';
import CloseIcon from '@mui/icons-material/Close';


const states = [
  { value: "Andhra Pradesh", label: "Andhra Pradesh" }, { value: "Arunachal Pradesh", label: "Arunachal Pradesh" },
  { value: "Assam", label: "Assam" }, { value: "Bihar", label: "Bihar" },{ value: "Chhattisgarh", label: "Chhattisgarh" },
  { value: "Goa", label: "Goa" },{ value: "Gujarat", label: "Gujarat" },{ value: "Haryana", label: "Haryana" },
  { value: "Himachal Pradesh", label: "Himachal Pradesh" },{ value: "Jharkhand", label: "Jharkhand" },
  { value: "Karnataka", label: "Karnataka" },{ value: "Kerala", label: "Kerala" },{ value: "Madhya Pradesh", label: "Madhya Pradesh" },
  { value: "Maharashtra", label: "Maharashtra" },{ value: "Manipur", label: "Manipur" },{ value: "Meghalaya", label: "Meghalaya" },
  { value: "Mizoram", label: "Mizoram" },{ value: "Nagaland", label: "Nagaland" },{ value: "Odisha", label: "Odisha" },
  { value: "Punjab", label: "Punjab" },{ value: "Rajasthan", label: "Rajasthan" },{ value: "Sikkim", label: "Sikkim" },
  { value: "Tamil Nadu", label: "Tamil Nadu" },{ value: "Telangana", label: "Telangana" },{ value: "Tripura", label: "Tripura" },
  { value: "Uttar Pradesh", label: "Uttar Pradesh" },{ value: "Uttarakhand", label: "Uttarakhand" },
  { value: "West Bengal", label: "West Bengal" },
];


const paginationModel = { page: 0, pageSize: 15 };

const  NationalParty = () => {

  const [openDialog,setOpenDialog] = React.useState<boolean>(false);
  const [name, setName] = React.useState<string>("");
  const [symbol, setSymbol] = React.useState<string>("");
  const [image, setImage] = React.useState<string>("");
  const [logo, setlogo] = React.useState<File | string >("");
  const [state, setState] = React.useState<string>("");
  const [data,setData] = React.useState([]);
   const [error,setError] = React.useState<string>("");
  
  

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 90},
    { field: 'name', headerName: 'Party Name', width: 400 },
    { field: 'logo', headerName: 'Party Logo', width: 300 ,renderCell: (params) => (<img src={`${process.env.NEXT_PUBLIC_IPFS_URL}/${params.value}`} alt="Avatar" style={{ width: 40, height: 40, borderRadius: "50%" }}/>), },
    { field: 'symbol', headerName: 'Party Symbol', width: 300 },
    { field: 'state', headerName: 'Party State', width: 300 },
    { field: 'registered_time', headerName: 'Registered Date', width: 300 },
  ];
    const getdata = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/state-party/get-all`)
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
  const addStateParty = async (e: React.MouseEvent<HTMLButtonElement>) => {
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
     else if(state === ""){
      setError("Please select state")
     }
     else{
 
       formdata.append("name",name);
       formdata.append("symbol",symbol);
       formdata.append("logo",logo);
       formdata.append("state",state);
       console.log(logo)
     }
     const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/state-party/register`, {
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
                <Typography variant="h5" fontWeight={600} gutterBottom>State Party</Typography>
                <Typography variant="subtitle1" >Manage all State Paty From here.</Typography>
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
        <Card variant="outlined" sx={{ height:900,width:600}}>
          <CardHeader title="State Party Details" sx={{textAlign:"center"}} action={<IconButton aria-label="settings" onClick={() => {setOpenDialog(false)}}> <CloseIcon /> </IconButton>}/>
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
            <TextField id="symbol" label="Symbol" fullWidth variant="outlined" value={symbol} onChange={(e) => setSymbol(e.target.value)} />
            <TextField select label="Select State" value={state} onChange={(e) => setState(e.target.value)} fullWidth variant="outlined" helperText="Please select your state" >
              {states.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
            <Button variant="contained" sx={{mt:2}} onClick={addStateParty}>Submit</Button>
          </CardContent>
        </Card>
        </Box>: ""}
    </Box>
    </AdminLayout>
  )
}

export default  NationalParty;
