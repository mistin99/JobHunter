// src/components/JobDetails.tsx
import { Box, Button, Chip, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

interface JobDetailsProps {
  job: {
    id: number;
    title: string;
    description: string;
    tags?: string[];
    organization_id: number;
  };
  organizationName?: string; // ✅ optional prop for name
}

export default function JobDetails({ job, organizationName }: JobDetailsProps) {
  console.log('JobDetails received job:', job);
  console.log('JobDetails received organizationName:', organizationName);
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        maxWidth: 700,
        width: '100%',
        bgcolor: 'white',
        p: 4,
        borderRadius: 2,
        boxShadow: 3,
        color: '#1f2937',
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
      }}
    >
      <Typography variant="h5" fontWeight="bold">
        {job.title}
      </Typography>

      {organizationName && (
        <Typography variant="subtitle1" color="text.secondary">
          {organizationName}
        </Typography>
      )}

      <Typography
        sx={{ whiteSpace: 'pre-line', color: 'text.primary' }}
      >
        {job.description}
      </Typography>

      {Array.isArray(job.tags) && job.tags.length > 0 && (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {job.tags.map((tag, idx) => (
            <Chip key={idx} label={tag} variant="outlined" />
          ))}
        </Box>
      )}

      <Box sx={{ display: 'flex', gap: 2 }}>
        <Button variant="contained" onClick={() => alert('Applying...')}>
          Apply
        </Button>
        <Button variant="outlined" onClick={() => navigate(-1)}>
          Back
        </Button>
      </Box>
    </Box>
  );
}
