
import { useState, useEffect } from 'react';
import { User, onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '../config/firebase';

export const useFirebaseAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error('Sign up error:', error);
      throw error;
    }
  };

  const signInWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      
      // Check if user is authorized
      const user = result.user;
      if (!isUserAuthorized(user.email)) {
        await signOut(auth);
        throw new Error('Unauthorized: Access restricted to company users only');
      }
    } catch (error) {
      console.error('Google sign in error:', error);
      throw error;
    }
  };

  // Add your company domain or list of allowed emails here
  const isUserAuthorized = (email: string | null): boolean => {
    if (!email) return false;
    
    // Option 1: Restrict by domain (replace with your company domain)
    const allowedDomain = '@yourcompany.com';
    if (email.endsWith(allowedDomain)) return true;
    
    // Option 2: Whitelist specific emails
    const allowedEmails = [
      'arihant@spacesquare.dev',
      'pranadhi.koradia@gmail.com',
      // Add more allowed emails here
    ];
    return allowedEmails.includes(email);
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  };

  return {
    user,
    loading,
    signIn,
    signUp,
    signInWithGoogle,
    logout
  };
};
