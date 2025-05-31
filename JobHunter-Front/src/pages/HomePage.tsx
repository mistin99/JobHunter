import { Box } from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import JobList from '../components/JobList';
import SidebarDrawer from '../components/Sidebar';

interface Job {
  id: number;
  title: string;
  organization_id: string;
  description: string;
}

interface Organization {
  id: string;
  name: string;
  location: string;
  website: string;
  description: string;
}

const drawerWidth = 240;

const jobsData: Job[] = [
  {
    id: 1,
    title: 'Python Developer',
    organization_id: '12345',
    description: `At HRS we believe...`,
  },
  {
    id: 2,
    title: 'Frontend Developer',
    organization_id: 'Tech Corp',
    description: 'Build and maintain...',
  },
  {
    id: 3,
    title: 'Backend Engineer',
    organization_id: 'Dev Solutions',
    description: 'Develop scalable backend services...',
  },
  {
    id: 4,
    title: 'Full Stack Developer',
    organization_id: 'Webify',
    description: 'Work on both client-side and server-side...',
  },
  {
    id: 5,
    title: 'Data Scientist',
    organization_id: 'Insight Analytics',
    description: 'Analyze large datasets...',
  },
];

const organizationsData: Organization[] = [
  { id: '12345', name: 'HRS', location: 'New York', website: '', description: '' },
  { id: 'Tech Corp', name: 'Tech Corp', location: 'SF', website: '', description: '' },
  { id: 'Dev Solutions', name: 'Dev Solutions', location: 'Austin', website: '', description: '' },
  { id: 'Webify', name: 'Webify', location: 'Seattle', website: '', description: '' },
  { id: 'Insight Analytics', name: 'Insight Analytics', location: 'Boston', website: '', description: '' },
];

export default function HomePage() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const handleDrawerToggle = () => setDrawerOpen(!drawerOpen);
  const [jobs] = useState<Job[]>(jobsData);

  const navigate = useNavigate();

  const handleJobClick = (job: Job) => {
    navigate(`/jobs/${job.id}`);
  };

  const organizationsMap = organizationsData.reduce<Record<string, string>>((map, org) => {
    map[org.id] = org.name;
    return map;
  }, {});

  return (
    <Box sx={{ width: '100%', mb: 1, minWidth: '100vw' }}>
      <Header onMenuClick={handleDrawerToggle} />

      <SidebarDrawer
        open={drawerOpen}
        handleDrawerToggle={handleDrawerToggle}
        drawerWidth={drawerWidth}
      />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          backgroundColor: '#F3F4F6',
          overflowY: 'auto',
        }}
      >
        <JobList jobs={jobs} organizationsMap={organizationsMap} onJobSelect={handleJobClick} />
      </Box>
    </Box>
  );
}
