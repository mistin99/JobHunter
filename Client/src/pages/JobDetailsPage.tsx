import { Box } from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Header from '../components/Header';
import JobDetails from '../components/JobDetails';
import JobList from '../components/JobList';
import OrganizationDetails from '../components/OrganizationDetails';
import SidebarDrawer from '../components/Sidebar';

import { GetJobOfferById } from '../api/job_offers';
import { GetOrganization } from '../api/organization';

interface Job {
  id: number;
  title: string;
  organization_id: number;
  description: string;
  tags?: string[];
}

interface Organization {
  id: number;
  name: string;
  location: string;
  website: string;
  description: string;
}

const drawerWidth = 240;

export default function JobDetailsPage() {
  const { jobId } = useParams<{ jobId: string }>();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [job, setJob] = useState<Job | null>(null);
  const [organization, setOrganization] = useState<Organization | null>(null);

  const navigate = useNavigate();
  const handleDrawerToggle = () => setDrawerOpen(!drawerOpen);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!jobId) return;

        const jobResponse = await GetJobOfferById(Number(jobId));
        const jobData = Array.isArray(jobResponse.data)
          ? jobResponse.data[0]
          : jobResponse.data;
        setJob(jobData);

        const orgResponse = await GetOrganization(jobData.organization_id);
        const orgData = Array.isArray(orgResponse.data)
          ? orgResponse.data[0]
          : orgResponse.data;

        console.log('Organization used:', orgData);
        setOrganization(orgData);
      } catch (error) {
        console.error('Error fetching job or organization:', error);
      }
    };

    fetchData();
  }, [jobId]);

  const onJobSelect = (selectedJob: Job) => {
    navigate(`/jobs/${selectedJob.id}`);
  };

  const organizationsMap = organization
    ? { [organization.id]: organization.name }
    : {};
  if (job) {
    console.log("Passing to JobList:", job, organizationsMap);
  }
  return (

    <Box sx={{ width: '100%', minWidth: '100vw' }}>
      <Header onMenuClick={handleDrawerToggle} />

      <SidebarDrawer
        open={drawerOpen}
        handleDrawerToggle={handleDrawerToggle}
        drawerWidth={drawerWidth}
      />

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
        {job && <JobDetails job={job} organizationName={organization?.name} />}

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
