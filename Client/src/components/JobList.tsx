import { Box, Chip, Typography } from '@mui/material';
import React from 'react';

interface Job {
  id: number;
  title: string;
  description: string;
  tags?: string[];
  organization_id: number; // ✅ FIXED: Added organization_id
}

interface JobListProps {
  jobs: Job[];
  organizationsMap: Record<number, string>; // ✅ FIXED: keys are numbers, not strings
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
            transition: '0.2s',
            '&:hover': { boxShadow: '0 2px 6px rgba(0,0,0,0.2)' },
          }}
          onClick={() => onJobSelect(job)}
        >
          <Typography variant="h6" sx={{ color: '#1f2937' }}>
            {job.title}
          </Typography>
          <Typography variant="subtitle2" sx={{ color: '#6b7280', mb: 1 }}>
            {organizationsMap[job.organization_id] || 'Unknown Organization'}
          </Typography>
          <Typography variant="body2" sx={{ color: '#374151', mb: 1 }}>
            {job.description}
          </Typography>
          {job.tags && (
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {job.tags.map((tag, idx) => (
                <Chip key={idx} label={tag} size="small" color="primary" />
              ))}
            </Box>
          )}
        </Box>
      ))}
    </Box>
  );
};

export default JobList;
