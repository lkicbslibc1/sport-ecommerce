import { createContext, useContext, useState, useEffect } from "react";

// API base URL - can be configured for different environments
const API_BASE_URL = "http://localhost:3001/api";

// API functions for team members
const teamAPI = {
  getAll: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/team`);
      if (!response.ok) throw new Error('Failed to fetch team');
      return await response.json();
    } catch (error) {
      console.error("API error, falling back to localStorage:", error);
      // Fallback to localStorage if API fails
      const stored = localStorage.getItem('gogo_staff');
      return stored ? JSON.parse(stored) : [];
    }
  },

  add: async (member) => {
    try {
      const response = await fetch(`${API_BASE_URL}/team`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(member)
      });
      if (!response.ok) throw new Error('Failed to add team member');
      return await response.json();
    } catch (error) {
      console.error("API error, using localStorage:", error);
      // Fallback to localStorage
      const stored = JSON.parse(localStorage.getItem('gogo_staff') || '[]');
      const newMember = { ...member, id: Date.now() };
      const updated = [...stored, newMember];
      localStorage.setItem('gogo_staff', JSON.stringify(updated));
      return newMember;
    }
  },

  update: async (id, updatedMember) => {
    try {
      const response = await fetch(`${API_BASE_URL}/team/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedMember)
      });
      if (!response.ok) throw new Error('Failed to update team member');
      return await response.json();
    } catch (error) {
      console.error("API error, using localStorage:", error);
      // Fallback to localStorage
      const stored = JSON.parse(localStorage.getItem('gogo_staff') || '[]');
      const updated = stored.map(m => m.id === id ? { ...m, ...updatedMember } : m);
      localStorage.setItem('gogo_staff', JSON.stringify(updated));
      return { id, ...updatedMember };
    }
  },

  delete: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/team/${id}`, {
        method: 'DELETE'
      });
      if (!response.ok) throw new Error('Failed to delete team member');
      return true;
    } catch (error) {
      console.error("API error, using localStorage:", error);
      // Fallback to localStorage
      const stored = JSON.parse(localStorage.getItem('gogo_staff') || '[]');
      const updated = stored.filter(m => m.id !== id);
      localStorage.setItem('gogo_staff', JSON.stringify(updated));
      return true;
    }
  }
};

// API functions for customers
const customerAPI = {
  getAll: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/customers`);
      if (!response.ok) throw new Error('Failed to fetch customers');
      return await response.json();
    } catch (error) {
      console.error("API error, falling back to localStorage:", error);
      // Fallback to localStorage
      const stored = localStorage.getItem('gogo_users');
      return stored ? JSON.parse(stored) : [];
    }
  },

  delete: async (email) => {
    try {
      const response = await fetch(`${API_BASE_URL}/customers/${encodeURIComponent(email)}`, {
        method: 'DELETE'
      });
      if (!response.ok) throw new Error('Failed to delete customer');
      return true;
    } catch (error) {
      console.error("API error, using localStorage:", error);
      // Fallback to localStorage
      const stored = JSON.parse(localStorage.getItem('gogo_users') || '[]');
      const updated = stored.filter(c => c.email !== email);
      localStorage.setItem('gogo_users', JSON.stringify(updated));
      return true;
    }
  }
};

// Team Context
const TeamContext = createContext(null);

// Export the context for direct use with useContext
export { TeamContext };

// Custom hook to use team context
export function useTeam() {
  const context = useContext(TeamContext);
  if (!context) {
    throw new Error('useTeam must be used within a TeamProvider');
  }
  return context;
}

// Team Provider Component
export function TeamProvider({ children }) {
  const [team, setTeam] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch data on mount
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const [teamData, customerData] = await Promise.all([
        teamAPI.getAll(),
        customerAPI.getAll()
      ]);
      setTeam(teamData);
      setCustomers(customerData);
      setLoading(false);
    };

    fetchData();
  }, []);

  // Listen for storage changes from other tabs/windows (fallback sync)
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'gogo_staff') {
        try {
          const updated = JSON.parse(e.newValue);
          if (updated) {
            setTeam(updated);
          }
        } catch (err) {
          console.error("Failed to parse storage event", err);
        }
      }
      if (e.key === 'gogo_users') {
        try {
          const updated = JSON.parse(e.newValue);
          if (updated) {
            setCustomers(updated);
          }
        } catch (err) {
          console.error("Failed to parse storage event", err);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Poll to keep data synchronized (fallback)
  useEffect(() => {
    const interval = setInterval(async () => {
      const [teamData, customerData] = await Promise.all([
        teamAPI.getAll(),
        customerAPI.getAll()
      ]);
      setTeam(teamData);
      setCustomers(customerData);
    }, 30000); // Poll every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const addTeamMember = async (member) => {
    const newMember = await teamAPI.add(member);
    setTeam(prev => [...prev, newMember]);
  };

  const updateTeamMember = async (updatedMember) => {
    await teamAPI.update(updatedMember.id, updatedMember);
    setTeam(prev => {
      const index = prev.findIndex(m => m.id === updatedMember.id);
      if (index !== -1) {
        const newTeam = [...prev];
        newTeam[index] = { ...prev[index], ...updatedMember };
        return newTeam;
      }
      return prev;
    });
  };

  const deleteTeamMember = async (id) => {
    await teamAPI.delete(id);
    setTeam(prev => prev.filter(m => m.id !== id));
  };

  const deleteCustomer = async (email) => {
    await customerAPI.delete(email);
    setCustomers(prev => prev.filter(c => c.email !== email));
  };

  const refreshTeam = async () => {
    const [teamData, customerData] = await Promise.all([
      teamAPI.getAll(),
      customerAPI.getAll()
    ]);
    setTeam(teamData);
    setCustomers(customerData);
  };

  return (
    <TeamContext.Provider value={{
      team,
      customers,
      loading,
      addTeamMember,
      updateTeamMember,
      deleteTeamMember,
      deleteCustomer,
      refreshTeam
    }}>
      {children}
    </TeamContext.Provider>
  );
}