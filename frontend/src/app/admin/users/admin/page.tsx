"use client"

import AdminLayout from "@/components/admin/base/AdminLayout";
import { Box, Button, Checkbox, Typography } from "@mui/material";
import * as React from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import AddIcon from '@mui/icons-material/Add';
import Paper from '@mui/material/Paper';
import DeleteIcon from '@mui/icons-material/Delete';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import RenderDialoge from "@/components/admin/RenderDialoge";

const paginationModel = { page: 0, pageSize: 15 };

const  Admin = () => {

  
  const [openDialog,setOpenDialog] = React.useState<boolean>(false);
  const [openDialog2,setOpenDialog2] = React.useState<boolean>(false);
  const [id,setId] = React.useState<string>("");
  const [name, setName] = React.useState<string>("");
  const [email,setEmail] = React.useState<string>("");
  const [password, setPassword] = React.useState<string>("");
  const [image, setImage] = React.useState<File | string >("");
  const [adminData,setAdminData] = React.useState([]);
  const [prevdata,setPrevdata] = React.useState({id:"",username:"",email:"",image:""})


  const handlechange = (param:any) => {
    setId(param.row.id);
    setName(param.row.username);
    setEmail(param.row.email);
    setImage(param.row.image);
    setPassword("");
    setOpenDialog2(true);
    setPrevdata({id:param.row.id,username:param.row.username,email:param.row.email,image:param.row.image})
  }

  const getAdmin = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/get-admin`)
      if(!res.ok){
        setAdminData([])
      }
      else{
        const data = await res.json()
        setAdminData(data)
      }
    } catch (error) {
      
    }
  }
    React.useEffect(() => {getAdmin()},[])

  const setNull = () => {
    setId((adminData.length+1).toString());
    setName("");
    setEmail("");
    setImage("");
    setPassword("");
    setOpenDialog(true);
  }
  const updateadmin =  async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    console.log("i have been called")
    const formdata = new FormData();
    formdata.append("id",id);
    if (name !== prevdata.username){
      formdata.append("username",name);
    }
    if (email !== prevdata.email){
      formdata.append("email",email);
    }
    if (password !== ""){
      formdata.append("password",password);
    }
    if (image !== prevdata.image){
      formdata.append("image",image);
    }
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/update`, {
      method: 'PUT',
      body:formdata

    });
    if (response.ok){
      setOpenDialog2(false)
      getAdmin()
      
    }
  }

  const deleteAdmin = async (id:Number) => {
    const response = await  fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/delete/?id=${id}`, {
      method: 'DELETE',
    });
    if (response.ok){
      getAdmin()
      
    }
  }
  
  const addNewAdmin = async (e: React.MouseEvent<HTMLButtonElement>) =>{
    e.preventDefault()
    const formdata = new FormData();
    formdata.append("id",id)
    formdata.append("username",name),
    formdata.append("email",email)
    formdata.append("password",password)
    formdata.append("isadmin","true")
    if (image) {
      console.log(image)
      formdata.append('image', image);
    } else {
      window.alert('No captured image available');
      return;
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/register`, {
      method: 'POST',
      body:formdata

    });
    if (response.ok){
      setOpenDialog(false)
      getAdmin()
      
    }
  }

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 90},
    { field: 'username', headerName: 'Name', width: 400 },
    { field: 'image', headerName: 'Image', width: 300 ,renderCell: (params) => (<img src={`${process.env.NEXT_PUBLIC_API_URL}/${params.value}?t=${Date.now()}`} alt="Avatar" style={{ width: 40, height: 40, borderRadius: "50%" }}/>), },
    { field: 'email', headerName: 'Email', width: 400 },
    { field: 'isadmin', headerName: 'IsAdmin', width: 100,renderCell : (param) => (<Checkbox color="success" checked={param.row.isadmin} />) },
    { field: 'edit', headerName: 'Edit', width: 100, renderCell : (param) => (<Button startIcon={<ModeEditIcon />} color="primary" size="large" onClick={() => (handlechange(param))}></Button>) },
    { field: 'delete', headerName: 'Delete', width: 100, renderCell : (param) => (<Button startIcon={<DeleteIcon/>} color="error" onClick={() => (deleteAdmin(param.row.id))}  size="large"></Button>) },
    
  ];

  const loaddata = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/get`)
      if(!res.ok){
        setAdminData([])
      }
      else{
        const data = await res.json()
        setAdminData(data)
      }
    } catch (error) {
      
    }
  }
  React.useEffect(() => {loaddata()},[])
  
  return (
    <AdminLayout>
       <Box  p="1rem" gap="1rem" position="relative">
        <Box flexGrow={1} >
          <Box sx={{display:'flex',justifyContent:"space-between"}}>
              <Box>
                <Typography variant="h5" fontWeight={600} gutterBottom>Admin</Typography>
                <Typography variant="subtitle1" >Manage all Admins From here.</Typography>
              </Box>
              <Button variant="contained" sx={{height:40,fontWeight:800}} onClick={setNull} endIcon={<AddIcon/>} >Add Admin</Button>
          </Box>
          <Box sx={{py:3}} >
              <Paper sx={{ height: 780, width: '100%' }}>
                  <DataGrid
                    rows={adminData}
                    columns={columns}
                    initialState={{ pagination: { paginationModel } }}
                    pageSizeOptions={[15, 20]}
                    sx={{ border: 0 }}
                  />
                </Paper>
          </Box>
        </Box>
        <RenderDialoge open={openDialog} setOpen={setOpenDialog} id={id} name={name} setname={setName} email={email} setemail={setEmail} password={password} setpassword={setPassword} image={image} setimage={setImage} buttontitle="Add" onClick={addNewAdmin} ></RenderDialoge>

        <RenderDialoge open={openDialog2} setOpen={setOpenDialog2} id={id} name={name} setname={setName} email={email} setemail={setEmail} password={password} setpassword={setPassword} image={image} setimage={setImage} buttontitle="Update" onClick={updateadmin} ></RenderDialoge>
    </Box>
    </AdminLayout>
  )
}

export default  Admin;
