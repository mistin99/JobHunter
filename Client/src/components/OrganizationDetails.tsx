// src/components/OrganizationDetails.tsx
import { Box, Typography } from '@mui/material';

interface OrganizationDetailsProps {
  organization: {
    id: string;
    name: string;
    location: string;
    website: string;
    description: string;
  };
}

export default function OrganizationDetails({ organization }: OrganizationDetailsProps) {
  return (
    <Box
      sx={{
        maxWidth: 350,
        width: '100%',
        bgcolor: 'white',
        p: 4,
        borderRadius: 2,
        boxShadow: 3,
        color: '#1f2937',
        display: 'flex',
        flexDirection: 'column',
        position: 'sticky',
        top: 80,
        height: 'fit-content',
      }}
    >
      <Typography variant="h6" fontWeight="bold" mb={2}>
        За {organization.name}
      </Typography>
      <Typography mb={1}>
        <strong>Локация:</strong> {organization.location}
      </Typography>
      <Typography mb={1}>
        <strong>Уебсайт:</strong>{' '}
        <a href={organization.website} target="_blank" rel="noopener noreferrer">
          {organization.website}
        </a>
      </Typography>
      <Typography sx={{ whiteSpace: 'pre-line' }}>{organization.description}</Typography>
    </Box>
  );
}
