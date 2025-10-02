import { checkProtectedRoute, checkUsersRoute } from './scenarios.js';

const main = async () => {
  await checkUsersRoute();
  await checkProtectedRoute();
};

main();
