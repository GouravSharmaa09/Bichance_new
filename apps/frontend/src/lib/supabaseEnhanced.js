import { supabase, db } from './supabase'

// Enhanced tracking and analytics functions
export const analytics = {
  // Track user activity
  trackActivity: async (userId, activityType, activityData = {}, pageUrl = null) => {
    try {
      const { data, error } = await supabase
        .from('user_activities')
        .insert([{
          user_id: userId,
          activity_type: activityType,
          activity_data: activityData,
          page_url: pageUrl || window.location.href,
          user_agent: navigator.userAgent,
          session_id: sessionStorage.getItem('session_id') || 'anonymous',
          device_type: /Mobile|Android|iP(hone|od|ad)/.test(navigator.userAgent) ? 'mobile' : 'desktop',
          browser: navigator.userAgent.includes('Chrome') ? 'chrome' : 
                  navigator.userAgent.includes('Firefox') ? 'firefox' : 
                  navigator.userAgent.includes('Safari') ? 'safari' : 'other'
        }])
      return { data, error }
    } catch (error) {
      console.error('Error tracking activity:', error)
      return { data: null, error }
    }
  },

  // Start user session
  startSession: async (userId) => {
    try {
      const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      sessionStorage.setItem('session_id', sessionId)
      
      const { data, error } = await supabase
        .from('user_sessions')
        .insert([{
          user_id: userId,
          session_token: sessionId,
          ip_address: null, // Will be handled by backend
          user_agent: navigator.userAgent,
          device_info: {
            screen_width: window.screen.width,
            screen_height: window.screen.height,
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            language: navigator.language
          }
        }])
      
      // Track session start activity
      await analytics.trackActivity(userId, 'session_start', { session_id: sessionId })
      
      return { data, error, sessionId }
    } catch (error) {
      console.error('Error starting session:', error)
      return { data: null, error }
    }
  },

  // End user session
  endSession: async (userId, sessionId) => {
    try {
      const { data, error } = await supabase
        .from('user_sessions')
        .update({
          ended_at: new Date().toISOString(),
          is_active: false
        })
        .eq('session_token', sessionId)
      
      await analytics.trackActivity(userId, 'session_end', { session_id: sessionId })
      sessionStorage.removeItem('session_id')
      
      return { data, error }
    } catch (error) {
      console.error('Error ending session:', error)
      return { data: null, error }
    }
  },

  // Get analytics dashboard data
  getDashboardData: async (dateRange = '30d') => {
    try {
      const endDate = new Date()
      const startDate = new Date()
      
      switch(dateRange) {
        case '7d':
          startDate.setDate(startDate.getDate() - 7)
          break
        case '30d':
          startDate.setDate(startDate.getDate() - 30)
          break
        case '90d':
          startDate.setDate(startDate.getDate() - 90)
          break
        default:
          startDate.setDate(startDate.getDate() - 30)
      }

      // Get daily analytics
      const { data: dailyAnalytics, error: analyticsError } = await supabase
        .from('daily_analytics')
        .select('*')
        .gte('date', startDate.toISOString().split('T')[0])
        .lte('date', endDate.toISOString().split('T')[0])
        .order('date', { ascending: false })

      // Get active users today
      const { data: activeUsers, error: activeUsersError } = await supabase
        .from('user_activities')
        .select('user_id')
        .gte('created_at', new Date().toISOString().split('T')[0])
        .neq('user_id', null)

      const uniqueActiveUsers = [...new Set(activeUsers?.map(u => u.user_id) || [])]

      // Get upcoming dinners
      const { data: upcomingDinners, error: dinnersError } = await supabase
        .from('dinners')
        .select(`
          *,
          restaurant:restaurants(name, city),
          bookings:bookings(count)
        `)
        .gte('date', new Date().toISOString().split('T')[0])
        .eq('status', 'upcoming')
        .order('date', { ascending: true })

      return {
        dailyAnalytics: dailyAnalytics || [],
        activeUsersToday: uniqueActiveUsers.length,
        upcomingDinners: upcomingDinners || [],
        error: analyticsError || activeUsersError || dinnersError
      }
    } catch (error) {
      console.error('Error getting dashboard data:', error)
      return { error }
    }
  }
}

// Personality tracking functions
export const personalityTracking = {
  // Save personality assessment
  savePersonalityProfile: async (userId, scores, insights = null) => {
    try {
      const { data, error } = await supabase
        .from('personality_profiles')
        .insert([{
          user_id: userId,
          extroversion_score: scores.extroversion,
          agreeableness_score: scores.agreeableness,
          conscientiousness_score: scores.conscientiousness,
          neuroticism_score: scores.neuroticism,
          openness_score: scores.openness,
          conversation_style: scores.conversation_style,
          energy_level: scores.energy_level,
          social_preference: scores.social_preference,
          ai_insights: insights,
          matching_preferences: scores.matching_preferences || {},
          compatibility_factors: scores.compatibility_factors || {}
        }])
      
      await analytics.trackActivity(userId, 'personality_assessment_completed', scores)
      return { data, error }
    } catch (error) {
      console.error('Error saving personality profile:', error)
      return { data: null, error }
    }
  },

  // Save individual question responses
  saveQuestionResponse: async (userId, questionId, questionText, answerValue, traitCategory) => {
    try {
      const { data, error } = await supabase
        .from('personality_assessments')
        .insert([{
          user_id: userId,
          question_id: questionId,
          question_text: questionText,
          answer_value: answerValue,
          trait_category: traitCategory
        }])
      
      return { data, error }
    } catch (error) {
      console.error('Error saving question response:', error)
      return { data: null, error }
    }
  }
}

// Dining preferences and scheduling
export const diningManagement = {
  // Save dining preferences
  saveDiningPreferences: async (userId, preferences) => {
    try {
      const { data, error } = await supabase
        .from('dining_preferences')
        .upsert([{
          user_id: userId,
          preferred_days: preferences.preferred_days || [],
          preferred_times: preferences.preferred_times || [],
          frequency: preferences.frequency,
          cuisine_preferences: preferences.cuisine_preferences || [],
          price_range_min: preferences.price_range_min,
          price_range_max: preferences.price_range_max,
          group_size_preference: preferences.group_size_preference,
          atmosphere_preference: preferences.atmosphere_preference,
          noise_level_preference: preferences.noise_level_preference,
          special_occasions: preferences.special_occasions || [],
          avoid_cuisines: preferences.avoid_cuisines || [],
          preferred_neighborhoods: preferences.preferred_neighborhoods || [],
          travel_distance_km: preferences.travel_distance_km,
          accessibility_needs: preferences.accessibility_needs || []
        }])
      
      await analytics.trackActivity(userId, 'dining_preferences_updated', preferences)
      return { data, error }
    } catch (error) {
      console.error('Error saving dining preferences:', error)
      return { data: null, error }
    }
  },

  // Save user availability
  saveAvailability: async (userId, availabilitySlots) => {
    try {
      const insertData = availabilitySlots.map(slot => ({
        user_id: userId,
        date: slot.date,
        time_slot: slot.time,
        is_available: slot.available,
        preference_score: slot.preference_score || 5,
        notes: slot.notes,
        recurring_pattern: slot.recurring_pattern
      }))

      const { data, error } = await supabase
        .from('user_availability')
        .upsert(insertData, { onConflict: 'user_id,date,time_slot' })
      
      await analytics.trackActivity(userId, 'availability_updated', { slots_count: availabilitySlots.length })
      return { data, error }
    } catch (error) {
      console.error('Error saving availability:', error)
      return { data: null, error }
    }
  },

  // Get user's dining preferences
  getDiningPreferences: async (userId) => {
    try {
      const { data, error } = await supabase
        .from('dining_preferences')
        .select('*')
        .eq('user_id', userId)
        .single()
      
      return { data, error }
    } catch (error) {
      console.error('Error getting dining preferences:', error)
      return { data: null, error }
    }
  }
}

// Admin management functions
export const adminManagement = {
  // Log admin action
  logAdminAction: async (adminUserId, actionCategory, actionType, targetType, targetId, oldValues, newValues, reason, impactLevel = 'medium') => {
    try {
      // Count affected users
      let affectedUsersCount = 0
      if (targetType === 'dinner' && actionType.includes('group')) {
        const { data: groupMembers } = await supabase
          .from('group_members')
          .select('user_id')
          .in('group_id', 
            await supabase
              .from('dinner_groups')
              .select('id')
              .eq('dinner_id', targetId)
          )
        affectedUsersCount = groupMembers?.length || 0
      }

      const { data, error } = await supabase
        .from('enhanced_admin_logs')
        .insert([{
          admin_user_id: adminUserId,
          action_category: actionCategory,
          action_type: actionType,
          target_type: targetType,
          target_id: targetId,
          old_values: oldValues,
          new_values: newValues,
          reason: reason,
          impact_level: impactLevel,
          affected_users_count: affectedUsersCount,
          user_agent: navigator.userAgent
        }])
      
      return { data, error }
    } catch (error) {
      console.error('Error logging admin action:', error)
      return { data: null, error }
    }
  },

  // Get all users with detailed info for admin panel
  getAllUsersForAdmin: async (filters = {}) => {
    try {
      let query = supabase
        .from('users')
        .select(`
          *,
          profile:profiles(*),
          dining_preferences:dining_preferences(*),
          personality_profile:personality_profiles(*),
          bookings:bookings(
            id,
            status,
            dinner:dinners(date, restaurant:restaurants(name))
          ),
          recent_activity:user_activities(
            activity_type,
            created_at
          )
        `)
        .order('created_at', { ascending: false })

      if (filters.status) {
        query = query.eq('status', filters.status)
      }
      if (filters.city) {
        query = query.eq('profiles.city', filters.city)
      }

      const { data, error } = await query
      return { data, error }
    } catch (error) {
      console.error('Error getting all users for admin:', error)
      return { data: null, error }
    }
  },

  // Update user by admin
  updateUserByAdmin: async (adminUserId, userId, updates, reason) => {
    try {
      // Get current values
      const { data: currentUser } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single()

      // Update user
      const { data, error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', userId)
        .select()

      if (!error) {
        // Log admin action
        await adminManagement.logAdminAction(
          adminUserId,
          'user_management',
          'user_updated',
          'user',
          userId,
          currentUser,
          updates,
          reason,
          'medium'
        )
      }

      return { data, error }
    } catch (error) {
      console.error('Error updating user by admin:', error)
      return { data: null, error }
    }
  },

  // Manage dinner groups
  createDinnerGroup: async (adminUserId, dinnerId, memberIds, groupName) => {
    try {
      // Create group
      const { data: group, error: groupError } = await supabase
        .from('dinner_groups')
        .insert([{
          dinner_id: dinnerId,
          group_name: groupName,
          created_by: adminUserId,
          formation_method: 'manual',
          status: 'confirmed'
        }])
        .select()
        .single()

      if (groupError) throw groupError

      // Add members
      const memberData = memberIds.map((userId, index) => ({
        group_id: group.id,
        user_id: userId,
        seat_number: index + 1,
        join_method: 'admin_assigned'
      }))

      const { data: members, error: membersError } = await supabase
        .from('group_members')
        .insert(memberData)

      if (!membersError) {
        await adminManagement.logAdminAction(
          adminUserId,
          'group_management',
          'group_created',
          'dinner_group',
          group.id,
          {},
          { dinner_id: dinnerId, member_ids: memberIds, group_name: groupName },
          'Manual group creation',
          'high'
        )
      }

      return { group, members, error: membersError }
    } catch (error) {
      console.error('Error creating dinner group:', error)
      return { error }
    }
  },

  // Get admin dashboard stats
  getAdminDashboardStats: async () => {
    try {
      const today = new Date().toISOString().split('T')[0]
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]

      // Get various stats in parallel
      const [
        { data: todaySignups },
        { data: monthlySignups },
        { data: totalUsers },
        { data: activeUsers },
        { data: upcomingDinners },
        { data: activeDinnerGroups },
        { data: todayMatches },
        { data: pendingBookings }
      ] = await Promise.all([
        supabase.from('users').select('id').gte('created_at', today),
        supabase.from('users').select('id').gte('created_at', thirtyDaysAgo),
        supabase.from('users').select('id', { count: 'exact' }),
        supabase.from('user_activities').select('user_id').gte('created_at', today),
        supabase.from('dinners').select('*').gte('date', today).eq('status', 'upcoming'),
        supabase.from('dinner_groups').select('*').eq('status', 'confirmed'),
        supabase.from('matches').select('id').gte('created_at', today),
        supabase.from('bookings').select('*').eq('status', 'pending')
      ])

      const uniqueActiveUsers = [...new Set(activeUsers?.map(u => u.user_id) || [])]

      return {
        signups: {
          today: todaySignups?.length || 0,
          thisMonth: monthlySignups?.length || 0,
          total: totalUsers?.length || 0
        },
        users: {
          active: uniqueActiveUsers.length,
          total: totalUsers?.length || 0
        },
        dinners: {
          upcoming: upcomingDinners?.length || 0,
          activeGroups: activeDinnerGroups?.length || 0
        },
        matches: {
          today: todayMatches?.length || 0
        },
        bookings: {
          pending: pendingBookings?.length || 0
        }
      }
    } catch (error) {
      console.error('Error getting admin dashboard stats:', error)
      return { error }
    }
  }
}

// Restaurant and table management
export const restaurantManagement = {
  // Add restaurant
  addRestaurant: async (restaurantData) => {
    try {
      const { data, error } = await supabase
        .from('restaurants')
        .insert([restaurantData])
        .select()
      
      return { data, error }
    } catch (error) {
      console.error('Error adding restaurant:', error)
      return { data: null, error }
    }
  },

  // Add tables to restaurant
  addRestaurantTables: async (restaurantId, tables) => {
    try {
      const tableData = tables.map(table => ({
        restaurant_id: restaurantId,
        table_number: table.number,
        capacity: table.capacity,
        table_type: table.type,
        location_in_restaurant: table.location,
        amenities: table.amenities || []
      }))

      const { data, error } = await supabase
        .from('restaurant_tables')
        .insert(tableData)
      
      return { data, error }
    } catch (error) {
      console.error('Error adding restaurant tables:', error)
      return { data: null, error }
    }
  },

  // Create table reservation
  createTableReservation: async (restaurantId, dinnerId, tableNumber, reservationData) => {
    try {
      const { data, error } = await supabase
        .from('table_reservations')
        .insert([{
          restaurant_id: restaurantId,
          dinner_id: dinnerId,
          table_number: tableNumber,
          capacity: reservationData.capacity,
          reservation_time: reservationData.reservation_time,
          duration_minutes: reservationData.duration_minutes || 180,
          special_requests: reservationData.special_requests,
          table_preferences: reservationData.table_preferences || {},
          confirmation_number: `RES-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
          reserved_by: reservationData.reserved_by,
          notes: reservationData.notes
        }])
        .select()
      
      return { data, error }
    } catch (error) {
      console.error('Error creating table reservation:', error)
      return { data: null, error }
    }
  }
}