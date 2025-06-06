import {
  Box,
  Button,
  Divider,
  Paper,
  Typography,
} from '@mui/material';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { refresh } from '../api/auth.';
import { createOrg } from '../api/organization'; // Adjust path if needed
import { uploadResume } from '../api/user';
import CreateOrganizationModal from '../components/CreateOrganizationModal';
import Header from '../components/Header';
import SidebarDrawer from '../components/Sidebar';

type User = {
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  organization_id: string | null;
};

const ProfilePage: React.FC = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  const [user, setUser] = useState<User>(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        return JSON.parse(storedUser);
      } catch {
        return {
          first_name: '',
          last_name: '',
          email: '',
          phone_number: '',
          organization_id: null,
        };
      }
    }
    return {
      first_name: '',
      last_name: '',
      email: '',
      phone_number: '',
      organization_id: null,
    };
  });

  const navigate = useNavigate();

  const handleDrawerToggle = () => setDrawerOpen(!drawerOpen);
  const handleDialogOpen = () => setCreateDialogOpen(true);
  const handleDialogClose = () => setCreateDialogOpen(false);

  const handleCreateOrganization = async (organizationData: any, addressData: any) => {
    const OrganizationData = {
      name: organizationData.name,
      email: organizationData.email,
      website_url: organizationData.website_url,
      description: organizationData.description,
      address: addressData,
    };

    try {
      // First attempt
      const response = await createOrg(OrganizationData);

      console.log('Organization created:', response.data);

      const orgId = response.data.organization?.id ?? null;

      setUser((prevUser) => ({
        ...prevUser,
        organization_id: orgId,
      }));

      localStorage.setItem('user', JSON.stringify({ ...user, organization_id: orgId }));

      handleDialogClose();

    } catch (error: any) {
      console.error('Error creating organization:', error.response?.status, error.response?.data || error.message);

      try {
        console.log("Fetching new token")
        await refresh();

        const retryResponse = await createOrg(OrganizationData);

        console.log('Organization created after token refresh:', retryResponse.data);

        const orgId = retryResponse.data.organization?.id ?? null;

        setUser((prevUser) => ({
          ...prevUser,
          organization_id: orgId,
        }));

        localStorage.setItem('user', JSON.stringify({ ...user, organization_id: orgId }));

        handleDialogClose();

      } catch (refreshError: any) {
        console.error('Token refresh failed:', refreshError.response?.data || refreshError.message);
      }
    }
  };

  const [uploading, setUploading] = useState(false);

  const handleResumeUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      setUploading(true);

      const response = await uploadResume(formData);

      console.log('Uploaded resume:', response.data);
      alert('Resume uploaded successfully!');
    } catch (error: any) {
      console.error('Error uploading resume:', error);
      alert(error.response?.data?.detail || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };



  return (
    <Box sx={{ width: '100vw', height: '100vh', overflow: 'hidden' }}>
      <Header onMenuClick={handleDrawerToggle} />
      <SidebarDrawer open={drawerOpen} handleDrawerToggle={handleDrawerToggle} drawerWidth={240} />

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
        <Divider sx={{ my: 4 }} />

        <Typography variant="h5" gutterBottom>Upload Resume</Typography>
        <input
          type="file"
          accept=".pdf,.doc,.docx"
          style={{ display: 'none' }}
          id="resume-upload"
          onChange={handleResumeUpload}
        />
        <label htmlFor="resume-upload">
          <Button variant="contained" component="span" disabled={uploading}>
            {uploading ? 'Uploading...' : 'Upload Resume'}
          </Button>
        </label>
        <Typography variant="h5" gutterBottom>Organization</Typography>
        {user.organization_id ? (
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate(`/organization/${user.organization_id}`)}
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
