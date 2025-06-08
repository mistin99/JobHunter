import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    Paper,
    TextField,
    Typography
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { CreateJobOffer, GetOrganizationJobOffers } from '../api/job_offers';
import { GetOrganization } from '../api/organization';
import Header from '../components/Header';
import JobList from '../components/JobList';
import SidebarDrawer from '../components/Sidebar';

const drawerWidth = 240;

type Address = {
    id: number;
    street_line1: string;
    street_line2: string;
    country: string;
    city: string;
    zip_code: string;
};

type Organization = {
    id: number;
    status: string;
    email: string;
    name: string;
    website_url: string;
    description: string;
    address: Address;
};

type JobOffer = {
    id: number;
    title: string;
    description: string;
    tags: string[];
};

const OrganizationDetailsPage: React.FC = () => {
    const { orgId } = useParams();
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [organization, setOrganization] = useState<Organization | null>(null);
    const [jobOffers, setJobOffers] = useState<JobOffer[]>([]);

    const [modalOpen, setModalOpen] = useState(false);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [tags, setTags] = useState('');

    const handleDrawerToggle = () => setDrawerOpen(!drawerOpen);

    useEffect(() => {
        const fetchOrganization = async () => {
            if (!orgId) return;
            try {
                const response = await GetOrganization(Number(orgId));
                const org = response.data.find((item: any) => item.id === Number(orgId));
                setOrganization(org);

                if (org) {
                    const offersResponse = await GetOrganizationJobOffers(org.id);
                    setJobOffers(offersResponse.data ?? []);
                }
            } catch (error) {
                console.error('Грешка при зареждане на организация или обяви за работа:', error);
            }
        };

        fetchOrganization();
    }, [orgId]);

    const handleCreateJobOffer = async () => {
        if (!organization) return;

        const newJobOffer = {
            organization_id: organization.id,
            title,
            description,
            tags: tags.split(',').map(tag => tag.trim()),
        };

        try {
            const response = await CreateJobOffer(newJobOffer);
            console.log("Създадена обява за работа:", response.data);

            const offersResponse = await GetOrganizationJobOffers(organization.id);
            setJobOffers(offersResponse.data ?? []);
            setModalOpen(false);
            setTitle('');
            setDescription('');
            setTags('');
        } catch (error) {
            console.error("Грешка при създаване на обява за работа:", error);
            alert("Неуспешно създаване на обява за работа.");
        }
    };

    if (!organization) {
        return <Typography sx={{ p: 4 }}>Организацията не е намерена или все още се зарежда...</Typography>;
    }

    return (
        <Box sx={{ width: '100vw', height: '100vh', overflow: 'auto' }}>
            <Header onMenuClick={handleDrawerToggle} />
            <SidebarDrawer
                open={drawerOpen}
                handleDrawerToggle={handleDrawerToggle}
                drawerWidth={drawerWidth}
            />

            <Paper sx={{ flex: 1, borderRadius: 0, p: 4, width: '100%', height: '100%', overflowY: 'auto' }}>
                <Typography variant="h4" gutterBottom>
                    Детайли за организацията
                </Typography>
                <Divider sx={{ mb: 3 }} />

                <Typography variant="subtitle1"><strong>Име:</strong> {organization.name}</Typography>
                <Typography variant="subtitle1"><strong>Имейл:</strong> {organization.email}</Typography>
                <Typography variant="subtitle1"><strong>Уебсайт:</strong> {organization.website_url}</Typography>
                <Typography variant="subtitle1"><strong>Статус:</strong> {organization.status}</Typography>
                <Typography variant="subtitle1"><strong>Описание:</strong> {organization.description}</Typography>

                <Divider sx={{ my: 2 }} />
                <Typography variant="h6">Адрес</Typography>
                <Typography variant="body1">{organization.address.street_line1} {organization.address.street_line2}</Typography>
                <Typography variant="body1">{organization.address.city}, {organization.address.country} {organization.address.zip_code}</Typography>

                <Divider sx={{ my: 3 }} />

                <Button
                    variant="contained"
                    color="primary"
                    sx={{ mb: 3 }}
                    onClick={() => setModalOpen(true)}
                >
                    Създай обява за работа
                </Button>

                <Typography variant="h5" gutterBottom>
                    Моите обяви за работа
                </Typography>

                {jobOffers.length > 0 ? (
                    <JobList
                        jobs={jobOffers}
                        organizationsMap={{ [organization.id]: organization.name }}
                        onJobSelect={(job) => alert(`Избрана обява: ${job.title}`)}
                    />
                ) : (
                    <Typography>Няма налични обяви за работа.</Typography>
                )}
            </Paper>

            {/* МОДАЛЕН ДИАЛОГ */}
            <Dialog open={modalOpen} onClose={() => setModalOpen(false)} fullWidth maxWidth="sm">
                <DialogTitle>Създай обява за работа</DialogTitle>
                <DialogContent>
                    <TextField
                        margin="dense"
                        label="Заглавие"
                        fullWidth
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                    <TextField
                        margin="dense"
                        label="Описание"
                        fullWidth
                        multiline
                        rows={3}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                    <TextField
                        margin="dense"
                        label="Тагове (разделени със запетая)"
                        fullWidth
                        value={tags}
                        onChange={(e) => setTags(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setModalOpen(false)}>Отказ</Button>
                    <Button onClick={handleCreateJobOffer} variant="contained" color="primary">Изпрати</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default OrganizationDetailsPage;
