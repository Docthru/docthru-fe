import axios from './axios';

const PATH = '/users';

export async function getUserMe() {
  const res = await axios.get(`${PATH}/me`);
  return res.data;
}

export async function createUser(data) {
  const res = await axios.post(`${PATH}/register`, data);
  return res.data;
}

export async function createLogin(data) {
  const res = await axios.post(`${PATH}/login`, data, {
    withCredentials: true,
  });
  return res.data;
}

export async function createLogout() {
  const res = await axios.post(
    `${PATH}/logout`,
    {},
    {
      withCredentials: true,
    }
  );
  return res.data;
}
