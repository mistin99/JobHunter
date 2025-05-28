import {
  Box,
  Button,
  Container,
  Menu,
  MenuItem,
  Modal,
  Typography,
} from '@mui/material';
import { useState } from 'react';

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

const jobsData = [
  {
    id: 1,
    title: 'Python Developer',
    company: 'HRS',
    location: 'Remote',
    description: `At HRS we believe the right job can transform a person’s life and the right person can transform a business. We’re passionate about connecting our candidates with the right job for them.

The extensive experience in the human resources industry under our belt has given us valuable insights and extensive knowledge of corporate cultures and thus enabled us to locate the best candidates for our clients.

For our client – an innovative company that integrates AI technologies at the core of its products, creating intelligent systems and personalized software solutions, we are looking for an ambitious Python Developer.

Responsibilities:
Design, develop, and maintain RESTful APIs using Python and Flask
Collaborate with the team to integrate backend systems and external APIs
Write unit tests to ensure code reliability using unittest or similar tools
Support development and maintenance of AWS Lambda functions and serverless components
Work with tools like Google Drive APIs and Slack SDK for third-party integrations
Use Git for version control and participate in regular code reviews
Gain understanding of the product logic and proactively suggest improvements

Our client offers:
Fully remote work and flexible hours
Competitive salary and performance-based rewards
Health insurance (Bulstat +Max) with dental coverage
20 + 5 days paid annual leave
Training, certification, and career development opportunities
Participation in team-building events, sports tournaments, and access to a game room
Opportunity to work with cutting-edge technologies
Dynamic work environment with career growth potential

Requirements:
1.5+ years of professional experience with Python
Experience with Flask or similar Python web frameworks
Experience building or maintaining RESTful APIs
Familiarity with AWS (e.g. Lambda, S3, DynamoDB – hands-on or project-based)
Experience writing and maintaining unit tests
Solid understanding of Git workflows
Ability to work independently on small features and collaborate effectively in a team
Strong willingness to grow technically and product-wise

Don’t miss out on this incredible opportunity – apply now!

Only short-listed candidates will be contacted. All applications will be treated strictly confidential.

HRS Services Bulgaria has License № 2280/22.05.2017 for providing human resources services.`,
  },
  {
    id: 2,
    title: 'Frontend Developer',
    company: 'Tech Corp',
    location: 'Remote',
    description:
      'Build and maintain user-friendly, performant front-end applications using React and TypeScript. Collaborate with UX designers and backend engineers.',
  },
  {
    id: 3,
    title: 'Backend Engineer',
    company: 'Dev Solutions',
    location: 'New York, NY',
    description:
      'Develop scalable backend services and APIs with Node.js, Express, and MongoDB. Ensure high availability and security of the platform.',
  },
  {
    id: 4,
    title: 'Full Stack Developer',
    company: 'Webify',
    location: 'San Francisco, CA',
    description:
      'Work on both client-side and server-side development using React, Node.js, and PostgreSQL. Participate in architecture discussions and code reviews.',
  },
  {
    id: 5,
    title: 'Data Scientist',
    company: 'Insight Analytics',
    location: 'Boston, MA',
    description:
      'Analyze large datasets, build predictive models, and communicate insights to business stakeholders using Python, R, and SQL.',
  },
];

export default function HomePage() {
  const [jobs] = useState(jobsData);
  const [selectedJob, setSelectedJob] = useState(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const registerMenuOpen = Boolean(anchorEl);

  const handleOpen = (job: typeof jobsData[0]) => {
    setSelectedJob(job);
  };

  const handleClose = () => {
    setSelectedJob(null);
  };

  const handleRegisterClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleRegisterClose = () => {
    setAnchorEl(null);
  };

  const handleRegisterSelect = (option: string) => {
    alert(`Register as: ${option}`);
    setAnchorEl(null);
  };

  return (
    <Box sx={{ minHeight: '100vh', minWidth: '100vw', bgcolor: '#f9fafb', py: 4 }}>
      <Container maxWidth="lg">
        {/* Top Navigation */}
        <Box sx={{ position: 'relative', mb: 4, height: 48 }}>
          <Box
            component="h1"
            sx={{
              fontSize: 30,
              fontWeight: 'bold',
              color: '#1d4ed8',
              position: 'absolute',
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)',
              userSelect: 'none',
            }}
          >
            JobHunter
          </Box>

          <Box
            sx={{
              display: 'flex',
              gap: 2,
              justifyContent: 'flex-end',
              alignItems: 'center',
              height: '100%',
            }}
          >
            <Button variant="outlined">Login</Button>
            <Button
              variant="contained"
              onClick={handleRegisterClick}
              aria-controls={registerMenuOpen ? 'register-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={registerMenuOpen ? 'true' : undefined}
            >
              Register
            </Button>
            <Menu
              id="register-menu"
              anchorEl={anchorEl}
              open={registerMenuOpen}
              onClose={handleRegisterClose}
              MenuListProps={{
                'aria-labelledby': 'register-button',
              }}
            >
              <MenuItem onClick={() => handleRegisterSelect('User')}>
                Register as User
              </MenuItem>
              <MenuItem onClick={() => handleRegisterSelect('Organization')}>
                Register as Organization
              </MenuItem>
            </Menu>
          </Box>
        </Box>

        {/* Job Listings */}
        <Box sx={{ maxWidth: 768, mx: 'auto' }}>
          <Box component="h2" sx={{ fontSize: 20, fontWeight: 600, mb: 2 }}>
            Latest Job Listings
          </Box>
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
                onClick={() => handleOpen(job)}
              >
                <Box
                  component="h3"
                  sx={{ fontSize: 18, fontWeight: 'bold', color: '#1f2937' }}
                >
                  {job.title}
                </Box>
                <Box sx={{ fontSize: 14, color: '#4b5563' }}>
                  {job.company} — {job.location}
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
      </Container>

      {/* Job Detail Modal */}
      <Modal
        open={!!selectedJob}
        onClose={handleClose}
        aria-labelledby="job-title"
        aria-describedby="job-description"
      >
        <Box sx={style}>
          {selectedJob && (
            <>
              <Typography
                id="job-title"
                variant="h6"
                component="h2"
                sx={{ mb: 2, color: 'black' }}
              >
                {selectedJob.title} at {selectedJob.company}
              </Typography>
              <Typography
                id="job-location"
                sx={{ mb: 2, color: 'text.secondary' }}
              >
                Location: {selectedJob.location}
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
                {selectedJob.description}
              </Box>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  gap: 1,
                }}
              >
                <Button variant="contained" onClick={handleClose}>
                  Apply
                </Button>
                <Button variant="outlined" onClick={handleClose}>
                  Close
                </Button>
              </Box>
            </>
          )}
        </Box>
      </Modal>
    </Box>
  );
}
