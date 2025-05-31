import { Box } from '@mui/material';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom'; // Add useNavigate to navigate on job select
import Header from '../components/Header';
import SidebarDrawer from '../components/Sidebar';

import JobDetails from '../components/JobDetails';
import JobList from '../components/JobList';
import OrganizationDetails from '../components/OrganizationDetails';

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
  { id: 1, title: 'Python Developer', organization_id: '12345', description: `At HRS we believe...` },
  { id: 2, title: 'Frontend Developer', organization_id: 'Tech Corp', description: 'Build and maintain...' },
  { id: 3, title: 'Backend Engineer', organization_id: 'Dev Solutions', description: 'Develop scalable backend services...' },
  { id: 4, title: 'Full Stack Developer', organization_id: 'Webify', description: 'Work on both client-side and server-side...' },
  { id: 5, title: 'Data Scientist', organization_id: 'Insight Analytics', description: 'Analyze large datasets...' },
];

const organizationsData: Organization[] = [
  { id: '12345', name: 'HRS', location: 'New York, USA', website: 'https://hrs.com', description: 'A leading tech company specializing in HR solutions.' },
  { id: 'Tech Corp', name: 'Tech Corp', location: 'San Francisco, USA', website: 'https://techcorp.com', description: 'Innovative software and hardware products.' },
  { id: 'Dev Solutions', name: 'Dev Solutions', location: 'Austin, USA', website: 'https://devsolutions.io', description: 'Backend and cloud infrastructure experts.' },
  { id: 'Webify', name: 'Webify', location: 'Seattle, USA', website: 'https://webify.co', description: 'Full stack web development agency.' },
  { id: 'Insight Analytics', name: 'Insight Analytics', location: 'Boston, USA', website: 'https://insightanalytics.com', description: 'Data science and big data analytics firm.' },
];

export default function JobDetailsPage() {
  const { jobId } = useParams<{ jobId: string }>();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const navigate = useNavigate();

  const handleDrawerToggle = () => setDrawerOpen(!drawerOpen);

  // Create org ID to name map for JobList
  const organizationsMap = organizationsData.reduce<Record<string, string>>((map, org) => {
    map[org.id] = org.name;
    return map;
  }, {});

  const job = jobsData.find((j) => j.id === Number(jobId));
  const organization = job ? organizationsData.find((org) => org.id === job.organization_id) : null;

  // On selecting a job, navigate to its detail page
  const onJobSelect = (selectedJob: Job) => {
    navigate(`/jobs/${selectedJob.id}`);
  };

  return (
    <Box sx={{ width: '100%', minWidth: '100vw' }}>
      <Header onMenuClick={handleDrawerToggle} />

      <SidebarDrawer open={drawerOpen} handleDrawerToggle={handleDrawerToggle} drawerWidth={drawerWidth} />

      <Box
        component="main"
        sx={{
          px: 3,
          pb: 4,
          minHeight: 'calc(100vh - 64px)',
          backgroundColor: '#F3F4F6',
          display: 'flex',
          justifyContent: 'center',
          overflowY: 'auto',
          gap: 3,
        }}
      >
        {job && <JobDetails job={job} />}

        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 20,
            minWidth: 300,
            maxWidth: 800,
          }}
        >
          {organization && <OrganizationDetails organization={organization} />}
          {job && (
            <JobList
              jobs={[job]}
              organizationsMap={organizationsMap}
              onJobSelect={onJobSelect}
            />
          )}
        </Box>
      </Box>
    </Box>
  );
}
