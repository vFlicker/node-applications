export const createNewUser = async () => {
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
  return data;
};

export const getUsers = async () => {
  const response = await fetch('http://localhost:8000/api/users');
  const data = await response.json();
  return data;
};

export const login = async () => {
  const response = await fetch('http://localhost:8000/api/login', {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
  });

  const data = await response.json();
  return data;
};

export const logout = async () => {
  await fetch('http://localhost:8000/api/logout', {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
  });
};

export const getProtectedRoute = async () => {
  try {
    const response = await fetch('http://localhost:8000/api/protected', {
      method: 'GET',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
    });

    const data = await response.json();
    return data;
  } catch (err) {
    console.log(err);
  }
};
