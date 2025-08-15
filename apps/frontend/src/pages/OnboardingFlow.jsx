import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { fetchWithAuth } from '../lib/fetchWithAuth';
import {
  setCurrentStep,
  setCurrentQuestionIndex,
  setCurrentIdentityIndex,
  setLoading,
  updateFormData,
  updatePersonalityAnswer,
  updateIdentityAnswer,
  fetchCountries,
  fetchCities,
  saveJourneyData,
  submitJourney
} from '../store/onboardingSlice';

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || "";

// Personality Score Step Component
const PersonalityScoreStep = ({ formData, personalityQuestions, onNext, onBack }) => {
  const [currentScore, setCurrentScore] = React.useState(0);
  const [finalScore, setFinalScore] = React.useState(0);
  const [isGenerating, setIsGenerating] = React.useState(true);
  const [showNextButton, setShowNextButton] = React.useState(false);
  const [scoreSubmitted, setScoreSubmitted] = React.useState(false);

  // Calculate final score based on personality answers
  React.useEffect(() => {
    const answeredQuestions = Object.keys(formData.personalityAnswers).length;
    const totalQuestions = personalityQuestions.length;
    
    // Generate random score between 90-100 based on personality answers
    const baseScore = 90;
    const maxBonus = 10;
    const completionRatio = answeredQuestions / totalQuestions;
    const bonus = Math.floor(Math.random() * maxBonus * completionRatio);
    const targetScore = Math.min(100, baseScore + bonus);
    
    setFinalScore(targetScore);
    
    // Animate score from 0 to target
    let startTime = Date.now();
    const duration = 2000; // 2 seconds
    
    const animateScore = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Use easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const currentValue = Math.floor(targetScore * easeOutQuart);
      
      setCurrentScore(currentValue);
      
      if (progress < 1) {
        requestAnimationFrame(animateScore);
      } else {
        setCurrentScore(targetScore);
        setIsGenerating(false);
        // Show next button after a short delay
        setTimeout(() => setShowNextButton(true), 500);
      }
    };
    
    // Start animation after a short delay
    setTimeout(() => {
      requestAnimationFrame(animateScore);
    }, 500);
  }, [formData.personalityAnswers, personalityQuestions.length]);

  return (
    <div className="space-y-6">
      {/* Back Arrow */}
      <div className="flex justify-start mb-4">
        <button
          onClick={onBack}
          className="w-10 h-10 rounded-full flex items-center justify-center text-purple-600 hover:bg-purple-100 border-2 border-purple-200 transition-all"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      </div>
      
      <div className="text-center">
        {/* Score Display */}
        <div className="mb-8">
          <div className="text-8xl md:text-9xl font-display font-bold text-purple-600 mb-4">
            {currentScore}
          </div>
          <div className="text-2xl md:text-3xl font-heading font-semibold text-gray-700">
            / 100
          </div>
        </div>

        {/* Loading Animation */}
        {isGenerating && (
          <div className="mb-8">
            <div className="flex justify-center space-x-2">
              <div className="w-3 h-3 bg-purple-600 rounded-full animate-bounce"></div>
              <div className="w-3 h-3 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-3 h-3 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
            <div className="text-lg text-gray-600 mt-4 font-body">
              Calculating your personality score...
            </div>
          </div>
        )}

        {/* Completion Message */}
        {!isGenerating && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <div className="text-xl text-green-600 font-heading font-semibold mb-2">
              ✓ Personality Score Generated!
            </div>
            <div className="text-lg text-gray-600 font-body">
              Your personality analysis is complete
            </div>
          </motion.div>
        )}

        {/* Next Button */}
        {showNextButton && (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            onClick={async () => {
              if (!scoreSubmitted) {
                try {
                  // Submit personality score to API
                  await fetchWithAuth(`${API_BASE_URL}/api/v1/journey/submit`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      question_key: 'personality_score',
                      answer: finalScore.toString(),
                      question: 'Personality Score Generated'
                    }),
                  });
                  setScoreSubmitted(true);
                } catch (error) {
                  console.error('Error submitting personality score:', error);
                }
              }
              onNext();
            }}
            className="w-full max-w-md bg-purple-500 text-white rounded-full py-4 px-12 text-lg font-bold shadow-lg hover:bg-purple-600 transition-all duration-300"
          >
            Continue to Identity Questions
          </motion.button>
        )}
      </div>
    </div>
  );
};

const OnboardingFlow = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  // Get state from Redux
  const {
    currentStep,
    currentQuestionIndex,
    currentIdentityIndex,
    loading,
    countries,
    cities,
    personalityQuestions,
    identityQuestions,
    loadingCountries,
    loadingCities,
    savingAnswer,
    formData,
    steps
  } = useSelector(state => state.onboarding);

  // Fetch countries and personality questions on component mount
  useEffect(() => {
    console.log('OnboardingFlow mounted, fetching countries...');
    dispatch(fetchCountries());
  }, [dispatch]);

  // Fetch cities when country changes
  useEffect(() => {
    if (formData.country) {
      dispatch(fetchCities(formData.country));
    }
  }, [formData.country, dispatch]);

  const handleInputChange = (field, value) => {
    dispatch(updateFormData({ [field]: value }));
    
    // Auto-advance for country and city selection
    if (field === 'country') {
      setTimeout(() => {
        dispatch(setCurrentStep(1)); // Move to city step
      }, 1000);
    } else if (field === 'city') {
      setTimeout(() => {
        dispatch(setCurrentStep(2)); // Move to personality step
      }, 1000);
    }
  };

  const handlePersonalityAnswer = async (questionId, value) => {
    // Update local state immediately
    dispatch(updatePersonalityAnswer({ questionId, value }));

    // Find the question to get the question text
    const question = personalityQuestions.find(q => q.id === questionId);
    const questionText = question?.question || question?.text || 'Personality Question';

    // Save to API
    try {
      await dispatch(saveJourneyData({
        question_key: questionId,
        answer: value,
        question: questionText
      })).unwrap();
      
      // Auto-advance to next question after a short delay
      setTimeout(() => {
        if (currentQuestionIndex < personalityQuestions.length - 1) {
          dispatch(setCurrentQuestionIndex(currentQuestionIndex + 1));
        }
      }, 1000); // 1 second delay to show the checkmark
    } catch (error) {
      console.error('Error saving personality answer:', error);
    }
  };

  const handleIdentityInput = async (field, value) => {
    // Update local state immediately
    dispatch(updateIdentityAnswer({ field, value }));

    // Find the question to get the question text
    const question = identityQuestions.find(q => q.id === field);
    const questionText = question?.question || field;

    // Only save to API and auto-advance for select-type questions
    if (question?.type === 'select') {
      try {
        await dispatch(saveJourneyData({
          question_key: field,
          answer: value,
          question: questionText
        })).unwrap();
        
        // Special logic for relationship_status question
        if (field === 'relationship_status') {
          setTimeout(() => {
            if (value === 'single') {
              // Skip children question for single users
              // Find the index of the children question
              const childrenIndex = identityQuestions.findIndex(q => q.id === 'children');
              if (childrenIndex !== -1 && currentIdentityIndex < childrenIndex) {
                // Skip to the question after children
                dispatch(setCurrentIdentityIndex(childrenIndex + 1));
              } else if (currentIdentityIndex < identityQuestions.length - 1) {
                dispatch(setCurrentIdentityIndex(currentIdentityIndex + 1));
              }
            } else {
              // Normal progression for non-single users
              if (currentIdentityIndex < identityQuestions.length - 1) {
                dispatch(setCurrentIdentityIndex(currentIdentityIndex + 1));
              }
            }
          }, 1000); // 1 second delay to show the checkmark
        } else {
          // Auto-advance for other select-type questions
          setTimeout(() => {
            if (currentIdentityIndex < identityQuestions.length - 1) {
              dispatch(setCurrentIdentityIndex(currentIdentityIndex + 1));
            }
          }, 1000); // 1 second delay to show the checkmark
        }
      } catch (error) {
        console.error('Error saving identity answer:', error);
      }
    }
    // For text inputs, only update local state - no API call until Next button is clicked
  };

  const handleIdentityNext = async () => {
    const currentQuestion = identityQuestions[currentIdentityIndex];
    const currentValue = formData[currentQuestion.id];
    
    if (currentValue && currentValue.trim() !== '') {
      try {
        await dispatch(saveJourneyData({
          question_key: currentQuestion.id,
          answer: currentValue,
          question: currentQuestion.question
        })).unwrap();
        
        // Move to next question (but not for the last question - DOB)
        if (currentIdentityIndex < identityQuestions.length - 1) {
          dispatch(setCurrentIdentityIndex(currentIdentityIndex + 1));
        }
      } catch (error) {
        console.error('Error saving identity answer:', error);
        // Still move to next question even if API fails (but not for the last question)
        if (currentIdentityIndex < identityQuestions.length - 1) {
          dispatch(setCurrentIdentityIndex(currentIdentityIndex + 1));
        }
      }
    }
  };

  const handleIdentityComplete = async () => {
    // Save DOB data to API first
    const dobQuestion = identityQuestions[currentIdentityIndex]; // This will be the DOB question
    const dobValue = formData[dobQuestion.id];
    
    if (dobValue && dobValue.trim() !== '') {
      try {
        await dispatch(saveJourneyData({
          question_key: dobQuestion.id,
          answer: dobValue,
          question: dobQuestion.question
        })).unwrap();
        console.log('DOB saved successfully');
      } catch (error) {
        console.error('Error saving DOB:', error);
        // Continue even if API fails
      }
    }
    
    // Then proceed with the normal completion flow
    await handleNext();
  };

  const handleSubmitJourney = async () => {
    try {
      await dispatch(submitJourney()).unwrap();
      // Move to next step
      dispatch(setCurrentStep(currentStep + 1));
    } catch (error) {
      console.error('Error submitting journey:', error);
      // Still move to next step even if API fails
      dispatch(setCurrentStep(currentStep + 1));
    }
  };

  const canProceedPersonality = () => {
    return Object.keys(formData.personalityAnswers).length === personalityQuestions.length;
  };

  // Age validation function
  const calculateAge = (birthDate) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    
    return age;
  };

  const isValidAge = (dob) => {
    if (!dob) return false;
    const age = calculateAge(dob);
    return age >= 18;
  };

  const canProceedIdentity = () => {
    // Check if user is single
    const isSingle = formData.relationship_status === 'single';
    
    // For single users, skip children question
    const hasAllFields = formData.name !== '' && formData.mobile !== '' && formData.gender !== '' && 
           formData.relationship_status !== '' && 
           (isSingle ? true : formData.children !== '') && 
           formData.profession !== '' && formData.dob !== '';
    
    // For DOB, also check if age is valid (18+)
    const dobValid = formData.dob ? isValidAge(formData.dob) : false;
    
    return hasAllFields && dobValid;
  };

  const handleNext = async () => {
    console.log('handleNext called, currentStep:', currentStep, 'formData:', formData);
    
    if (currentStep < steps.length - 1) {
      dispatch(setLoading(true));
      
      try {
        // Save data based on current step
        if (currentStep === 0) {
          // Save country data
          try {
            await dispatch(saveJourneyData({
              question_key: 'current_country',
              answer: formData.country,
              question: 'Selected Country'
            })).unwrap();
            console.log('Country saved successfully');
          } catch (error) {
            console.error('Error saving country:', error);
          }
          
          // Move to next step regardless of API success
          console.log('Moving from step 0 to step 1');
          dispatch(setCurrentStep(1));
          
        } else if (currentStep === 1) {
          // Save city data
          try {
            await dispatch(saveJourneyData({
              question_key: 'current_city',
              answer: formData.city,
              question: 'Selected City'
            })).unwrap();
            console.log('City saved successfully');
          } catch (error) {
            console.error('Error saving city:', error);
          }
          
          // Move to next step regardless of API success
          console.log('Moving from step 1 to step 2');
          dispatch(setCurrentStep(2));
          
        } else if (currentStep === 2) {
          // Personality step - just move to next step
          console.log('Moving from step 2 to step 3 (personality score)');
          dispatch(setCurrentStep(3));
        } else if (currentStep === 3) {
          // Personality score step - move to identity step
          console.log('Moving from step 3 to step 4 (identity)');
          dispatch(setCurrentStep(4));
        }
        
      } catch (error) {
        console.error('Error in handleNext:', error);
        // Still move to next step even if API fails
        dispatch(setCurrentStep(currentStep + 1));
      } finally {
        dispatch(setLoading(false));
      }
      
    } else {
      // Complete onboarding
      dispatch(setLoading(true));
      try {
        console.log('Onboarding completed:', formData);
        
        // Removed: Save location data to users/onboarding endpoint - now handled by saveJourneyData earlier
        // await fetchWithAuth(`${API_BASE_URL}/api/v1/users/onboarding`, {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify({
        //     current_country: formData.country,
        //     current_city: formData.city,
        //     country: formData.country,
        //     city: formData.city
        //   }),
        // });

        console.log('Onboarding data saved successfully (via saveJourneyData)');
        
        // Add a small delay to ensure data is saved before navigating
        setTimeout(() => {
          navigate('/dashboard', { state: { refreshProfile: true } });
        }, 500);
      } catch (error) {
        console.error('Error saving onboarding data:', error);
        // Still navigate to dashboard even if API fails
        navigate('/dashboard', { state: { refreshProfile: true } });
      } finally {
        dispatch(setLoading(false));
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      dispatch(setCurrentStep(currentStep - 1));
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 0:
        return formData.country !== '';
      case 1:
        return formData.city !== '';
      case 2:
        // Personality step is handled by individual question navigation
        return true;
      case 3:
        return formData.name !== '' && formData.mobile !== '' && formData.gender !== '' && 
               formData.relationship_status !== '' && formData.children !== '' && 
               formData.profession !== '' && formData.dob !== '';
      default:
        return false;
    }
  };

  const renderStep = () => {
    const step = steps[currentStep];

    switch (step.type) {
      case 'country':
        return (
          <div className="space-y-6">
                           <div>
                 <h2 className="text-2xl font-bold text-white mb-2">WHERE WOULD YOU LIKE TO HAVE YOUR DINNERS?</h2>
                 <p className="text-white/80 mb-6">You can change it later</p>
                 <p className="text-purple-300 text-sm mb-4">Click a country to continue automatically</p>
              {loadingCountries ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto"></div>
                  <p className="text-white/80 mt-2">Loading countries...</p>
                </div>
              ) : Array.isArray(countries) && countries.length > 0 ? (
                <div className="grid grid-cols-2 gap-3 max-h-80 overflow-y-auto">
                  {countries.map((country) => (
                                           <button
                         key={country}
                         onClick={() => handleInputChange('country', country)}
                         className={`p-4 rounded-xl text-left transition-all border ${
                           formData.country === country
                             ? 'bg-purple-600 text-white border-purple-400'
                             : 'bg-purple-100 text-gray-800 border-purple-200 hover:border-purple-300 hover:shadow-md'
                         }`}
                       >
                         <div className="flex items-center justify-between">
                           <div className="flex items-center space-x-2">
                             <span className="text-lg">🏳️</span>
                             <span className="font-medium">{country}</span>
                           </div>
                           {formData.country === country && (
                             <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                             </svg>
                           )}
                         </div>
                       </button>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-white/80">No countries available</p>
                </div>
              )}
            </div>
          </div>
        );

      case 'city':
        return (
          <div className="space-y-6">
                           <div>
                                     <p className="text-white/80 mb-6">Choose from available cities in {formData.country || 'your selected country'}</p>
                 <p className="text-purple-300 text-sm mb-4">Click a city to continue automatically</p>
              {loadingCities ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto"></div>
                  <p className="text-white/80 mt-2">Loading cities...</p>
                </div>
              ) : Array.isArray(cities) && cities.length > 0 ? (
                <div className="grid grid-cols-2 gap-3 max-h-80 overflow-y-auto">
                  {cities.map((city) => (
                                           <button
                         key={city}
                         onClick={() => handleInputChange('city', city)}
                         className={`p-4 rounded-xl text-left transition-all border ${
                           formData.city === city
                             ? 'bg-purple-600 text-white border-purple-400'
                             : 'bg-purple-100 text-gray-800 border-purple-200 hover:border-purple-300 hover:shadow-md'
                         }`}
                       >
                         <div className="flex items-center justify-between">
                           <div className="flex items-center space-x-2">
                             <span className="text-lg">🏙️</span>
                             <span className="font-medium">{city}</span>
                           </div>
                           {formData.city === city && (
                             <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                             </svg>
                           )}
                         </div>
                       </button>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-white/80">No cities available for {formData.country}</p>
                </div>
              )}
            </div>
          </div>
        );

      case 'personality':
        return (
          <div className="space-y-6">
            {Array.isArray(personalityQuestions) && personalityQuestions.length > 0 ? (
              <div>
                                 {/* Question Progress at Top */}
                 <div className="text-center mb-6">
                   <p className="text-gray-600 text-sm font-medium">
                     Question {currentQuestionIndex + 1} of {personalityQuestions.length}
                   </p>
                   <p className="text-purple-600 text-xs mt-1">
                     Click an answer to continue automatically
                   </p>
                 </div>
                
                {/* Steps Navigation */}
                <div className="flex justify-between items-center mb-6">
                  <button
                    onClick={() => dispatch(setCurrentQuestionIndex(Math.max(0, currentQuestionIndex - 1)))}
                    disabled={currentQuestionIndex === 0}
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                      currentQuestionIndex === 0
                        ? 'text-gray-400 cursor-not-allowed'
                        : 'text-purple-600 hover:bg-purple-100 border-2 border-purple-200'
                    }`}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  
                                     <div className="relative">
                     <div className="flex space-x-2 overflow-x-auto max-w-32 scrollbar-hide" ref={(el) => {
                       if (el) {
                         // Auto-scroll to current question
                         const currentCircle = el.children[currentQuestionIndex];
                         if (currentCircle) {
                           currentCircle.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
                         }
                       }
                     }}>
                       {personalityQuestions.map((_, index) => {
                         // Only show 3 circles: previous, current, next
                         const shouldShow = index >= Math.max(0, currentQuestionIndex - 1) && 
                                          index <= Math.min(personalityQuestions.length - 1, currentQuestionIndex + 1);
                         
                         if (!shouldShow) return null;
                         
                         return (
                           <div
                             key={index}
                             className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all flex-shrink-0 ${
                               index === currentQuestionIndex
                                 ? 'bg-purple-500 text-white'
                                 : 'bg-gray-200 text-gray-600'
                             }`}
                           >
                             {index + 1}
                           </div>
                         );
                       })}
                     </div>
                     <div className="absolute right-0 top-0 w-4 h-8 bg-gradient-to-l from-white to-transparent pointer-events-none"></div>
                   </div>
                  
                  <div className="w-10 h-10"></div>
                </div>
                
                                 {/* Current Question */}
                 <div className="space-y-6">
                   <h2 className="text-2xl font-bold text-gray-800 text-center">
                     {(() => {
                       const question = personalityQuestions[currentQuestionIndex].question.toUpperCase();
                       const words = question.split(' ');
                       const lastWord = words.pop();
                       return (
                         <>
                           {words.join(' ')} <span className="text-purple-600">{lastWord}</span>?
                         </>
                       );
                     })()}
                   </h2>
                  <div className="space-y-4">
                    {personalityQuestions[currentQuestionIndex].options.map((option, optionIndex) => (
                      <button
                        key={option.value}
                        onClick={() => handlePersonalityAnswer(personalityQuestions[currentQuestionIndex].id, option.value)}
                        disabled={savingAnswer === personalityQuestions[currentQuestionIndex].id}
                                                 className={`w-full p-5 rounded-xl text-center transition-all duration-300 border-2 shadow-sm transform hover:scale-105 ${
                           formData.personalityAnswers[personalityQuestions[currentQuestionIndex].id] === option.value
                             ? 'bg-purple-500/90 text-white border-purple-400 shadow-lg scale-105 backdrop-blur-sm'
                             : 'bg-white/80 text-gray-800 border-gray-200 hover:border-purple-500 hover:border-solid hover:shadow-lg hover:bg-purple-50/80 backdrop-blur-sm'
                         } ${savingAnswer === personalityQuestions[currentQuestionIndex].id ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                                                 {formData.personalityAnswers[personalityQuestions[currentQuestionIndex].id] === option.value ? (
                           <div className="flex items-center justify-center">
                             <span className="text-lg font-medium">{option.label}</span>
                             <svg className="w-5 h-5 text-white ml-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                             </svg>
                           </div>
                         ) : (
                           <span className="text-lg font-medium">{option.label}</span>
                         )}
                      </button>
                    ))}
                  </div>
                </div>
                
                {/* Submit Journey Button */}
                {currentQuestionIndex === personalityQuestions.length - 1 && (
                  <div className="flex justify-center mt-8">
                    <button
                      onClick={handleSubmitJourney}
                      disabled={!canProceedPersonality() || loading}
                      className={`px-8 py-3 rounded-xl font-bold transition-all ${
                        canProceedPersonality() && !loading
                          ? 'bg-purple-500 text-white hover:bg-purple-600 shadow-lg'
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      Submit Journey
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-600">No questions available</p>
              </div>
            )}
          </div>
        );

      case 'personalityScore':
        return (
          <PersonalityScoreStep 
            formData={formData}
            personalityQuestions={personalityQuestions}
            onNext={() => dispatch(setCurrentStep(4))}
            onBack={() => dispatch(setCurrentStep(2))}
          />
        );

      case 'identity':
        return (
          <div className="space-y-6">
            {identityQuestions.length > 0 ? (
              <div>
                {/* Question Progress at Top */}
                <div className="text-center mb-6">
                  <p className="text-gray-600 text-sm font-medium">
                    Question {currentIdentityIndex + 1} of {(() => {
                      // Calculate total questions excluding children for single users
                      const isSingle = formData.relationship_status === 'single';
                      const childrenIndex = identityQuestions.findIndex(q => q.id === 'children');
                      if (isSingle && childrenIndex !== -1) {
                        return identityQuestions.length - 1;
                      }
                      return identityQuestions.length;
                    })()}
                  </p>
                  <p className="text-purple-600 text-xs mt-1">
                    Click an answer to continue automatically
                  </p>
                </div>
                
                {/* Steps Navigation */}
                <div className="flex justify-between items-center mb-6">
                  <button
                    onClick={() => dispatch(setCurrentIdentityIndex(Math.max(0, currentIdentityIndex - 1)))}
                    disabled={currentIdentityIndex === 0}
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                      currentIdentityIndex === 0
                        ? 'text-gray-400 cursor-not-allowed'
                        : 'text-purple-600 hover:bg-purple-100 border-2 border-purple-200'
                    }`}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  
                  <div className="relative">
                    <div className="flex space-x-2 overflow-x-auto max-w-32 scrollbar-hide" ref={(el) => {
                      if (el) {
                        // Auto-scroll to current question
                        const currentCircle = el.children[currentIdentityIndex];
                        if (currentCircle) {
                          currentCircle.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
                        }
                      }
                    }}>
                      {identityQuestions.map((question, index) => {
                        // Skip children question for single users
                        const isSingle = formData.relationship_status === 'single';
                        if (isSingle && question.id === 'children') {
                          return null;
                        }
                        
                        // Only show 3 circles: previous, current, next
                        const shouldShow = index >= Math.max(0, currentIdentityIndex - 1) && 
                                         index <= Math.min(identityQuestions.length - 1, currentIdentityIndex + 1);
                        
                        if (!shouldShow) return null;
                        
                        return (
                          <div
                            key={index}
                            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all flex-shrink-0 ${
                              index === currentIdentityIndex
                                ? 'bg-purple-500 text-white'
                                : 'bg-gray-200 text-gray-600'
                            }`}
                          >
                            {index + 1}
                          </div>
                        );
                      })}
                    </div>
                    <div className="absolute right-0 top-0 w-4 h-8 bg-gradient-to-l from-white to-transparent pointer-events-none"></div>
                  </div>
                  
                  <div className="w-10 h-10"></div>
                </div>
                
                {/* Current Question */}
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-gray-800 text-center">
                    {identityQuestions[currentIdentityIndex].question}
                  </h2>
                  
                  {identityQuestions[currentIdentityIndex].type === 'select' ? (
                    <div className="space-y-4">
                      {identityQuestions[currentIdentityIndex].options.map((option) => (
                        <button
                          key={option.value}
                          onClick={() => handleIdentityInput(identityQuestions[currentIdentityIndex].id, option.value)}
                          disabled={savingAnswer === identityQuestions[currentIdentityIndex].id}
                          className={`w-full p-5 rounded-xl text-center transition-all duration-300 border-2 shadow-sm transform hover:scale-105 ${
                            formData[identityQuestions[currentIdentityIndex].id] === option.value
                              ? 'bg-purple-500/90 text-white border-purple-400 shadow-lg scale-105 backdrop-blur-sm'
                              : 'bg-white/80 text-gray-800 border-gray-200 hover:border-purple-500 hover:border-solid hover:shadow-lg hover:bg-purple-50/80 backdrop-blur-sm'
                          } ${savingAnswer === identityQuestions[currentIdentityIndex].id ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                          {formData[identityQuestions[currentIdentityIndex].id] === option.value ? (
                            <div className="flex items-center justify-center">
                              <span className="text-lg font-medium">{option.label}</span>
                              <svg className="w-5 h-5 text-white ml-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            </div>
                          ) : (
                            <span className="text-lg font-medium">{option.label}</span>
                          )}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div>
                      <input
                        type={identityQuestions[currentIdentityIndex].type}
                        placeholder={identityQuestions[currentIdentityIndex].placeholder}
                        value={formData[identityQuestions[currentIdentityIndex].id] || ''}
                        onChange={(e) => handleIdentityInput(identityQuestions[currentIdentityIndex].id, e.target.value)}
                        disabled={savingAnswer === identityQuestions[currentIdentityIndex].id}
                        className={`w-full p-5 rounded-xl bg-white/80 text-gray-800 border border-gray-200 focus:border-purple-400 focus:outline-none transition-all text-lg shadow-sm hover:shadow-md backdrop-blur-sm ${
                          savingAnswer === identityQuestions[currentIdentityIndex].id ? 'opacity-50 cursor-not-allowed' : ''
                        } ${formData[identityQuestions[currentIdentityIndex].id] && !isValidAge(formData[identityQuestions[currentIdentityIndex].id]) ? 'border-red-500' : ''}`}
                      />
                      
                      {/* Age validation error message for DOB */}
                      {formData[identityQuestions[currentIdentityIndex].id] && 
                       identityQuestions[currentIdentityIndex].type === 'date' && 
                       !isValidAge(formData[identityQuestions[currentIdentityIndex].id]) && (
                        <div className="mt-2 text-red-500 text-sm text-center">
                          You must be at least 18 years old to continue
                        </div>
                      )}
                      
                      {/* Next Button for Text Input Questions - Hide for DOB (last question) */}
                      {currentIdentityIndex < identityQuestions.length - 1 && (
                        <div className="flex justify-center mt-6">
                          <button
                            onClick={handleIdentityNext}
                            disabled={!formData[identityQuestions[currentIdentityIndex].id] || formData[identityQuestions[currentIdentityIndex].id].trim() === '' || savingAnswer === identityQuestions[currentIdentityIndex].id}
                            className={`px-8 py-3 rounded-xl font-bold transition-all ${
                              formData[identityQuestions[currentIdentityIndex].id] && formData[identityQuestions[currentIdentityIndex].id].trim() !== '' && savingAnswer !== identityQuestions[currentIdentityIndex].id
                                ? 'bg-purple-500 text-white hover:bg-purple-600 shadow-lg'
                                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            }`}
                          >
                            Next
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
                
                {/* Complete Button */}
                {currentIdentityIndex === identityQuestions.length - 1 && (
                  <div className="flex justify-center mt-8">
                    <button
                      onClick={handleIdentityComplete}
                      disabled={!canProceedIdentity() || loading || savingAnswer === identityQuestions[currentIdentityIndex].id}
                      className={`px-8 py-3 rounded-xl font-bold transition-all ${
                        canProceedIdentity() && !loading && savingAnswer !== identityQuestions[currentIdentityIndex].id
                          ? 'bg-purple-500 text-white hover:bg-purple-600 shadow-lg'
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      {loading ? 'Completing...' : 'Complete'}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-600">No identity questions available</p>
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Desktop Layout */}
      <div className="hidden md:block">
        {/* Status Bar */}
        <div className="absolute top-0 left-0 right-0 z-50 flex justify-between items-center px-6 py-2 text-white">
          <span className="text-sm font-medium">9:41</span>
          <div className="flex items-center space-x-2">
            <div className="w-6 h-3 bg-white rounded-sm"></div>
            <div className="w-6 h-3 bg-white rounded-sm"></div>
          </div>
        </div>

        {/* Header */}
        <div className="absolute top-12 left-0 right-0 z-40 flex justify-between items-center px-6">
          <span className="text-white font-bold text-lg">LOGO</span>
          <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
            </svg>
          </div>
        </div>

                 {/* Background Image */}
         <div 
           className="absolute inset-0 bg-cover bg-center bg-no-repeat"
           style={{ 
             backgroundImage: 'url(/bgp.jpg)' 
           }}
         >
           <div className="absolute inset-0 bg-black/40"></div>
         </div>

                 {/* Main Content */}
         <div className="relative z-30 flex flex-col h-full">
           {/* Top Section with Text Overlay */}
           <div className="flex-1 flex items-center justify-center px-6 pt-20">
             <motion.div 
               key={currentStep}
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ duration: 0.5 }}
               className="text-center"
             >
               {/* Hide heading for personality score step (step 3) */}
               {currentStep !== 3 && (
                 <>
                   <h1 className="text-3xl md:text-4xl font-bold text-white leading-tight mb-4">
                     {steps[currentStep].title}
                   </h1>
                   <p className="text-lg text-white/90 leading-relaxed">
                     {steps[currentStep].subtitle}
                   </p>
                 </>
               )}
             </motion.div>
           </div>

                                         {/* Bottom Section - Fixed for Personality/Identity Steps */}
           <div className={`${
             currentStep === 2 || currentStep === 3 || currentStep === 4
               ? 'fixed bottom-0 left-1/2 transform -translate-x-1/2 bg-white/95 backdrop-blur-sm' 
               : 'bg-gradient-to-b from-purple-600 to-purple-800'
                       } rounded-none p-6 md:max-w-md md:mx-auto ${
              currentStep === 2 || currentStep === 3 || currentStep === 4
                ? 'bg-bottom bg-no-repeat bg-contain bg-fixed w-full max-w-md'
                : 'md:mb-8'
            }`}
           style={{
             height: currentStep === 2 || currentStep === 3 || currentStep === 4 ? '100vh' : 'auto',
             zIndex: currentStep === 2 || currentStep === 3 || currentStep === 4 ? '40' : 'auto'
           }}>
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              {/* Show heading and subheading for personality/identity steps - Show on desktop in child div */}
              {(currentStep === 2 || currentStep === 3 || currentStep === 4) && (
                <div className="text-center mb-8">
                  <h1 className="text-2xl font-bold text-gray-800 leading-tight mb-2">
                    {steps[currentStep].title}
                  </h1>
                  <p className="text-gray-600 leading-relaxed">
                    {steps[currentStep].subtitle}
                  </p>
                </div>
              )}
              
              {renderStep()}

                             {/* Navigation Buttons - Only show on desktop */}
               <div className="hidden md:flex justify-end items-center mt-8">
                 {/* Hide Next button during personality and identity steps as they're handled by question navigation */}
                 {currentStep !== 2 && currentStep !== 3 && currentStep !== 4 && (
                   <button
                     onClick={handleNext}
                     disabled={!canProceed() || loading}
                     className={`px-8 py-3 rounded-xl font-bold transition-all ${
                       canProceed() && !loading
                         ? 'bg-white text-purple-900 hover:bg-gray-50'
                         : 'bg-white/20 text-white/60 cursor-not-allowed'
                     }`}
                   >
                     {currentStep === steps.length - 1 ? 'Complete' : 'Next'}
                   </button>
                 )}
               </div>
            </motion.div>
          </div>
        </div>
      </div>

             {/* Mobile Layout - Only Child Div */}
                <div className="md:hidden min-h-screen bg-white relative">
                     {/* Background Image for Mobile */}
           {(currentStep === 0 || currentStep === 1) && (
             <div 
               className="absolute inset-0 bg-cover bg-center bg-no-repeat"
               style={{ backgroundImage: 'url(/bgp.jpg)' }}
             >
               <div className="absolute inset-0 bg-black/40"></div>
             </div>
           )}

          
         <motion.div
           key={currentStep}
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.5 }}
            className="p-6 h-full relative z-10"
         >
           {/* Mobile Header */}
           <div className="text-center mb-8">
               <h1 className={`text-2xl font-bold leading-tight mb-2 ${
                 currentStep === 0 || currentStep === 1 ? 'text-white' : 'text-gray-800'
               }`}>
               {steps[currentStep].title}
             </h1>
           </div>
           
           {renderStep()}
         </motion.div>
       </div>
    </div>
  );
};

export default OnboardingFlow; 