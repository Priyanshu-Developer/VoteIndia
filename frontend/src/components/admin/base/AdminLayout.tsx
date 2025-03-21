import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { createTheme } from '@mui/material/styles';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import DescriptionIcon from '@mui/icons-material/Description';
import LayersIcon from '@mui/icons-material/Layers';
import { AppProvider, type Navigation } from '@toolpad/core/AppProvider';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import HowToVoteIcon from '@mui/icons-material/HowToVote';


const NAVIGATION: Navigation = [
 
  {
    segment: 'admin/dashboard',
    title: 'Dashboard',
    icon: <DashboardIcon />,
  },
  {
    kind: 'divider',
  },
  {
    kind: 'header',
    title: 'Users',
  },  
  {
    segment: 'admin/users/voters',
    title: 'Voters',
    icon: <HowToVoteIcon />,
  },
  {
    segment: 'admin/users/admin',
    title: 'Admin',
    icon: <AdminPanelSettingsIcon/>
    ,
  },
  
  {
    kind: 'divider',
  },
  {
    kind: 'header',
    title: 'Candidates',
  },  
  {
    segment: 'admin/parties/national-party',
    title: 'National Party',
    icon: <Typography variant="h6">🇮🇳 </Typography>
    ,
  },
  {
    segment: 'admin/parties/state-party',
    title: 'State Party',
    icon: <PeopleAltIcon />,
  },
  {
    segment: 'traffic',
    title: 'Traffic',
    icon: <DescriptionIcon />,
  },
  {
    segment: 'integrations',
    title: 'Integrations',
    icon: <LayersIcon />,
  },
];






export default function DashboardLayoutBasic({children} : {children:React.ReactNode}) {

  return (
    <AppProvider navigation={NAVIGATION}
      branding={{
        logo: <img src="/electionLogo.png" alt=" logo" />,
        title: 'ADMIN',
      }}
    >
      <DashboardLayout>
        <div className="m-6 overflow-scroll scrollbar-hide">
          {children}
        </div>
       
      </DashboardLayout>
    </AppProvider>
    
  );
}
