// src/components/JobDetails.tsx
import { Box, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

interface JobDetailsProps {
  job: {
    id: number;
    title: string;
    organization_id: string;
    description: string;
  };
}

export default function JobDetails({ job }: JobDetailsProps) {
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
      }}
    >
      <Box component="h2" sx={{ fontWeight: 'bold', mb: 1 }}>
        {job.title}
      </Box>
      <Box component="h4" sx={{ fontWeight: 'medium', mb: 3 }}>
        Organization: {job.organization_id}
      </Box>
      <Box sx={{ whiteSpace: 'pre-line', flexGrow: 1, mb: 4, color: 'text.primary' }}>
        {job.description}
      </Box>
      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-start' }}>
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
