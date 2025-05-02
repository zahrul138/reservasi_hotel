const API_BASE_URL = "https://localhost:7298/api/user"; 

export const getAllUsers = async () => {
  const response = await fetch(API_BASE_URL);
  return await response.json();
};

export const getUserById = async (id) => {
  const response = await fetch(`${API_BASE_URL}/${id}`);
  return await response.json();
};

export const createUser = async (user) => {
  const response = await fetch(API_BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(user),
  });
  return await response.json();
};

export const updateUser = async (id, user) => {
  await fetch(`${API_BASE_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(user),
  });
};

export const deleteUser = async (id) => {
  await fetch(`${API_BASE_URL}/${id}`, {
    method: "DELETE",
  });
};
