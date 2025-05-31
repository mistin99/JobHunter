import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    TextField,
    Typography
} from '@mui/material';
import React, { useEffect, useState } from 'react';

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (org: OrganizationData, address: AddressData) => void;
}

interface OrganizationData {
  name: string;
  email: string;
  phone_number: string;
  website_url: string;
  description: string;
}

interface AddressData {
  street_line1: string;
  street_line2: string;
  city: string;
  country: string;
  zip_code: string;
}

const CreateOrganizationModal: React.FC<Props> = ({ open, onClose, onSubmit }) => {
  const [organizationData, setOrganizationData] = useState<OrganizationData>({
    name: '',
    email: '',
    phone_number: '',
    website_url: '',
    description: '',
  });

  const [addressData, setAddressData] = useState<AddressData>({
    street_line1: '',
    street_line2: '',
    city: '',
    country: '',
    zip_code: '',
  });

  const handleOrganizationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOrganizationData({ ...organizationData, [e.target.name]: e.target.value });
  };

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAddressData({ ...addressData, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    onSubmit(organizationData, addressData);
    onClose();
  };

  useEffect(() => {
    if (!open) {
      // Reset the form when closing
      setOrganizationData({
        name: '',
        email: '',
        phone_number: '',
        website_url: '',
        description: '',
      });
      setAddressData({
        street_line1: '',
        street_line2: '',
        city: '',
        country: '',
        zip_code: '',
      });
    }
  }, [open]);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Create Organization</DialogTitle>
      <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
        <TextField label="Name" name="name" value={organizationData.name} onChange={handleOrganizationChange} fullWidth />
        <TextField label="Email" name="email" value={organizationData.email} onChange={handleOrganizationChange} fullWidth />
        <TextField label="Phone Number" name="phone_number" value={organizationData.phone_number} onChange={handleOrganizationChange} fullWidth />
        <TextField label="Website URL" name="website_url" value={organizationData.website_url} onChange={handleOrganizationChange} fullWidth />
        <TextField label="Description" name="description" value={organizationData.description} onChange={handleOrganizationChange} fullWidth multiline rows={3} />

        <Divider sx={{ my: 2 }} />
        <Typography variant="subtitle1">Address</Typography>
        <TextField label="Street Line 1" name="street_line1" value={addressData.street_line1} onChange={handleAddressChange} fullWidth />
        <TextField label="Street Line 2" name="street_line2" value={addressData.street_line2} onChange={handleAddressChange} fullWidth />
        <TextField label="City" name="city" value={addressData.city} onChange={handleAddressChange} fullWidth />
        <TextField label="Country" name="country" value={addressData.country} onChange={handleAddressChange} fullWidth />
        <TextField label="Postal Code" name="zip_code" value={addressData.zip_code} onChange={handleAddressChange} fullWidth />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSubmit}>Create</Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateOrganizationModal;
