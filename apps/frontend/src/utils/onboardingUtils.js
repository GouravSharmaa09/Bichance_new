import { fetchWithAuth } from '../lib/fetchWithAuth';

export const checkOnboardingCompletion = async () => {
  try {
    const response = await fetchWithAuth(
      "https://bichance-production-a30f.up.railway.app/api/v1/users/me",
      {
        method: "GET",
        headers: {
          accept: "application/json",
        },
      }
    );

    if (response.ok) {
      const responseData = await response.json();
      
      // The API might wrap the data in a 'data' field
      const data = responseData.data || responseData;
      
      // Check if user has personality scores or personality answers
      const hasPersonalityScores = !!data.personality_scores && Object.keys(data.personality_scores).length > 0;
      const hasPersonalityAnswers = !!data.personality_answers && data.personality_answers.length > 0;
      
      // Check if user has basic profile information filled (identity section)
      const hasBasicProfile = !!(data.name && data.mobile && data.gender);
      
      // User must have BOTH personality data AND basic profile info to be considered complete
      const hasPersonalityData = hasPersonalityScores || hasPersonalityAnswers;
      
      // For onboarding to be complete, user must have both personality data AND identity info
      const isComplete = hasPersonalityData && hasBasicProfile;
      
      // Debug logging
      console.log('Onboarding completion check:', {
        hasPersonalityScores,
        hasPersonalityAnswers,
        hasPersonalityData,
        hasBasicProfile,
        name: data.name,
        mobile: data.mobile,
        gender: data.gender,
        isComplete
      });
      
      return isComplete;
    } else {
      // If endpoint doesn't exist or returns error, assume not completed
      return false;
    }
  } catch (error) {
    // If there's an error, assume not completed
    return false;
  }
}; 