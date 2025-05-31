import {
    Box,
    Divider,
    Paper,
    Typography
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../components/Header';
import SidebarDrawer from '../components/Sidebar';

const drawerWidth = 240;

const mockOrganization = {
    id: '12345',
    name: 'HRS',
    email: 'contact@hrs.com',
    phone_number: '555-123-4567',
    website_url: 'https://www.hrs.com',
    description: 'Human Resource Services company specializing in staffing and recruitment.',
    status: 'Active',
    location: 'New York'
};

const OrganizationDetailsPage: React.FC = () => {
    const { orgId } = useParams();
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [organization, setOrganization] = useState<any | null>(null);

    const handleDrawerToggle = () => setDrawerOpen(!drawerOpen);

    useEffect(() => {
        // Simulate fetching organization by ID
        if (orgId === mockOrganization.id) {
            setOrganization(mockOrganization);
        } else {
            // In a real app, fetch from API
            setOrganization(null);
        }
    }, [orgId]);

    if (!organization) {
        return <Typography sx={{ p: 4 }}>Organization not found or loading...</Typography>;
    }

    return (
        <Box sx={{ width: '100vw', height: '100vh', overflow: 'hidden' }}>
            <Header onMenuClick={handleDrawerToggle} />
            <SidebarDrawer
                open={drawerOpen}
                handleDrawerToggle={handleDrawerToggle}
                drawerWidth={drawerWidth}
            />

            <Paper
                sx={{
                    flex: 1,
                    borderRadius: 0,
                    p: 4,
                    width: '100%',
                    height: '100%',
                }}
            >
                <Typography variant="h4" gutterBottom>
                    Organization Details
                </Typography>
                <Divider sx={{ mb: 3 }} />

                <Typography variant="subtitle1"><strong>Name:</strong> {organization.name}</Typography>
                <Typography variant="subtitle1"><strong>Email:</strong> {organization.email}</Typography>
                <Typography variant="subtitle1"><strong>Phone Number:</strong> {organization.phone_number}</Typography>
                <Typography variant="subtitle1"><strong>Website:</strong> {organization.website_url}</Typography>
                <Typography variant="subtitle1"><strong>Status:</strong> {organization.status}</Typography>
                <Typography variant="subtitle1"><strong>Location:</strong> {organization.location}</Typography>
                <Typography variant="subtitle1" sx={{ mt: 2 }}><strong>Description:</strong></Typography>
                <Typography variant="body1">{organization.description}</Typography>
            </Paper>
        </Box>
    );
};

export default OrganizationDetailsPage;
