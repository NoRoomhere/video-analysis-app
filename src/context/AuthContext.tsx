import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { auth } from '../firebase';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth';

interface User {
  id: string;
  email: string;
  name: string;
  avatar: string;
  accounts: {
    tiktok: { username: string; followers: string; verified: boolean };
    instagram: { username: string; followers: string; verified: boolean };
  };
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  register: (email: string, password: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        setUser({
          id: firebaseUser.uid,
          email: firebaseUser.email || '',
          name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User',
          avatar: firebaseUser.photoURL || 'https://ui-avatars.com/api/?name=' + (firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User'),
          accounts: {
            tiktok: { username: 'tiktok_user', followers: '10K', verified: true },
            instagram: { username: 'insta_user', followers: '8K', verified: true },
          },
        });
        setIsAuthenticated(true);
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
    });
    return () => unsubscribe();
  }, []);

  const register = async (email: string, password: string) => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
    } catch (error: any) {
      // Convert Firebase error codes to user-friendly messages
      switch (error.code) {
        case 'auth/email-already-in-use':
          throw new Error('Этот email уже зарегистрирован');
        case 'auth/invalid-email':
          throw new Error('Неверный формат email');
        case 'auth/weak-password':
          throw new Error('Пароль должен содержать минимум 6 символов');
        case 'auth/operation-not-allowed':
          throw new Error('Регистрация временно недоступна');
        default:
          throw new Error('Ошибка регистрации: ' + error.message);
      }
    }
  };

  const login = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error: any) {
      // Convert Firebase error codes to user-friendly messages
      switch (error.code) {
        case 'auth/user-not-found':
          throw new Error('Пользователь с таким email не найден');
        case 'auth/wrong-password':
          throw new Error('Неверный пароль');
        case 'auth/invalid-email':
          throw new Error('Неверный формат email');
        case 'auth/user-disabled':
          throw new Error('Аккаунт заблокирован');
        case 'auth/too-many-requests':
          throw new Error('Слишком много попыток входа. Попробуйте позже');
        default:
          throw new Error('Ошибка входа: ' + error.message);
      }
    }
  };

  const logout = async () => {
    await signOut(auth);
  };

  const value = {
    user,
    isAuthenticated,
    register,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 