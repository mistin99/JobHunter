import { Box, Drawer, List, ListItem, ListItemButton, ListItemText, Typography } from '@mui/material';
import React from 'react';
import { useNavigate } from 'react-router-dom';

interface SidebarDrawerProps {
  open: boolean;
  handleDrawerToggle: () => void;
  drawerWidth?: number;
}

const SidebarDrawer: React.FC<SidebarDrawerProps> = ({ open, drawerWidth, handleDrawerToggle }) => {
  const navigate = useNavigate();

  const drawerContent = (
    <Box sx={{ width: drawerWidth, mt: '64px', bgcolor: '#F3F4F6', height: 'calc(100vh - 64px)' }}>
      <Typography variant="h6" sx={{ p: 2 }}>
        Menu
      </Typography>
      <List>
        <ListItem disablePadding>
          <ListItemButton onClick={() => { navigate('/'); handleDrawerToggle(); }}>
            <ListItemText primary="Home" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton onClick={() => { navigate('/profile'); handleDrawerToggle(); }}>
            <ListItemText primary="Profile" />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <Drawer
      variant="temporary"
      open={open}
      onClose={handleDrawerToggle}
      sx={{
        width: open ? drawerWidth : 0,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          transition: 'width 0.3s',
          overflowX: 'hidden',
          bgcolor: '#F3F4F6',
          mt: '64px',
          height: 'calc(100vh - 64px)',
        },
      }}
    >
      {open && drawerContent}
    </Drawer>
  );
};

export default SidebarDrawer;
