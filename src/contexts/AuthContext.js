import { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const login = (userData) => {
    console.log('UserData after login:', userData);
    setUser(userData);
    setIsLoggingIn(true);
  };

  const logout = () => {
    setUser(null);
    setIsLoggingIn(false);
  };

  const updateUserProfile = async (userID, email, password, firstName, lastName, dateOfBirth) => {
    try {
      const response = await fetch('http://localhost:5000/update-profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userID, email, password, firstName, lastName, dateOfBirth }),
      });

      if (response.ok) {
        const responseData = await response.json();
        if (responseData.success) {
          console.log('Mise à jour du profil réussie');
          // Mettez à jour le contexte d'authentification avec les nouvelles informations de l'utilisateur si nécessaire
          setUser((prevUser) => ({
            ...prevUser,
            userData: {
              ...prevUser.userData,
              Email: email,
              FirstName: firstName,
              LastName: lastName,
              DateOfBirth: dateOfBirth,
            },
          }));
        } else {
          console.error('Erreur lors de la mise à jour du profil:', responseData.error);
        }
      } else {
        const errorData = await response.json();
        console.error('Erreur lors de la mise à jour du profil:', errorData.error);
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour du profil:', error.message);
    }
  };

  const updatePassword = async (userID, currentPassword, newPassword) => {
    try {
      const response = await fetch('http://localhost:5000/update-password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userID, currentPassword, newPassword }),
      });
  
      if (response.ok) {
        const responseData = await response.json();
        if (responseData.success) {
          console.log('Mot de passe mis à jour avec succès');
        } else {
          console.error('Erreur lors de la mise à jour du mot de passe:', responseData.error);
        }
      } else {
        const errorData = await response.json();
        console.error('Erreur lors de la mise à jour du mot de passe:', errorData.error);
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour du mot de passe:', error.message);
    }
  };
  
  // Ajoutez cette fonction à votre contexte d'authentification
  return (
    <AuthContext.Provider value={{ user, login, logout, isLoggingIn, setIsLoggingIn, updateUserProfile, updatePassword }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};

