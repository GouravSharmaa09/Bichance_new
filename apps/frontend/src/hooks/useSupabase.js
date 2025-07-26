import { useState, useEffect } from 'react'
import { db, subscriptions } from '../lib/supabase'
import toast from 'react-hot-toast'

// Hook for fetching and managing dinners
export const useDinners = (filters = {}) => {
  const [dinners, setDinners] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchDinners = async () => {
    setLoading(true)
    try {
      const { data, error } = await db.getDinners(filters)
      if (error) throw error
      setDinners(data || [])
      setError(null)
    } catch (err) {
      console.error('Error fetching dinners:', err)
      setError(err.message)
      toast.error('Failed to load dinners')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDinners()
  }, [JSON.stringify(filters)])

  // Subscribe to real-time updates
  useEffect(() => {
    const subscription = subscriptions.subscribeToDinners((payload) => {
      console.log('Dinner update:', payload)
      fetchDinners() // Refetch data on any change
    })

    return () => {
      subscriptions.unsubscribe(subscription)
    }
  }, [])

  const createDinner = async (dinnerData) => {
    try {
      const { data, error } = await db.createDinner({
        ...dinnerData,
        created_at: new Date().toISOString()
      })
      
      if (error) throw error
      
      toast.success('Dinner created successfully!')
      fetchDinners() // Refresh the list
      return { success: true, data }
    } catch (err) {
      console.error('Error creating dinner:', err)
      toast.error('Failed to create dinner')
      return { success: false, error: err }
    }
  }

  return {
    dinners,
    loading,
    error,
    fetchDinners,
    createDinner
  }
}

// Hook for managing user bookings
export const useBookings = (userId) => {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchBookings = async () => {
    if (!userId) {
      setLoading(false)
      return
    }

    setLoading(true)
    try {
      const { data, error } = await db.getUserBookings(userId)
      if (error) throw error
      setBookings(data || [])
      setError(null)
    } catch (err) {
      console.error('Error fetching bookings:', err)
      setError(err.message)
      toast.error('Failed to load bookings')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBookings()
  }, [userId])

  // Subscribe to real-time booking updates for this user
  useEffect(() => {
    if (!userId) return

    const subscription = subscriptions.subscribeToBookings(userId, (payload) => {
      console.log('Booking update:', payload)
      fetchBookings() // Refetch data on any change
    })

    return () => {
      subscriptions.unsubscribe(subscription)
    }
  }, [userId])

  const createBooking = async (dinnerId, additionalData = {}) => {
    if (!userId) {
      toast.error('Please log in to book a dinner')
      return { success: false, error: 'No user ID' }
    }

    try {
      const bookingData = {
        user_id: userId,
        dinner_id: dinnerId,
        status: 'confirmed',
        created_at: new Date().toISOString(),
        ...additionalData
      }

      const { data, error } = await db.createBooking(bookingData)
      
      if (error) throw error
      
      toast.success('Dinner booked successfully!')
      fetchBookings() // Refresh the list
      return { success: true, data }
    } catch (err) {
      console.error('Error creating booking:', err)
      toast.error('Failed to book dinner')
      return { success: false, error: err }
    }
  }

  return {
    bookings,
    loading,
    error,
    fetchBookings,
    createBooking
  }
}

// Hook for managing restaurants
export const useRestaurants = (city = null) => {
  const [restaurants, setRestaurants] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchRestaurants = async () => {
    setLoading(true)
    try {
      const { data, error } = await db.getRestaurants(city)
      if (error) throw error
      setRestaurants(data || [])
      setError(null)
    } catch (err) {
      console.error('Error fetching restaurants:', err)
      setError(err.message)
      toast.error('Failed to load restaurants')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRestaurants()
  }, [city])

  return {
    restaurants,
    loading,
    error,
    fetchRestaurants
  }
}

// Hook for managing waitlist
export const useWaitlist = () => {
  const [loading, setLoading] = useState(false)

  const addToWaitlist = async (waitlistData) => {
    setLoading(true)
    try {
      const { data, error } = await db.addToWaitlist({
        ...waitlistData,
        created_at: new Date().toISOString(),
        status: 'waiting'
      })
      
      if (error) throw error
      
      toast.success('Added to waitlist successfully!')
      return { success: true, data }
    } catch (err) {
      console.error('Error adding to waitlist:', err)
      toast.error('Failed to add to waitlist')
      return { success: false, error: err }
    } finally {
      setLoading(false)
    }
  }

  const checkWaitlistStatus = async (phoneNumber) => {
    setLoading(true)
    try {
      const { data, error } = await db.getWaitlistByPhone(phoneNumber)
      
      if (error && error.code !== 'PGRST116') { // Not found is okay
        throw error
      }
      
      return { success: true, data }
    } catch (err) {
      console.error('Error checking waitlist:', err)
      return { success: false, error: err }
    } finally {
      setLoading(false)
    }
  }

  return {
    loading,
    addToWaitlist,
    checkWaitlistStatus
  }
}

// Hook for reviews
export const useReviews = (dinnerId = null) => {
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchReviews = async () => {
    if (!dinnerId) return

    setLoading(true)
    try {
      const { data, error } = await db.getDinnerReviews(dinnerId)
      if (error) throw error
      setReviews(data || [])
      setError(null)
    } catch (err) {
      console.error('Error fetching reviews:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const createReview = async (reviewData) => {
    setLoading(true)
    try {
      const { data, error } = await db.createReview({
        ...reviewData,
        created_at: new Date().toISOString()
      })
      
      if (error) throw error
      
      toast.success('Review submitted successfully!')
      fetchReviews() // Refresh reviews
      return { success: true, data }
    } catch (err) {
      console.error('Error creating review:', err)
      toast.error('Failed to submit review')
      return { success: false, error: err }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchReviews()
  }, [dinnerId])

  return {
    reviews,
    loading,
    error,
    fetchReviews,
    createReview
  }
}