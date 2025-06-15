import { Box, Button, Chip, Typography } from '@mui/material';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMyResumes } from '../api/user';

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
  const [resumeId, setResumeId] = useState<number | null>(null);

  useEffect(() => {
    const fetchMyResume = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        const userId = Number(localStorage.getItem('User_id'));
        if (!token || !userId) return;

        const resumels = await getMyResumes();
        const myResume = resumels[0];

        if (myResume) {
          setResumeId(myResume.id);
        } else {
          console.warn('Няма намерено резюме за потребител', userId);
        }
      } catch (error) {
        console.error('Грешка при извличане на автобиографии:', error);
      }
    };

    fetchMyResume();
  }, []);

  const handleApply = async () => {
    setApplying(true);

    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        alert('Трябва да сте влезли в системата, за да кандидатствате.');
        setApplying(false);
        return;
      }
      if (!resumeId) {
        alert('Не е намерено вашето резюме. Моля, качете резюме, за да кандидатствате.');
        setApplying(false);
        return;
      }

      await axios.post(
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

      alert('Кандидатурата е изпратена успешно!');
    } catch (error: any) {
      console.error('Грешка при кандидатстване за работа:', error);
      alert(
        error.response?.data?.detail ||
        'Възникна грешка при кандидатстване. Моля, опитайте отново.'
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
          {applying ? 'Кандидатстване...' : 'Кандидатствай'}
        </Button>
        <Button variant="outlined" onClick={() => navigate(-1)}>
          Назад
        </Button>
      </Box>
    </Box>
  );
}
