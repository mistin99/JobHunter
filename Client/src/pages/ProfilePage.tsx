import {
    Box,
    Button,
    Divider,
    Paper,
    Typography
} from '@mui/material';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CreateOrganizationModal from '../components/CreateOrganizationModal';
import Header from '../components/Header';
import SidebarDrawer from '../components/Sidebar';

const drawerWidth = 240;

type Organization = {
  id: string;
  // add other organization fields if needed
};

type User = {
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  organization: Organization | null;
};

const user: User = {
  first_name: 'John',
  last_name: 'Travolta',
  email: 'mistin_@abv.bg',
  phone_number: '1234567890',
  organization: null,
};

const ProfilePage: React.FC = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  const navigate = useNavigate();

  const handleDrawerToggle = () => setDrawerOpen(!drawerOpen);
  const handleDialogOpen = () => setCreateDialogOpen(true);
  const handleDialogClose = () => setCreateDialogOpen(false);

  const handleCreateOrganization = (organizationData: any, addressData: any) => {
    const fullData = {
      ...organizationData,
      address: addressData,
    };

    console.log('Creating organization with:', fullData);
    // TODO: Call your API here to create the organization
    handleDialogClose();
  };

  return (
    <Box sx={{ width: '100vw', height: '100vh', overflow: 'hidden' }}>
      <Header onMenuClick={handleDrawerToggle} />
      <SidebarDrawer
        open={drawerOpen}
        handleDrawerToggle={handleDrawerToggle}
        drawerWidth={drawerWidth}
      />

      <Paper sx={{ flex: 1, borderRadius: 0, p: 4, width: '100%', height: '100%' }}>
        <Typography variant="h4" gutterBottom>
          Profile Information
        </Typography>
        <Divider sx={{ mb: 3 }} />
        <Typography variant="subtitle1"><strong>First Name:</strong> {user.first_name}</Typography>
        <Typography variant="subtitle1"><strong>Last Name:</strong> {user.last_name}</Typography>
        <Typography variant="subtitle1"><strong>Email:</strong> {user.email}</Typography>
        <Typography variant="subtitle1"><strong>Phone Number:</strong> {user.phone_number}</Typography>

        <Divider sx={{ my: 4 }} />

        <Typography variant="h5" gutterBottom>Organization</Typography>
        {user.organization ? (
          <Button
            variant="contained"
            color="primary"
            onClick={() => user.organization && navigate(`/organization/${user.organization.id}`)}
          >
            Display Organization Details
          </Button>
        ) : (
          <Button variant="outlined" color="primary" onClick={handleDialogOpen}>
            Create Organization
          </Button>
        )}
      </Paper>

      <CreateOrganizationModal
        open={createDialogOpen}
        onClose={handleDialogClose}
        onSubmit={handleCreateOrganization}
      />
    </Box>
  );
};

export default ProfilePage;
