import { loginVCSA, vCenter } from 'ts-vcenter';

export const loginvCSA = async () => {
  const token = await loginVCSA({
    username: 'admin',
    url: 'https://vcsa.example.com',
    password: 'password',
  });
  return new vCenter({ url: 'https://vcsa.example.com', token });
};
