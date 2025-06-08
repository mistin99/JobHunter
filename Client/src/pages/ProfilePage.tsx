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
import { createOrg } from '../api/organization';
import { getMyResumes, uploadResume } from '../api/user';
import CreateOrganizationModal from '../components/CreateOrganizationModal';
import Header from '../components/Header';
import ResumePreviewModal from '../components/Resume';
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
  const [resumeId, setResumeId] = useState<number | null>(null);
  const [resumeModalOpen, setResumeModalOpen] = useState(false);

  const handleViewResume = async () => {
    try {
      const response = await getMyResumes();
      const resumes = response.data;

      if (resumes.length === 0) {
        alert('Няма намерени автобиографии.');
        return;
      }

      setResumeId(resumes[0].id);
      setResumeModalOpen(true);
    } catch (error) {
      console.error('Грешка при зареждане на автобиография:', error);
      alert('Неуспешно зареждане на автобиография');
    }
  };

  const handleCreateOrganization = async (organizationData: any, addressData: any) => {
    const OrganizationData = {
      name: organizationData.name,
      email: organizationData.email,
      website_url: organizationData.website_url,
      description: organizationData.description,
      address: addressData,
    };

    try {
      const response = await createOrg(OrganizationData);

      console.log('Организацията е създадена:', response.data);

      const orgId = response.data.organization?.id ?? null;

      setUser((prevUser) => ({
        ...prevUser,
        organization_id: orgId,
      }));

      localStorage.setItem('user', JSON.stringify({ ...user, organization_id: orgId }));

      handleDialogClose();
    } catch (error: any) {
      console.error('Грешка при създаване на организация:', error.response?.status, error.response?.data || error.message);

      try {
        console.log("Обновяване на токена...");
        await refresh();

        const retryResponse = await createOrg(OrganizationData);

        console.log('Организацията е създадена след обновяване на токена:', retryResponse.data);

        const orgId = retryResponse.data.organization?.id ?? null;

        setUser((prevUser) => ({
          ...prevUser,
          organization_id: orgId,
        }));

        localStorage.setItem('user', JSON.stringify({ ...user, organization_id: orgId }));

        handleDialogClose();
      } catch (refreshError: any) {
        console.error('Неуспешно обновяване на токен:', refreshError.response?.data || refreshError.message);
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

      console.log('Автобиографията е качена:', response.data);
      alert('Автобиографията беше успешно качена!');
    } catch (error: any) {
      console.error('Грешка при качване:', error);
      alert(error.response?.data?.detail || 'Качването не бе успешно');
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
          Профилна информация
        </Typography>
        <Divider sx={{ mb: 3 }} />
        <Typography variant="subtitle1"><strong>Име:</strong> {user.first_name}</Typography>
        <Typography variant="subtitle1"><strong>Фамилия:</strong> {user.last_name}</Typography>
        <Typography variant="subtitle1"><strong>Имейл:</strong> {user.email}</Typography>
        <Typography variant="subtitle1"><strong>Телефон:</strong> {user.phone_number}</Typography>

        <Divider sx={{ my: 4 }} />
        <Divider sx={{ my: 4 }} />

        <Typography variant="h5" gutterBottom>Качване на автобиография</Typography>
        <input
          type="file"
          accept=".pdf,.doc,.docx"
          style={{ display: 'none' }}
          id="resume-upload"
          onChange={handleResumeUpload}
        />
        <label htmlFor="resume-upload">
          <Button variant="contained" component="span" disabled={uploading}>
            {uploading ? 'Качване...' : 'Качи автобиография'}
          </Button>
        </label>
        <Button variant="outlined" onClick={handleViewResume}>
          Преглед на качена автобиография
        </Button>

        <ResumePreviewModal
          open={resumeModalOpen}
          onClose={() => setResumeModalOpen(false)}
          resumeId={resumeId ?? -1}
        />

        <Typography variant="h5" gutterBottom>Организация</Typography>
        {user.organization_id ? (
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate(`/organization/${user.organization_id}`)}
          >
            Преглед на организация
          </Button>
        ) : (
          <Button variant="outlined" color="primary" onClick={handleDialogOpen}>
            Създай организация
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
