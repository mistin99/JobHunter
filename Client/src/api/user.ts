import axios from 'axios';

const accessToken = localStorage.getItem('accessToken');

export const uploadResume = async (formData: FormData) => {
    return axios.post('http://127.0.0.1:8000/users/resumes/upload', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${accessToken}`,
        },
        withCredentials: true,
    });
};

export const getMyResumes = async () => {
    return axios.get('http://127.0.0.1:8000/users/resumes/2', {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });
};
