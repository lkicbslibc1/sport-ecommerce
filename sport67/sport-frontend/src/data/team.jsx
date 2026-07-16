import { createContext, useContext, useState, useEffect } from "react";

// API base URL - pointing to our new Express backend
const API_BASE_URL = "http://localhost:5000/api";

// API functions for team members
const teamAPI = {
  getAll: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/users`);
      if (!response.ok) throw new Error('Failed to fetch users');
      const allUsers = await response.json();
      // Filter only managers and employees
      return allUsers.filter(u => u.role === 'manager' || u.role === 'employee');
    } catch (error) {
      console.error("API error, falling back to empty array:", error);
      return [];
    }
  },

  add: async (member) => {
    try {
      const response = await fetch(`${API_BASE_URL}/users`);
      const allUsers = await response.json();
      const newMember = { ...member, id: Date.now() };
      const updated = [...allUsers, newMember];
      
      await fetch(`${API_BASE_URL}/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated)
      });
      return newMember;
    } catch (error) {
      console.error("API error adding member:", error);
      throw error;
    }
  },

  update: async (id, updatedMember) => {
    try {
      const response = await fetch(`${API_BASE_URL}/users`);
      const allUsers = await response.json();
      const updated = allUsers.map(m => m.id === id ? { ...m, ...updatedMember } : m);
      
      await fetch(`${API_BASE_URL}/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated)
      });
      return { id, ...updatedMember };
    } catch (error) {
      console.error("API error updating member:", error);
      throw error;
    }
  },

  delete: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/users`);
      const allUsers = await response.json();
      const updated = allUsers.filter(m => m.id !== id);
      
      await fetch(`${API_BASE_URL}/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated)
      });
      return true;
    } catch (error) {
      console.error("API error deleting member:", error);
      throw error;
    }
  }
};

// API functions for customers
const customerAPI = {
  getAll: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/users`);
      if (!response.ok) throw new Error('Failed to fetch users');
      const allUsers = await response.json();
      // Filter only customers
      return allUsers.filter(u => u.role === 'customer' || !u.role);
    } catch (error) {
      console.error("API error, falling back to empty array:", error);
      return [];
    }
  },

  delete: async (email) => {
    try {
      const response = await fetch(`${API_BASE_URL}/users`);
      const allUsers = await response.json();
      const updated = allUsers.filter(c => c.email !== email);
      
      await fetch(`${API_BASE_URL}/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated)
      });
      return true;
    } catch (error) {
      console.error("API error deleting customer:", error);
      throw error;
    }
  }
};

// Team Context
const TeamContext = createContext(null);

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