import { Visibility, VisibilityOff } from "@mui/icons-material";
import { Box, Button, Card, CardContent, CardHeader, CardMedia, IconButton, InputAdornment, TextField } from "@mui/material";
import React from "react";
import CloseIcon from '@mui/icons-material/Close';


interface AdminDetailsDialogProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  id:string;
  name: string;
  setname: React.Dispatch<React.SetStateAction<string>>;
  email: string;
  setemail: React.Dispatch<React.SetStateAction<string>>;
  password: string;
  setpassword: React.Dispatch<React.SetStateAction<string>>;
  image: File | string ;
  setimage: React.Dispatch<React.SetStateAction<File | string >>;
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  buttontitle : string;

}

const RenderDialoge = (props:AdminDetailsDialogProps) => {
  const [showPassword, setShowPassword] = React.useState<boolean>(false);
  const [preview, setPreview] = React.useState<string>("/user.png");
  if (!props.open) return null; 
  return(
    <Box height="100%" width="100%" zIndex={100}  bgcolor="rgba(0, 0, 0, 0.3)" position={"absolute"} display="flex"  sx={{ backdropFilter: "blur(10px)" }}  justifyContent="center" alignItems="center" top={0}>
        <Card variant="outlined" sx={{ height:800,width:600}}>
          <CardHeader title="Admin Details" sx={{textAlign:"center"}} action={<IconButton aria-label="settings" onClick={() => {props.setOpen(false)}}> <CloseIcon /> </IconButton>}/>
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",mt:3}}>
            <label htmlFor="upload-image">
              <CardMedia component="img" width={"100%"} sx={{ borderRadius: "50%", height: 150, width: 150, cursor: "pointer" }} image={(typeof props.image === "string" && props.image !== "") ?  `${process.env.NEXT_PUBLIC_API_URL}/${props.image}` : preview} alt="Upload Image"/>
            </label>
            <input id="upload-image" type="file" accept="image/*" style={{ display: "none" }} onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  props.setimage(file)
                  setPreview(URL.createObjectURL(file));
                }
              }}/>
            
          </Box>
          <CardContent sx={{display:"flex" ,flexDirection:"column",gap:4,mt:4}}>
            <TextField id="id" label="Id" fullWidth variant="outlined" disabled value={props.id} />
            <TextField id="name" label="Name"  fullWidth variant="outlined" value={props.name} onChange={(e) => props.setname(e.target.value)} />
            <TextField id="email" label="Email" fullWidth variant="outlined" value={props.email} onChange={(e) => props.setemail(e.target.value)} />
            <TextField id="password" label="Password" value={props.password} onChange={(e) => props.setpassword(e.target.value)} type={showPassword? "text" : "password"} autoComplete="current-password" variant="outlined" InputProps={{endAdornment: (<InputAdornment position="end" ><IconButton onClick={() => {setShowPassword((prev) => !prev)}}>{showPassword ? <VisibilityOff /> : <Visibility />}</IconButton></InputAdornment>)}} />
            <Button variant="contained" sx={{mt:2}} onClick={props.onClick}>{props.buttontitle}</Button>
          </CardContent>
        </Card>
        </Box>
  )
} 

export default RenderDialoge;