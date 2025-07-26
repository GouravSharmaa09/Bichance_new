import { useState, useEffect, createContext, useContext } from 'react'
import { auth, db } from '../lib/supabase'
import toast from 'react-hot-toast'
import { fetchWithAuth } from '../lib/fetchWithAuth';

const AuthContext = createContext({})

// Move this function outside the AuthProvider
export async function refreshAccessToken(refreshToken) {
  try {
    const res = await fetch(`${import.meta.env.VITE_BACKEND_URL || ''}/api/v1/auth/refresh-token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${refreshToken}`,
      },
    });
    const data = await res.json();
    if (res.ok && data.data && data.data.access_token) {
      return data.data;
    } else {
      throw new Error(data.message || data.detail || 'Failed to refresh token');
    }
  } catch (err) {
    throw err;
  }
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [session, setSession] = useState(null)

  useEffect(() => {
    // Check for token in localStorage on mount
    const accessToken = localStorage.getItem('access_token');
    if (accessToken) {
      setUser({ access_token: accessToken });
      // Optionally, fetch user profile here
      fetchCurrentUser(accessToken);
    }
    setLoading(false);
  }, []);

  // Fetch current user from /api/v1/users/me
  const fetchCurrentUser = async (token) => {
    try {
      const res = await fetchWithAuth('https://bichance-production-a30f.up.railway.app/api/v1/users/me');
      if (res.ok) {
        const data = await res.json();
        setUser(data);
      } else {
        setUser(null);
      }
    } catch (err) {
      setUser(null);
    }
  };

  const fetchUserProfile = async (userId) => {
    try {
      const { data, error } = await db.getProfile(userId)
      if (error && error.code !== 'PGRST116') { // PGRST116 is "not found"
        console.error('Error fetching profile:', error)
        return
      }
      setProfile(data)
    } catch (error) {
      console.error('Error fetching profile:', error)
    }
  }

  const signUp = async (email, password, userData = {}) => {
    setLoading(true)
    try {
      // Mock signup - always succeed
      const mockUser = {
        id: 'mock-user-id',
        email: email,
        user_metadata: {
          first_name: userData.first_name || 'Demo',
          last_name: userData.last_name || 'User'
        }
      }
      
      const mockSession = {
        user: mockUser,
        access_token: 'mock-token'
      }
      
      setSession(mockSession)
      setUser(mockUser)
      setProfile({
        user_id: mockUser.id,
        email: mockUser.email,
        first_name: mockUser.user_metadata.first_name,
        last_name: mockUser.user_metadata.last_name,
        onboarding_complete: false // ensure onboarding is not complete by default
      })
      
      toast.success('Account created successfully! Welcome to Bichance!')
      return { success: true, data: { user: mockUser } }
    } catch (error) {
      console.error('Signup error:', error)
      toast.error('An unexpected error occurred')
      return { success: false, error }
    } finally {
      setLoading(false)
    }
  }

  const signIn = async (email, password) => {
    setLoading(true)
    try {
      // Mock signin - always succeed
      const mockUser = {
        id: 'mock-user-id',
        email: email,
        user_metadata: {
          first_name: 'Demo',
          last_name: 'User'
        }
      }
      
      const mockSession = {
        user: mockUser,
        access_token: 'mock-token'
      }
      
      setSession(mockSession)
      setUser(mockUser)
      setProfile({
        user_id: mockUser.id,
        email: mockUser.email,
        first_name: mockUser.user_metadata.first_name,
        last_name: mockUser.user_metadata.last_name,
        onboarding_complete: false // ensure onboarding is not complete by default
      })

      toast.success('Welcome back!')
      return { success: true, data: { user: mockUser } }
    } catch (error) {
      console.error('Signin error:', error)
      toast.error('An unexpected error occurred')
      return { success: false, error }
    } finally {
      setLoading(false)
    }
  }

  const signOut = async () => {
    setLoading(true);
    try {
      // Call backend logout API
      const accessToken = localStorage.getItem('access_token');
      await fetchWithAuth('https://bichance-production-a30f.up.railway.app/api/v1/auth/logout', { method: 'POST', body: '' });
      setUser(null);
      setProfile(null);
      setSession(null);
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user_data');
      toast.success('Signed out successfully');
      return { success: true };
    } catch (error) {
      console.error('Signout error:', error)
      toast.error('An unexpected error occurred')
      return { success: false, error }
    } finally {
      setLoading(false)
    }
  }

  const updateProfile = async (updates) => {
    if (!user) return { success: false, error: 'No user logged in' }
    
    setLoading(true)
    try {
      const { data, error } = await db.updateProfile(user.id, updates)
      
      if (error) {
        toast.error('Failed to update profile')
        return { success: false, error }
      }

      setProfile(data[0])
      toast.success('Profile updated successfully')
      return { success: true, data }
    } catch (error) {
      console.error('Update profile error:', error)
      toast.error('An unexpected error occurred')
      return { success: false, error }
    } finally {
      setLoading(false)
    }
  }

  const value = {
    user,
    setUser, // <-- add this
    profile,
    session,
    loading,
    signUp,
    signIn,
    signOut,
    updateProfile,
    refreshProfile: () => user ? fetchUserProfile(user.id) : null,
    fetchCurrentUser,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export default useAuth