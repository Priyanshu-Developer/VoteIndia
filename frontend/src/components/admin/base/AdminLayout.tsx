import * as React from 'react';
import Typography from '@mui/material/Typography';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AdminPanelSettingsIcon  from '@mui/icons-material/AdminPanelSettings';
import PeopleAltIcon  from '@mui/icons-material/PeopleAlt';
import HowToVoteIcon from '@mui/icons-material/HowToVote';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import { Navigation } from '@toolpad/core/AppProvider';
import { Ballot, Flag, PublicOutlined } from '@mui/icons-material';

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
    title: 'Parties',
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
    kind: 'divider',
  },
  {
    kind: 'header',
    title: 'Elections',
  }, 
  {
    segment: 'admin/election/national-election',
    title: 'National Election',
    icon:  <Ballot/>,
  },
  {
    segment: 'admin/election/state-election',
    title: 'State Election',
    icon:  <Flag/>,
  }, 
  
];

export default function DashboardLayoutBasic({children }: {children : React.ReactNode}) {


  return (
   
  
      <DashboardLayout navigation={NAVIGATION}>
       {children}
      
      </DashboardLayout>
  );
}
