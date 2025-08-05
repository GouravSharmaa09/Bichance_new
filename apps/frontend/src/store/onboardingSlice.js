import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || "";

// Async thunks for API calls
export const fetchCountries = createAsyncThunk(
  'onboarding/fetchCountries',
  async () => {
    const response = await fetch(`${API_BASE_URL}/api/v1/geo/countries`);
    if (response.ok) {
      const data = await response.json();
      console.log('Countries API response:', data);
      
      // Handle different possible response structures
      let countriesData = [];
      if (data.data && data.data.countries && Array.isArray(data.data.countries)) {
        countriesData = data.data.countries;
      } else if (data.data && Array.isArray(data.data)) {
        countriesData = data.data;
      } else if (Array.isArray(data)) {
        countriesData = data;
      } else if (data.countries && Array.isArray(data.countries)) {
        countriesData = data.countries;
      } else if (data.results && Array.isArray(data.results)) {
        countriesData = data.results;
      }
      
      console.log('Processed countries data:', countriesData);
      return countriesData;
    } else {
      throw new Error('Failed to fetch countries');
    }
  }
);

export const fetchCities = createAsyncThunk(
  'onboarding/fetchCities',
  async (country) => {
    const response = await fetch(`${API_BASE_URL}/api/v1/geo/country`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ country }),
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log('Cities API response:', data);
      
      // Handle different possible response structures
      let citiesData = [];
      if (data.data && data.data.cities && Array.isArray(data.data.cities)) {
        citiesData = data.data.cities;
      } else if (data.data && Array.isArray(data.data)) {
        citiesData = data.data;
      } else if (Array.isArray(data)) {
        citiesData = data;
      } else if (data.cities && Array.isArray(data.cities)) {
        citiesData = data.cities;
      } else if (data.results && Array.isArray(data.results)) {
        citiesData = data.results;
      }
      
      console.log('Processed cities data:', citiesData);
      return citiesData;
    } else {
      throw new Error('Failed to fetch cities');
    }
  }
);

export const saveJourneyData = createAsyncThunk(
  'onboarding/saveJourneyData',
  async ({ question_key, answer, question }, { getState }) => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      throw new Error('No token found');
    }

    const response = await fetch(`${API_BASE_URL}/api/v1/journey/save`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        question_key,
        answer,
        question
      }),
    });
    
    if (response.ok) {
      return { question_key, answer, success: true };
    } else if (response.status === 401) {
      throw new Error('Token expired or invalid');
    } else {
      throw new Error(`Failed to save: ${response.status}`);
    }
  }
);

export const submitJourney = createAsyncThunk(
  'onboarding/submitJourney',
  async (_, { getState }) => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      throw new Error('No token found');
    }

    const response = await fetch(`${API_BASE_URL}/api/v1/journey/submit`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({}),
    });
    
    if (response.ok) {
      return { success: true };
    } else if (response.status === 401) {
      throw new Error('Token expired or invalid');
    } else {
      throw new Error(`Failed to submit journey: ${response.status}`);
    }
  }
);

const initialState = {
  currentStep: 0,
  currentQuestionIndex: 0,
  currentIdentityIndex: 0,
  loading: false,
  countries: [],
  cities: [],
  personalityQuestions: [
    {
      id: "q0",
      question: "I enjoy discussing politics and current news.",
      options: [
        { value: "0", label: "Disagree" },
        { value: "1", label: "Agree" }
      ]
    },
    {
      id: "q1",
      question: "I prefer small gatherings over large parties.",
      options: [
        { value: "0", label: "Disagree" },
        { value: "1", label: "Agree" }
      ]
    },
    {
      id: "q2",
      question: "I like to plan ahead and stay organized.",
      options: [
        { value: "0", label: "Disagree" },
        { value: "1", label: "Agree" }
      ]
    },
    {
      id: "q3",
      question: "I often go with the flow rather than planning.",
      options: [
        { value: "0", label: "Disagree" },
        { value: "1", label: "Agree" }
      ]
    },
    {
      id: "q4",
      question: "I enjoy debating different ideas.",
      options: [
        { value: "0", label: "Disagree" },
        { value: "1", label: "Agree" }
      ]
    },
    {
      id: "q5",
      question: "I like trying new restaurants and cuisines.",
      options: [
        { value: "0", label: "Disagree" },
        { value: "1", label: "Agree" }
      ]
    },
    {
      id: "q6",
      question: "I feel energized when I'm around other people.",
      options: [
        { value: "0", label: "Disagree" },
        { value: "1", label: "Agree" }
      ]
    },
    {
      id: "q7",
      question: "I enjoy listening more than talking.",
      options: [
        { value: "0", label: "Disagree" },
        { value: "1", label: "Agree" }
      ]
    },
    {
      id: "q8",
      question: "I enjoy philosophical or deep conversations.",
      options: [
        { value: "0", label: "Disagree" },
        { value: "1", label: "Agree" }
      ]
    },
    {
      id: "q9",
      question: "I prefer familiar foods over exotic dishes.",
      options: [
        { value: "0", label: "Disagree" },
        { value: "1", label: "Agree" }
      ]
    },
    {
      id: "q10",
      question: "I enjoy meeting new and different types of people.",
      options: [
        { value: "0", label: "Disagree" },
        { value: "1", label: "Agree" }
      ]
    },
    {
      id: "q11",
      question: "I like organizing events and gatherings.",
      options: [
        { value: "0", label: "Disagree" },
        { value: "1", label: "Agree" }
      ]
    },
    {
      id: "q12",
      question: "I prefer quiet environments.",
      options: [
        { value: "0", label: "Disagree" },
        { value: "1", label: "Agree" }
      ]
    },
    {
      id: "q13",
      question: "I am comfortable sharing personal stories.",
      options: [
        { value: "0", label: "Disagree" },
        { value: "1", label: "Agree" }
      ]
    },
    {
      id: "q14",
      question: "I like helping others feel included in a group.",
      options: [
        { value: "0", label: "Disagree" },
        { value: "1", label: "Agree" }
      ]
    }
  ],
  identityQuestions: [
    {
      id: "name",
      question: "What's your full name?",
      type: "text",
      placeholder: "Enter your full name"
    },
    {
      id: "mobile",
      question: "What's your phone number?",
      type: "tel",
      placeholder: "Enter your phone number"
    },
    {
      id: "gender",
      question: "What's your gender?",
      type: "select",
      options: [
        { value: "male", label: "Male" },
        { value: "female", label: "Female" },
        { value: "other", label: "Other" }
      ]
    },
    {
      id: "relationship_status",
      question: "What's your relationship status?",
      type: "select",
      options: [
        { value: "single", label: "Single" },
        { value: "married", label: "Married" },
        { value: "divorced", label: "Divorced" },
        { value: "widowed", label: "Widowed" }
      ]
    },
    {
      id: "children",
      question: "Do you have children?",
      type: "select",
      options: [
        { value: "true", label: "Yes" },
        { value: "false", label: "No" }
      ]
    },
    {
      id: "profession",
      question: "What's your profession?",
      type: "text",
      placeholder: "Enter your profession"
    },
    {
      id: "dob",
      question: "What's your date of birth?",
      type: "date",
      placeholder: "YYYY-MM-DD"
    }
  ],
  loadingCountries: true,
  loadingCities: false,
  savingAnswer: null,
  formData: {
    country: '',
    city: '',
    personalityAnswers: {},
    name: '',
    mobile: '',
    gender: '',
    relationship_status: '',
    children: '',
    profession: '',
    dob: ''
  },
  steps: [
    {
      title: "Select your country",
      subtitle: "Help us find dinners near you",
      type: "country"
    },
    {
      title: "Select your city",
      subtitle: "Choose from available cities",
      type: "city"
    },
    {
      title: "Personality Questions",
      subtitle: "Help us match you with the right people",
      type: "personality"
    },
    {
      title: "Generating a personality score for possibility match stranger",
      subtitle: "Analyzing your responses",
      type: "personalityScore"
    },
    {
      title: "Personal Information",
      subtitle: "Help us know you better",
      type: "identity"
    }
  ]
};

const onboardingSlice = createSlice({
  name: 'onboarding',
  initialState,
  reducers: {
    setCurrentStep: (state, action) => {
      state.currentStep = action.payload;
    },
    setCurrentQuestionIndex: (state, action) => {
      state.currentQuestionIndex = action.payload;
    },
    setCurrentIdentityIndex: (state, action) => {
      state.currentIdentityIndex = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setSavingAnswer: (state, action) => {
      state.savingAnswer = action.payload;
    },
    updateFormData: (state, action) => {
      state.formData = { ...state.formData, ...action.payload };
    },
    updatePersonalityAnswer: (state, action) => {
      const { questionId, value } = action.payload;
      state.formData.personalityAnswers = {
        ...state.formData.personalityAnswers,
        [questionId]: value
      };
    },
    updateIdentityAnswer: (state, action) => {
      const { field, value } = action.payload;
      state.formData[field] = value;
    },
    resetOnboarding: (state) => {
      return initialState;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Countries
      .addCase(fetchCountries.pending, (state) => {
        state.loadingCountries = true;
      })
      .addCase(fetchCountries.fulfilled, (state, action) => {
        state.loadingCountries = false;
        state.countries = action.payload;
      })
      .addCase(fetchCountries.rejected, (state, action) => {
        state.loadingCountries = false;
        state.countries = ['India', 'United States', 'United Kingdom', 'Canada', 'Australia', 'Germany', 'France', 'Japan', 'Singapore', 'United Arab Emirates'];
        console.error('Error fetching countries:', action.error);
      })
      // Fetch Cities
      .addCase(fetchCities.pending, (state) => {
        state.loadingCities = true;
      })
      .addCase(fetchCities.fulfilled, (state, action) => {
        state.loadingCities = false;
        state.cities = action.payload;
      })
      .addCase(fetchCities.rejected, (state, action) => {
        state.loadingCities = false;
        const country = state.formData.country;
        if (country === 'India') {
          state.cities = ['Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai', 'Kolkata', 'Pune', 'Ahmedabad', 'Jaipur', 'Surat', 'Noida', 'Gurgaon', 'Faridabad', 'Ghaziabad', 'Lucknow'];
        } else {
          state.cities = [];
        }
        console.error('Error fetching cities:', action.error);
      })
      // Save Journey Data
      .addCase(saveJourneyData.pending, (state, action) => {
        state.savingAnswer = action.meta.arg.question_key;
      })
      .addCase(saveJourneyData.fulfilled, (state, action) => {
        state.savingAnswer = null;
        console.log(`Data saved successfully: ${action.payload.question_key} = ${action.payload.answer}`);
      })
      .addCase(saveJourneyData.rejected, (state, action) => {
        state.savingAnswer = null;
        console.error('Error saving data:', action.error);
      })
      // Submit Journey
      .addCase(submitJourney.pending, (state) => {
        state.loading = true;
      })
      .addCase(submitJourney.fulfilled, (state, action) => {
        state.loading = false;
        console.log('Journey submitted successfully');
      })
      .addCase(submitJourney.rejected, (state, action) => {
        state.loading = false;
        console.error('Error submitting journey:', action.error);
      });
  }
});

export const {
  setCurrentStep,
  setCurrentQuestionIndex,
  setCurrentIdentityIndex,
  setLoading,
  setSavingAnswer,
  updateFormData,
  updatePersonalityAnswer,
  updateIdentityAnswer,
  resetOnboarding
} = onboardingSlice.actions;

export default onboardingSlice.reducer; 