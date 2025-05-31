
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
export const signIn = async ({ email, password }: { email: string; password: string }) => {
  const response = await axios.post('http://127.0.0.1:8000/auth/signin', { email, password }, {
    withCredentials: true 
  });
  
  const accessToken = response.data.token;
  localStorage.setItem('accessToken', accessToken);

  return accessToken;
};