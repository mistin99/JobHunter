// components/ResumePreviewModal.tsx
import CloseIcon from '@mui/icons-material/Close';
import { Dialog, DialogContent, DialogTitle, IconButton } from '@mui/material';
import { useEffect, useState } from 'react';
import { getMyResumes } from '../api/user';

interface Props {
  open: boolean;
  onClose: () => void;
  resumeId: number;
}

export default function ResumePreviewModal({ open, onClose, resumeId }: Props) {
  const [resumeUrl, setResumeUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!open || !resumeId) return;

    const fetchResumeBlob = async () => {
      try {
        const response = await getMyResumes();

        const fileBlob = new Blob([response.data], {
          type: response.headers['content-type'],
        });

        const url = URL.createObjectURL(fileBlob);
        setResumeUrl(url);
      } catch (error) {
        console.error('Грешка при изтегляне на автобиографията:', error);
      }
    };

    fetchResumeBlob();

    return () => {
      if (resumeUrl) URL.revokeObjectURL(resumeUrl);
    };
  }, [open, resumeId]);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>
        Преглед на автобиография
        <IconButton
          aria-label="затвори"
          onClick={onClose}
          sx={{ position: 'absolute', right: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        {resumeUrl ? (
          <iframe
            src={resumeUrl}
            width="100%"
            height="600px"
            style={{ border: 'none' }}
          />
        ) : (
          <p>Зареждане...</p>
        )}
      </DialogContent>
    </Dialog>
  );
}
