import axios from 'axios';

interface ApplyJobPayload {
    resume_id: number;
    job_offer_id: number;
}


const accessToken = localStorage.getItem('accessToken');
export const GetOrganizationJobOffers = async (id: number) => {
    return axios.post('http://127.0.0.1:8000/job-offers/', { id: id - 1 }, {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
        }
    });
}

export const GetAllJobOffers = async () => {
    return axios.post('http://127.0.0.1:8000/job-offers/', {}, {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
        }
    });
}

export const CreateJobOffer = async (jobOfferData: {
    title: string;
    description: string;
    tags: string[];
}) => {
    return axios.post(
        "http://localhost:8000/job-offers/create",
        jobOfferData,
        {
            withCredentials: true,
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${accessToken}`,
            }
        }
    );
};

export const GetJobOfferById = (id: number) => {
    return axios.post('http://127.0.0.1:8000/job-offers/', { id: id - 1 }, {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
        }
    });
};

export const applyToJob = async ({ resume_id, job_offer_id }: ApplyJobPayload) => {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
        throw new Error('No access token found');
    }

    try {
        const response = await axios.post(
            'http://127.0.0.1:8000/job-offers/apply',
            {
                resume_id,
                job_offer_id,
            },
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
            }
        );

        return response.data;
    } catch (error) {
        throw error;
    }
};