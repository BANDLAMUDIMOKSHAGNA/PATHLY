import { UserRole, AdminUser } from '../types';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  status?: 'Active' | 'Inactive';
  lastActive?: string;
  college?: string;
}

export interface SignUpFormData {
  fullName: string;
  email: string;
  role: UserRole;
  password: string;
  confirmPassword?: string;
  agreeTerms?: boolean;
}

export interface StoredCredentialUser extends AuthUser {
  passwordHash: string;
}

const DEMO_ADMIN: StoredCredentialUser = {
  id: 'usr-kits-admin',
  name: 'KITS Campus Administrator',
  email: 'admin@kitsguntur.ac.in',
  role: 'admin',
  status: 'Active',
  lastActive: 'Just now',
  avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
  college: 'KITS Guntur Campus',
  passwordHash: 'password123',
};

const SECONDARY_ADMIN: StoredCredentialUser = {
  id: 'usr-pathly-admin',
  name: 'Global Facility Manager',
  email: 'admin@pathly.io',
  role: 'Super Admin',
  status: 'Active',
  lastActive: 'Just now',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  college: 'All Institutions',
  passwordHash: 'indoor2025',
};

const STORAGE_KEY_USER = 'pathly_current_user';
const STORAGE_KEY_AUTH_FLAG = 'pathly_is_authenticated';
const STORAGE_KEY_USERS_DB = 'pathly_registered_accounts';

export const getRegisteredUsers = (): StoredCredentialUser[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_USERS_DB);
    if (!raw) {
      const initial = [DEMO_ADMIN, SECONDARY_ADMIN];
      localStorage.setItem(STORAGE_KEY_USERS_DB, JSON.stringify(initial));
      return initial;
    }
    return JSON.parse(raw);
  } catch {
    return [DEMO_ADMIN, SECONDARY_ADMIN];
  }
};

export const saveRegisteredUsers = (users: StoredCredentialUser[]) => {
  localStorage.setItem(STORAGE_KEY_USERS_DB, JSON.stringify(users));
};

export const getStoredAuthUser = (): AuthUser | null => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_USER);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const isStoredAuthenticated = (): boolean => {
  return localStorage.getItem(STORAGE_KEY_AUTH_FLAG) === 'true' && Boolean(getStoredAuthUser());
};

type AuthListener = (user: AuthUser | null, isAuthenticated: boolean) => void;
const listeners: Set<AuthListener> = new Set();

export const subscribeAuth = (listener: AuthListener) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};

const notifyListeners = (user: AuthUser | null, isAuthenticated: boolean) => {
  listeners.forEach((cb) => {
    try {
      cb(user, isAuthenticated);
    } catch (e) {
      console.error('Error notifying auth listener', e);
    }
  });
  window.dispatchEvent(new CustomEvent('pathly-auth-change', { detail: { user, isAuthenticated } }));
};

export const authStore = {
  getCurrentUser(): AuthUser | null {
    return getStoredAuthUser();
  },

  isAuthenticated(): boolean {
    return isStoredAuthenticated();
  },

  async login(email: string, password: string): Promise<{ success: boolean; user?: AuthUser; error?: string }> {
    // Artificial latency for authentic UX
    await new Promise((resolve) => setTimeout(resolve, 350));

    const cleanEmail = email.trim().toLowerCase();
    const allUsers = getRegisteredUsers();

    // Check pre-seeded accounts and registered accounts
    const match = allUsers.find(
      (u) => u.email.toLowerCase() === cleanEmail && u.passwordHash === password
    );

    if (match) {
      const userPayload: AuthUser = {
        id: match.id,
        name: match.name,
        email: match.email,
        role: match.role,
        avatar: match.avatar,
        status: match.status || 'Active',
        lastActive: 'Just now',
        college: match.college,
      };

      localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(userPayload));
      localStorage.setItem(STORAGE_KEY_AUTH_FLAG, 'true');
      notifyListeners(userPayload, true);
      return { success: true, user: userPayload };
    }

    // Check if email exists with wrong password
    const emailExists = allUsers.some((u) => u.email.toLowerCase() === cleanEmail);
    if (emailExists) {
      return { success: false, error: 'Incorrect password. Please try again.' };
    }

    return {
      success: false,
      error: 'No account found with this email. Please check your credentials or create an account.',
    };
  },

  async signup(formData: SignUpFormData): Promise<{ success: boolean; user?: AuthUser; error?: string }> {
    await new Promise((resolve) => setTimeout(resolve, 400));

    const cleanEmail = formData.email.trim().toLowerCase();
    const allUsers = getRegisteredUsers();

    if (allUsers.some((u) => u.email.toLowerCase() === cleanEmail)) {
      return { success: false, error: 'An account with this email address already exists. Please sign in.' };
    }

    // Normalize avatar generator
    const avatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(formData.fullName)}`;

    const newUser: StoredCredentialUser = {
      id: `usr-${Date.now()}`,
      name: formData.fullName.trim(),
      email: cleanEmail,
      role: formData.role,
      status: 'Active',
      lastActive: 'Just now',
      avatar,
      college: 'KITS Guntur Campus',
      passwordHash: formData.password,
    };

    allUsers.push(newUser);
    saveRegisteredUsers(allUsers);

    const userPayload: AuthUser = {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      avatar: newUser.avatar,
      status: 'Active',
      lastActive: 'Just now',
      college: newUser.college,
    };

    localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(userPayload));
    localStorage.setItem(STORAGE_KEY_AUTH_FLAG, 'true');
    notifyListeners(userPayload, true);

    return { success: true, user: userPayload };
  },

  logout(): void {
    localStorage.removeItem(STORAGE_KEY_USER);
    localStorage.setItem(STORAGE_KEY_AUTH_FLAG, 'false');
    notifyListeners(null, false);
  },

  isUserAdmin(user: AuthUser | null): boolean {
    if (!user) return false;
    const role = (user.role || '').toLowerCase();
    return (
      role === 'admin' ||
      role === 'super admin' ||
      role === 'college admin' ||
      role === 'building manager' ||
      role === 'editor' ||
      role === 'campus administrator'
    );
  },
};
