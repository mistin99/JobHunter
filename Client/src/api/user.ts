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
    const accessToken = localStorage.getItem('accessToken');
    const userId = localStorage.getItem('User_id');

    if (!accessToken) {
        throw new Error('No access token found');
    }
    if (!userId) {
        throw new Error('No user ID found');
    }

    const response = await axios.post('http://127.0.0.1:8000/users/resumes/', {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });

    const myResumes = response.data.filter((resume: any) => resume.user_id.toString() === userId);

    return myResumes;
};

