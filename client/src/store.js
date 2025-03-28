import { create } from 'zustand';
import axios from 'axios';

const useUserStore = create((set) => ({
  user: null,
  ticketQuantity: 1, // Default quantity

  // Set user data
  setUser: (userData) => set({ user: userData }),

  // Fetch user data from the server
  fetchUser:  async () => {
    try {
      const { data } = await axios.get('/profile');
      set({ user: data });
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  },

  // Set ticket quantity
  setTicketQuantity: (quantity) => set({ ticketQuantity: quantity }),

  // Check if the user is an admin
  isAdmin: () => set((state) => state.user?.role === 'admin'),

  // Check if the user is an organizer
  isOrganizer: () => set((state) => state.user?.role === 'organizer'),

  // Check if the user is a regular user
  isUser:  () => set((state) => state.user?.role === 'user'),
}));

export default useUserStore;