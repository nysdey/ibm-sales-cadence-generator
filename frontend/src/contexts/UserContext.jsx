import { createContext, useContext, useState, useEffect } from 'react';

const UserContext = createContext();

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export const UserProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(() => {
    // Load from localStorage or default to Owner
    const saved = localStorage.getItem('currentUser');
    return saved ? JSON.parse(saved) : {
      id: '1',
      name: 'Sydney Chin',
      email: 'sydney.chin@ibm.com',
      role: 'Owner',
      region: 'US',
      team: 'Infrastructure Sales'
    };
  });

  // Available users for selection
  const users = [
    {
      id: '1',
      name: 'Sydney Chin',
      email: 'sydney.chin@ibm.com',
      role: 'Owner',
      region: 'US',
      team: 'Infrastructure Sales'
    },
    {
      id: '2',
      name: 'Bob',
      email: 'bob@ibm.com',
      role: 'Owner',
      region: 'US',
      team: 'Infrastructure Sales'
    },
    {
      id: '3',
      name: 'John Manager',
      email: 'john.manager@ibm.com',
      role: 'Manager',
      region: 'US',
      team: 'Infrastructure Sales'
    },
    {
      id: '4',
      name: 'Jane Seller',
      email: 'jane.seller@ibm.com',
      role: 'Seller',
      region: 'US',
      team: 'Infrastructure Sales'
    }
  ];

  // Save to localStorage when user changes
  useEffect(() => {
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
  }, [currentUser]);

  const switchUser = (userId) => {
    const user = users.find(u => u.id === userId);
    if (user) {
      setCurrentUser(user);
    }
  };

  // Permission checks
  const canEdit = (cadence) => {
    if (currentUser.role === 'Owner') return true;
    if (currentUser.role === 'Manager') return true;
    if (currentUser.role === 'Seller') return cadence.created_by === currentUser.id;
    return false;
  };

  const canDelete = (cadence) => {
    if (currentUser.role === 'Owner') return true;
    if (currentUser.role === 'Manager') return cadence.created_by === currentUser.id;
    return false;
  };

  const canPublish = (cadence) => {
    if (currentUser.role === 'Owner') return true;
    if (currentUser.role === 'Manager') return true;
    return false;
  };

  const canViewAll = () => {
    return currentUser.role === 'Owner' || currentUser.role === 'Manager';
  };

  return (
    <UserContext.Provider value={{
      currentUser,
      users,
      switchUser,
      canEdit,
      canDelete,
      canPublish,
      canViewAll
    }}>
      {children}
    </UserContext.Provider>
  );
};

// Made with Bob
