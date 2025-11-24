import React, { createContext, useContext, useEffect, useState } from 'react';
import { type User, onAuthStateChanged } from 'firebase/auth';
import { doc, onSnapshot, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';

interface UserProfile {
  uid: string;
  email: string;
  subscriptionStatus: 'FREE' | 'PREMIUM';
  hasCompletedOnboarding?: boolean; // <--- NUEVO CAMPO
  displayName?: string; // <--- NUEVO CAMPO
}

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  upgradeToPremium: () => Promise<void>;
  completeOnboarding: (data: any) => Promise<void>; // <--- NUEVA FUNCIÓN
}

const AuthContext = createContext<AuthContextType>({ 
  user: null, 
  profile: null, 
  loading: true,
  upgradeToPremium: async () => {},
  completeOnboarding: async () => {}
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      
      if (currentUser) {
        const userRef = doc(db, 'users', currentUser.uid);
        const snap = await getDoc(userRef);
        
        if (!snap.exists()) {
          // Inicializar perfil vacío
          await setDoc(userRef, { 
            email: currentUser.email, 
            subscriptionStatus: 'FREE',
            hasCompletedOnboarding: false,
            createdAt: new Date()
          });
        }

        const unsubscribeSnapshot = onSnapshot(userRef, (doc) => {
          if (doc.exists()) {
            setProfile({ uid: doc.id, ...doc.data() } as UserProfile);
          }
          setLoading(false);
        });
        return () => unsubscribeSnapshot();
      } else {
        setProfile(null);
        setLoading(false);
      }
    });

    return () => unsubscribeAuth();
  }, []);

  const upgradeToPremium = async () => {
    if (!user) return;
    const userRef = doc(db, 'users', user.uid);
    await updateDoc(userRef, { subscriptionStatus: 'PREMIUM' });
  };

  // Función para guardar el onboarding y marcarlo como completado
  const completeOnboarding = async (data: any) => {
    if (!user) return;
    const userRef = doc(db, 'users', user.uid);
    // Guardamos el nombre y marcamos como completado
    await updateDoc(userRef, { 
      hasCompletedOnboarding: true,
      displayName: data.displayName
    });
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, upgradeToPremium, completeOnboarding }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};