import { Box } from '@mui/material';
import React from 'react';

interface Job {
  id: number;
  title: string;
  organization_id: string;
  description: string;
}

interface JobListProps {
  jobs: Job[];
  organizationsMap: Record<string, string>;
  onJobSelect: (job: Job) => void;
}

const JobList: React.FC<JobListProps> = ({ jobs, organizationsMap, onJobSelect }) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {jobs.map((job) => (
        <Box
          key={job.id}
          sx={{
            bgcolor: 'white',
            borderRadius: 2,
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            p: 2,
            border: '1px solid #e5e7eb',
            cursor: 'pointer',
          }}
          onClick={() => onJobSelect(job)}
        >
          <Box
            component="h3"
            sx={{ fontSize: 18, fontWeight: 'bold', color: '#1f2937' }}
          >
            {job.title}
          </Box>
          <Box
            component="h4"
            sx={{ fontSize: 16, color: '#4b5563' }}
          >
            {organizationsMap[job.organization_id] || job.organization_id}
          </Box>
        </Box>
      ))}
    </Box>
  );
};

export default JobList;
