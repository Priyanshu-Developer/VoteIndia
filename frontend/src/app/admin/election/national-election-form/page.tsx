"use client";
import React from 'react';
import {Box,Card,CardContent,FormControl,InputLabel,MenuItem,Select,SelectChangeEvent,Typography} from "@mui/material";

const SelectComponent = ({menuitems,label,width,value,setValue}: {menuitems: string[];label: string;width: number;value: string;setValue: React.Dispatch<React.SetStateAction<string>>}) => {

  return (
    <Box component='div' width={width} >
      <FormControl fullWidth>
        <InputLabel id={`${label}-label`}>{`Select ${label}`}</InputLabel>
        <Select labelId={`${label}-label`} id={label} value={value} label={`Select ${label}`} onChange={(event: SelectChangeEvent) => setValue(event.target.value)}>
          {menuitems.map((item, index) => (
            <MenuItem key={index} value={item}>
              {item}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
};

const NationalElectionForm = () => {
  const [contractAddress,setContrcatAddress] = React.useState<string | null>("");
  const [year,setYear] = React.useState("2023");
  const [ext,setExt] = React.useState('');
  const states = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
    "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
    "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
    "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana",
    "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal"
  ];
  React.useEffect(
    () => {
      setContrcatAddress(sessionStorage.getItem("contractAddress"));
    }
    ,[])
  const party = [1, 2, 3, 4, 5, 6, 7, 9];

  return (
    <Box component='div'  bgcolor="var(--mui-palette-background-default)"    color="primary" p={6} sx={{ widht: "100vw" }} overflow={'auto'}>
                
            <Box display="flex" flexDirection="column" alignItems="center" gap={2} mb={4} >
              <Box component="img" src="/electionLogo.png" alt="Election Commission" width={60} height={60} />
              <Typography variant="h4" fontWeight={700} color="green"> Election Commission of India </Typography>
              <Typography variant="h5" fontWeight={600}> National Election Form  </Typography>
              <Typography variant="subtitle1"> Fill the form to create a new national election. </Typography>
            </Box>

            <Box display="flex" flexDirection="column" alignItems="center" gap={3}>
            {/* Contract Info */}
            <Box display="flex" flexDirection="row" gap={5}>
            <Box>
                <Typography variant="h6" fontWeight={600}>Contract Address </Typography>
                <Typography variant="subtitle1" fontWeight={400}> {contractAddress} </Typography>
            </Box>
            <Box>
                <Typography variant="h6" fontWeight={600}>Election Year</Typography>
                <Typography variant="subtitle1" fontWeight={400}> {year} </Typography>
            </Box>
            </Box>


            {/* Party Cards */}
            <Box display="flex" flexDirection="column"  gap={3}>
            { party.map((item, idx) => (
                <Card key={idx} variant="outlined" sx={{th: 800,height: 200,display: "flex",alignItems: "center",justifyContent: "center",p: 2,borderRadius: 3}}>
                  <CardContent sx={{ display: "flex", flexDirection: "row", justifyContent: "space-between", width: "100%", alignItems: "center" }}>
                      <Box display="flex" flexDirection="column" gap={1}>
                        <Typography variant="h6" fontWeight={600}> Party Name {item} </Typography>
                        <Box component="img" src="/electionLogo.png" alt="Party Logo" width={50} height={50} />
                      </Box>
                      <Box display="flex" flexDirection="column" gap={1} >
                        <SelectComponent menuitems={states} label="Party" width={300} value={ext} setValue={setExt} />
                        <Box component="img" src="/electionLogo.png" alt="Party Logo" alignItems='flex-end' justifyContent={'end'} width={50} height={50} />
                      </Box>
                  </CardContent>
                </Card>
            ))  }
            </Box>
            </Box>
                </Box>
  );
};

export default NationalElectionForm;
