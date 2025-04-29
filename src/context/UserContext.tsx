import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Post, Topic, UserPreference, UserState } from '../types';
import { topics } from '../data/topics';

interface UserContextType {
  userState: UserState;
  interactWithTopic: (topicId: string) => void;
  resetPreferences: () => void;
  getFilteredPosts: (posts: Post[]) => Post[];
  getBubbleVisualization: () => { topic: Topic; size: number }[];
}

const initialUserState: UserState = {
  preferences: topics.map(topic => ({
    topicId: topic.id,
    interactionCount: 0,
    lastInteraction: 0,
  })),
  totalInteractions: 0,
  bubbleScore: 0,
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [userState, setUserState] = useState<UserState>(() => {
    // Try to load from localStorage
    const savedState = localStorage.getItem('foamHorizonUserState');
    return savedState ? JSON.parse(savedState) : initialUserState;
  });

  // Save to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem('foamHorizonUserState', JSON.stringify(userState));
  }, [userState]);

  // Interact with a topic (e.g., clicking on a post)
  const interactWithTopic = (topicId: string) => {
    setUserState(prevState => {
      // Update the preference for this topic
      const updatedPreferences = prevState.preferences.map(pref => 
        pref.topicId === topicId 
          ? { 
              ...pref, 
              interactionCount: pref.interactionCount + 1,
              lastInteraction: Date.now(),
            }
          : pref
      );
      
      const totalInteractions = prevState.totalInteractions + 1;
      
      // Calculate bubble score (0-100)
      // Higher score means user is more in a bubble
      const maxInteractions = Math.max(...updatedPreferences.map(p => p.interactionCount));
      const interactionSpread = updatedPreferences.reduce((sum, pref) => sum + pref.interactionCount, 0);
      
      // If no interactions yet, bubble score is 0
      let bubbleScore = 0;
      if (totalInteractions > 0) {
        // Calculate how concentrated the interactions are
        // If all interactions are with one topic, score is high
        // If interactions are evenly spread, score is low
        const evenDistribution = totalInteractions / topics.length;
        const deviation = updatedPreferences.reduce(
          (sum, pref) => sum + Math.abs(pref.interactionCount - evenDistribution),
          0
        );
        const maxPossibleDeviation = 2 * (totalInteractions - evenDistribution);
        bubbleScore = Math.min(100, (deviation / maxPossibleDeviation) * 100);
      }
      
      return {
        preferences: updatedPreferences,
        totalInteractions,
        bubbleScore,
      };
    });
  };

  // Reset all preferences
  const resetPreferences = () => {
    setUserState(initialUserState);
  };

  // Get posts filtered according to user preferences
  const getFilteredPosts = (posts: Post[]): Post[] => {
    if (userState.totalInteractions < 5) {
      // Not enough interactions to filter yet
      return posts;
    }

    // Sort preferences by interaction count (descending)
    const sortedPreferences = [...userState.preferences]
      .sort((a, b) => b.interactionCount - a.interactionCount);
    
    // Calculate weights for each topic based on interaction count
    const totalWeight = sortedPreferences.reduce(
      (sum, pref) => sum + (pref.interactionCount > 0 ? pref.interactionCount : 0), 
      0
    );
    
    // Apply bubble effect based on bubble score
    // Higher bubble score means more filtering
    const bubbleEffect = userState.bubbleScore / 100;
    
    // Create a weighted distribution of posts
    return [...posts].sort((a, b) => {
      const prefA = userState.preferences.find(p => p.topicId === a.topicId);
      const prefB = userState.preferences.find(p => p.topicId === b.topicId);
      
      const weightA = prefA ? prefA.interactionCount / totalWeight : 0;
      const weightB = prefB ? prefB.interactionCount / totalWeight : 0;
      
      // Apply bubble effect and combine with recency
      const scoreA = (weightA * bubbleEffect) + ((1 - bubbleEffect) * (a.timestamp / Date.now()));
      const scoreB = (weightB * bubbleEffect) + ((1 - bubbleEffect) * (b.timestamp / Date.now()));
      
      return scoreB - scoreA;
    });
  };

  // Get data for bubble visualization
  const getBubbleVisualization = () => {
    if (userState.totalInteractions === 0) {
      // Equal size bubbles if no interactions
      return topics.map(topic => ({
        topic,
        size: 1,
      }));
    }

    // Calculate relative sizes based on interaction counts
    const maxInteractions = Math.max(
      1,
      ...userState.preferences.map(p => p.interactionCount)
    );
    
    return topics.map(topic => {
      const pref = userState.preferences.find(p => p.topicId === topic.id);
      const interactionCount = pref ? pref.interactionCount : 0;
      
      // Size is relative to the topic with most interactions
      // Min size is 0.5 to ensure all topics are visible
      const size = interactionCount === 0 
        ? 0.5 
        : 0.5 + (interactionCount / maxInteractions) * 2;
      
      return {
        topic,
        size,
      };
    });
  };

  return (
    <UserContext.Provider
      value={{
        userState,
        interactWithTopic,
        resetPreferences,
        getFilteredPosts,
        getBubbleVisualization,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
