import { create } from 'zustand'
import axios from 'axios'

const useUserStore = create((set) => ({
  user: null,
  setUser: (userData) => set({ user: userData }),
  fetchUser: async () => {
    try {
      const { data } = await axios.get('/profile')
      set({ user: data })
    } catch (error) {
      console.error("Error fetching user:", error)
    }
  },
  ticketQuantity: 1, // Default quantity
  setTicketQuantity: (quantity) => set({ ticketQuantity: quantity }),
}))

export default useUserStore
