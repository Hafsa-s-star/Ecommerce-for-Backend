const SESSION_KEY = 'freshmarket-session';

import axios from 'axios';

export const api = axios.create({
  baseURL: import.meta.env.API_URL || (import.meta.env.DEV ? '/api' : 'https://ecommerce-for-backend-wjvg.vercel.app/api'),
  withCredentials: true,
});

export function normalizeUser(user) {
  return {
    id: user.id ?? user._id,
    name: user.username ?? user.name,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt,
  };
}

export function readSession() {
  try {
    const session = JSON.parse(localStorage.getItem(SESSION_KEY) || 'null');
    if (session && session.id && (session.role === 'admin' || session.role === 'user')) return session;
  } catch (error) {
    console.error('Unable to restore the FreshMarket session.', error);
  }
  return null;
}

export function storeSession(user) {
  const session = normalizeUser(user);
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  return session;
}

export function clearSession() {
  localStorage.removeItem(SESSION_KEY);
}
