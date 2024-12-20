import { sha256 } from 'js-sha256';

const users = [
  {
    id: 1,
    username: 'admin',
    password: 'admin123',
    displayName: 'Администратор'
  },
  {
    id: 2,
    username: 'user',
    password: 'user123',
    displayName: 'Пользователь'
  }
];

const AUTH_TOKEN_KEY = 'auth_token';

export const login = async (username, password) => {
  await new Promise(resolve => setTimeout(resolve, 500)); // имитация задержки API

  const user = users.find(u => u.username === username && u.password === password);
  
  if (!user) {
    throw new Error('Неверный логин или пароль');
  }

  const token = generateToken(user);
  localStorage.setItem(AUTH_TOKEN_KEY, token);
  
  return {
    id: user.id,
    username: user.username,
    displayName: user.displayName
  };
};

export const logout = () => {
  localStorage.removeItem(AUTH_TOKEN_KEY);
};

export const getCurrentUser = () => {
  const token = localStorage.getItem(AUTH_TOKEN_KEY);
  if (!token) return null;

  try {
    const [userId, hash] = token.split('.');
    const user = users.find(u => u.id === parseInt(userId));
    if (!user) return null;

    const expectedHash = sha256(`${user.id}${user.username}${user.displayName}`);
    if (hash !== expectedHash) {
      logout();
      return null;
    }

    return {
      id: user.id,
      username: user.username,
      displayName: user.displayName
    };
  } catch (error) {
    logout();
    return null;
  }
};

const generateToken = (user) => {
  const hash = sha256(`${user.id}${user.username}${user.displayName}`);
  return `${user.id}.${hash}`;
};
