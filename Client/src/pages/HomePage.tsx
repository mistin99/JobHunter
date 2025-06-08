import { Box } from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GetAllJobOffers } from '../api/job_offers';
import { GetAllOrganizations } from '../api/organization';
import Header from '../components/Header';
import JobList from '../components/JobList';
import SidebarDrawer from '../components/Sidebar';

interface Job {
  id: number;
  title: string;
  organization_id: number;
  description: string;
  tags: string[];
}

interface Organization {
  id: number;
  name: string;
  location: string;
  website: string;
  description: string;
}

const drawerWidth = 240;

export default function HomePage() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const handleDrawerToggle = () => setDrawerOpen(!drawerOpen);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [organizations, setOrganizations] = useState<Organization[]>([]);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [jobsResponse, organizationsResponse] = await Promise.all([
          GetAllJobOffers(),
          GetAllOrganizations(),
        ]);
        setJobs(jobsResponse.data);
        setOrganizations(organizationsResponse.data);
      } catch (error) {
        console.error('Неуспешно зареждане на обяви или организации:', error);
      }
    };

    fetchData();
  }, []);

  const handleJobClick = (job: Job) => {
    navigate(`/jobs/${job.id}`);
  };

  const organizationsMap = organizations.reduce<Record<number, string>>((map, org) => {
    map[org.id] = org.name;
    return map;
  }, {});

  return (
    <Box sx={{ width: '100%', mb: 1, minWidth: '100vw', minHeight: "100vw" }}>
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
          minHeight: "100vw"
        }}
      >
        <JobList
          jobs={jobs}
          organizationsMap={organizationsMap}
          onJobSelect={handleJobClick}
        />
      </Box>
    </Box>
  );
}
