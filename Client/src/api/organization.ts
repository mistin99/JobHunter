import axios from 'axios';

interface OrganizationCreateData {
    name: string;
    email: string;
    website_url: string;
    description: string;
    address: AddressData
}

interface AddressData {
    street_line1: string;
    street_line2: string;
    city: string;
    country: string;
    zip_code: string;
}

const accessToken = localStorage.getItem('accessToken');
export const createOrg = async (data: OrganizationCreateData) => {
    return axios.post('http://127.0.0.1:8000/organizations/create', data, {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
        }
    });
};

export const GetAllOrganizations = async () => {
    return axios.post('http://127.0.0.1:8000/organizations/', {}, {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
        }
    });
}


export const GetOrganization = async (id: number) => {
    return axios.post('http://127.0.0.1:8000/organizations/', { id: id - 1 }, {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
        }
    });
}
