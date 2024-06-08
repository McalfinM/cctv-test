import { baseUrl } from "routes/MainRoutes";
import Storage from "utils/storage";

export const user = Storage.get('user');
export const adminAccess = { canEdit: true, canCreate: true, canDelete: true };
export const token = Storage.token()
export const username = user?.userData?.username || ''


const get = async (url) => {
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) {
    const error = new Error('An error occurred while fetching the data.');
    error.info = await response.json();
    error.status = response.status;
    throw error;
  }

  return response.json();
};

// const getData = async (url) => {
//   const response = await fetch(url, {
//     method: 'POST',
//     headers: {
//       Authorization: `Bearer ${token}`
//     }
//   });

//   if (!response.ok) {
//     const error = new Error('An error occurred while fetching the data.');
//     error.info = await response.json();
//     error.status = response.status;
//     throw error;
//   }

//   return response.json();
// };

const post = async (url, data) => {
  const headers = {
    Authorization: `Bearer ${token}`
  };

  if (data) {
    headers['Content-Type'] = 'application/json';
  }

  const options = {
    method: 'POST',
    headers,
    body: data ? JSON.stringify(data) : undefined
  };

  const response = await fetch(url, options);

  console.log(response.ok, 'okee')
  if (!response.ok) {
    const message = await response.json();
    console.error('Error response:', message);
    return Promise.reject(message);
  } else {
    return response.json();
  }

};

export const checkMe = async () => {
  return await fetch(baseUrl + '/api/auth/me', {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
}

export {
  get,
  post
}
// const api = {
//   get,
//   post,
//   getData
// };

// export default api;
