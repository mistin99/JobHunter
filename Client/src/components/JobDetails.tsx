import { Box, Button, Chip, Typography } from '@mui/material';
import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface JobDetailsProps {
  job: {
    id: number;
    title: string;
    description: string;
    tags?: string[];
    organization_id: number;
  };
  organizationName?: string;
}

export default function JobDetails({ job, organizationName }: JobDetailsProps) {
  const navigate = useNavigate();
  const [applying, setApplying] = useState(false);

  const handleApply = async () => {
    setApplying(true);

    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        alert('You must be logged in to apply.');
        return;
      }

      const resumeId = 3; // Replace with real resume ID logic
      const response = await axios.post(
        'http://127.0.0.1:8000/job-offers/apply',
        {
          resume_id: resumeId,
          job_offer_id: job.id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      alert('Application submitted successfully!');
    } catch (error: any) {
      console.error('Error applying to job:', error);
      alert(
        error.response?.data?.detail ||
          'An error occurred while applying. Please try again.'
      );
    } finally {
      setApplying(false);
    }
  };

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

      <Typography sx={{ whiteSpace: 'pre-line', color: 'text.primary' }}>
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
        <Button
          variant="contained"
          onClick={handleApply}
          disabled={applying}
        >
          {applying ? 'Applying...' : 'Apply'}
        </Button>
        <Button variant="outlined" onClick={() => navigate(-1)}>
          Back
        </Button>
      </Box>
    </Box>
  );
}
