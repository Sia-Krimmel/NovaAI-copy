if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

interface RequestOptions extends RequestInit {
  headers: {
    'X-API-KEY': string;
  };
  cache?: RequestCache;
}

// TODO: Replace with exists endpoint
export const getUsersEmails = async () => {
  const reqOptions: RequestOptions = {
    method: 'GET',
    headers: {
      'X-API-KEY': `${process.env.INTDEV_API_KEY}`,
    },
  };

  const request = await fetch(`https://api-nova.onrender.com/api/users`, reqOptions);
  const response = await request.json();
  const emails = response.users.map((user) => user.email);

  return emails;
};
