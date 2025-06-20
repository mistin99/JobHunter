
import axios from 'axios';

interface SignUpData {
  first_name: string;
  last_name: string;
  phone_number: string;
  email: string;
  password: string;
}
interface SignInData {
  email: string;
  password: string;
}

export const signUp = async (data: SignUpData) => {
  return axios.post('http://127.0.0.1:8000/auth/signup', data);
};
export const signIn = async (data: SignInData) => {
  const response = await axios.post('http://127.0.0.1:8000/auth/signin',  data , {
    withCredentials: true
  });

  const accessToken = response.data.token;
  localStorage.setItem('accessToken', accessToken);
  localStorage.setItem('User', JSON.stringify(response.data.user)); 

  return accessToken;
};

export const refresh = async () => {
  return axios.post('http://127.0.0.1:8000/auth/refresh');
};