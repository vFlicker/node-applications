const createNewUser = async () => {
  const response = await fetch('http://localhost:8000/api/users', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      username: 'John Doe',
      age: 30,
      hobbies: ['reading', 'coding'],
    }),
  });

  const data = await response.json();
  console.log('Create User Response:', data);
};

const getUsers = async () => {
  const response = await fetch('http://localhost:8000/api/users');
  const data = await response.json();
  console.log('Get Users Response:', data);
};

const main = async () => {
  await createNewUser();
  await getUsers();
};

main();
