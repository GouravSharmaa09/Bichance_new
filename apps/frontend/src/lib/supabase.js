import { createClient } from '@supabase/supabase-js'

// These environment variables should be set in your .env file
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Check if Supabase is configured
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase not configured. Running in mock mode. Please set REACT_APP_SUPABASE_URL and REACT_APP_SUPABASE_ANON_KEY in your .env file')
}

// Create Supabase client only if configured - DISABLE FOR NOW TO AVOID WEBSOCKET ERRORS
export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey, {
      realtime: {
        params: {
          eventsPerSecond: 10
        }
      }
    })
  : null

// Database table names
export const TABLES = {
  USERS: 'users',
  PROFILES: 'profiles', 
  DINNERS: 'dinners',
  BOOKINGS: 'bookings',
  RESTAURANTS: 'restaurants',
  MATCHES: 'matches',
  REVIEWS: 'reviews',
  WAITLIST: 'waitlist'
}

// Auth helpers
export const auth = {
  signUp: async (email, password, userData = {}) => {
    if (!supabase) {
      return { data: { user: { id: 'mock-user-id', email } }, error: null }
    }
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userData
      }
    })
    return { data, error }
  },

  signIn: async (email, password) => {
    if (!supabase) {
      return { data: { user: { id: 'mock-user-id', email } }, error: null }
    }
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    return { data, error }
  },

  signOut: async () => {
    if (!supabase) {
      return { error: null }
    }
    
    const { error } = await supabase.auth.signOut()
    return { error }
  },

  getUser: async () => {
    if (!supabase) {
      return { user: null, error: null }
    }
    
    const { data: { user }, error } = await supabase.auth.getUser()
    return { user, error }
  },

  getSession: async () => {
    if (!supabase) {
      return { session: null, error: null }
    }
    
    const { data: { session }, error } = await supabase.auth.getSession()
    return { session, error }
  },

  onAuthStateChange: (callback) => {
    if (!supabase) {
      return { data: { subscription: null } }
    }
    
    return supabase.auth.onAuthStateChange(callback)
  }
}

// Database helpers
export const db = {
  // Users
  createUser: async (userData) => {
    if (!supabase) {
      return { data: [userData], error: null }
    }
    
    const { data, error } = await supabase
      .from(TABLES.USERS)
      .insert([userData])
      .select()
    return { data, error }
  },

  getUser: async (userId) => {
    if (!supabase) {
      return { data: null, error: null }
    }
    
    const { data, error } = await supabase
      .from(TABLES.USERS)
      .select('*')
      .eq('id', userId)
      .single()
    return { data, error }
  },

  updateUser: async (userId, updates) => {
    if (!supabase) {
      return { data: [updates], error: null }
    }
    
    const { data, error } = await supabase
      .from(TABLES.USERS)
      .update(updates)
      .eq('id', userId)
      .select()
    return { data, error }
  },

  // Profiles
  createProfile: async (profileData) => {
    if (!supabase) {
      return { data: [profileData], error: null }
    }
    
    const { data, error } = await supabase
      .from(TABLES.PROFILES)
      .insert([profileData])
      .select()
    return { data, error }
  },

  getProfile: async (userId) => {
    if (!supabase) {
      return { data: null, error: null }
    }
    
    const { data, error } = await supabase
      .from(TABLES.PROFILES)
      .select('*')
      .eq('user_id', userId)
      .single()
    return { data, error }
  },

  updateProfile: async (userId, updates) => {
    if (!supabase) {
      return { data: [updates], error: null }
    }
    
    const { data, error } = await supabase
      .from(TABLES.PROFILES)
      .update(updates)
      .eq('user_id', userId)
      .select()
    return { data, error }
  },

  // Dinners
  createDinner: async (dinnerData) => {
    const { data, error } = await supabase
      .from(TABLES.DINNERS)
      .insert([dinnerData])
      .select()
    return { data, error }
  },

  getDinners: async (filters = {}) => {
    let query = supabase.from(TABLES.DINNERS).select('*')
    
    if (filters.city) {
      query = query.eq('city', filters.city)
    }
    if (filters.date) {
      query = query.eq('date', filters.date)
    }
    if (filters.status) {
      query = query.eq('status', filters.status)
    }

    const { data, error } = await query
    return { data, error }
  },

  // Bookings
  createBooking: async (bookingData) => {
    const { data, error } = await supabase
      .from(TABLES.BOOKINGS)
      .insert([bookingData])
      .select()
    return { data, error }
  },

  getUserBookings: async (userId) => {
    const { data, error } = await supabase
      .from(TABLES.BOOKINGS)
      .select(`
        *,
        dinners (
          id,
          date,
          time,
          restaurant:restaurants(name, address),
          city,
          status
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
    return { data, error }
  },

  // Restaurants
  getRestaurants: async (city = null) => {
    let query = supabase.from(TABLES.RESTAURANTS).select('*')
    
    if (city) {
      query = query.eq('city', city)
    }

    const { data, error } = await query
    return { data, error }
  },

  // Waitlist
  addToWaitlist: async (waitlistData) => {
    const { data, error } = await supabase
      .from(TABLES.WAITLIST)
      .insert([waitlistData])
      .select()
    return { data, error }
  },

  getWaitlistByPhone: async (phoneNumber) => {
    const { data, error } = await supabase
      .from(TABLES.WAITLIST)
      .select('*')
      .eq('phone_number', phoneNumber)
      .single()
    return { data, error }
  },

  // Reviews
  createReview: async (reviewData) => {
    const { data, error } = await supabase
      .from(TABLES.REVIEWS)
      .insert([reviewData])
      .select()
    return { data, error }
  },

  getDinnerReviews: async (dinnerId) => {
    const { data, error } = await supabase
      .from(TABLES.REVIEWS)
      .select('*')
      .eq('dinner_id', dinnerId)
    return { data, error }
  }
}

// Realtime subscriptions
export const subscriptions = {
  subscribeToDinners: (callback) => {
    return supabase
      .channel('dinners')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: TABLES.DINNERS }, 
        callback
      )
      .subscribe()
  },

  subscribeToBookings: (userId, callback) => {
    return supabase
      .channel('user_bookings')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: TABLES.BOOKINGS,
          filter: `user_id=eq.${userId}`
        }, 
        callback
      )
      .subscribe()
  },

  unsubscribe: (subscription) => {
    return supabase.removeChannel(subscription)
  }
}

// Storage helpers (for profile pictures, etc.)
export const storage = {
  uploadFile: async (bucket, path, file) => {
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, file)
    return { data, error }
  },

  downloadFile: async (bucket, path) => {
    const { data, error } = await supabase.storage
      .from(bucket)
      .download(path)
    return { data, error }
  },

  getPublicUrl: (bucket, path) => {
    const { data } = supabase.storage
      .from(bucket)
      .getPublicUrl(path)
    return data.publicUrl
  },

  deleteFile: async (bucket, path) => {
    const { data, error } = await supabase.storage
      .from(bucket)
      .remove([path])
    return { data, error }
  }
}

export default supabase