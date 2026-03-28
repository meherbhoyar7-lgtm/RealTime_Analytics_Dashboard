/**
 * Frontend-only authentication service.
 * Uses localStorage as the "database" for registered users.
 * Passwords are encoded (not plain text) for basic obfuscation.
 */

const USERS_KEY = "nexusboard_registered_users";

// Simple encode/decode for password obfuscation (frontend-only, not real security)
const encode = (str) => btoa(encodeURIComponent(str));
const decode = (str) => {
  try {
    return decodeURIComponent(atob(str));
  } catch {
    return null;
  }
};

/** Get all registered users from localStorage */
const getRegisteredUsers = () => {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY)) || [];
  } catch {
    return [];
  }
};

/** Save the users array back to localStorage */
const saveRegisteredUsers = (users) => {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

/**
 * Register a new user.
 * @returns {{ success: boolean, error?: string, user?: object }}
 */
export const registerUser = ({ name, email, password, avatar }) => {
  const users = getRegisteredUsers();

  // Check if email already exists
  const exists = users.find(
    (u) => u.email.toLowerCase() === email.toLowerCase()
  );
  if (exists) {
    return { success: false, error: "An account with this email already exists" };
  }

  const newUser = {
    id: crypto.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2)}`,
    name,
    email: email.toLowerCase(),
    password: encode(password),
    avatar: avatar || null,
    createdAt: new Date().toISOString(),
  };

  users.push(newUser);
  saveRegisteredUsers(users);

  // Return user without password
  const { password: _, ...safeUser } = newUser;
  return { success: true, user: safeUser };
};

/**
 * Authenticate a user with email + password.
 * @returns {{ success: boolean, error?: string, user?: object }}
 */
export const authenticateUser = (email, password) => {
  const users = getRegisteredUsers();

  const user = users.find(
    (u) => u.email.toLowerCase() === email.toLowerCase()
  );

  if (!user) {
    return { success: false, error: "No account found with this email. Please register first." };
  }

  const decodedPw = decode(user.password);
  if (decodedPw !== password) {
    return { success: false, error: "Incorrect password. Please try again." };
  }

  // Return user without password
  const { password: _, ...safeUser } = user;
  return { success: true, user: safeUser };
};

/**
 * Check if any users are registered.
 */
export const hasRegisteredUsers = () => {
  return getRegisteredUsers().length > 0;
};

/**
 * Get the count of registered users.
 */
export const getRegisteredUserCount = () => {
  return getRegisteredUsers().length;
};
