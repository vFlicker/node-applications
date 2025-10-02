import * as apiServices from './apiService.js';

export const checkUsersRoute = async () => {
  const users = await apiServices.getUsers();
  await apiServices.createNewUser();
  const newUsers = await apiServices.getUsers();
  console.log({ users, newUsers });
};

export const checkProtectedRoute = async () => {
  const protectedData = await apiServices.getProtectedRoute();
  console.log('Protected Data before login:', protectedData);

  const loginData = await apiServices.login();
  console.log('Login Data:', loginData);

  const newProtectedData = await apiServices.getProtectedRoute();
  console.log('Protected Data after login:', newProtectedData);

  await apiServices.logout();
  const finalProtectedData = await apiServices.getProtectedRoute();
  console.log('Final Protected Data after logout:', finalProtectedData);
};
