let user = localStorage.getItem('user');
let token = user ? JSON.parse(user)?.token : '';

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
  console.log("🚀 ~ post ~ data:", data)
  console.log("🚀 ~ post ~ url:", url)
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

  if (!response.ok) {
    const error = new Error('An error occurred while posting the data.');
    error.info = await response.json();
    error.status = response.status;
    throw error;
  }

  return response.json();
};

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
