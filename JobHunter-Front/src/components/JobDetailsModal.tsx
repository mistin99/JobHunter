import { Box, Button, Modal, Typography } from '@mui/material';

const style = {
  position: 'absolute' as const,
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  bgcolor: 'background.paper',
  borderRadius: 2,
  boxShadow: 24,
  p: 3,
  width: 400,
  maxHeight: '80vh',
  display: 'flex',
  flexDirection: 'column',
};

interface Job {
  id: number;
  title: string;
  company: string;
  location: string;
  description: string;
}

interface JobDetailsModalProps {
  job: Job | null;
  open: boolean;
  onClose: () => void;
}

export default function JobDetailsModal({ job, open, onClose }: JobDetailsModalProps) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="job-title"
      aria-describedby="job-description"
    >
      <Box sx={style}>
        {job && (
          <>
            <Typography id="job-title" variant="h6" component="h2" sx={{ mb: 2, color: 'black' }}>
              {job.title} at {job.company}
            </Typography>
            <Typography id="job-location" sx={{ mb: 2, color: 'text.secondary' }}>
              Location: {job.location}
            </Typography>
            <Box
              sx={{
                overflowY: 'auto',
                flexGrow: 1,
                whiteSpace: 'pre-line',
                mb: 2,
                color: 'text.primary',
              }}
              id="job-description"
            >
              {job.description}
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Button variant="contained" onClick={() => alert('Kura mi qnko')}>
                Apply
              </Button>
              <Button variant="outlined" onClick={onClose}>
                Close
              </Button>
            </Box>
          </>
        )}
      </Box>
    </Modal>
  );
}
