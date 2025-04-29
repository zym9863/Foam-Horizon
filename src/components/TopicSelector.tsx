import { topics } from '../data/topics';
import { useUser } from '../context/UserContext';

const TopicSelector = () => {
  const { userState, interactWithTopic } = useUser();

  return (
    <div className="topic-selector">
      <h2>主题</h2>
      <div className="topics-list">
        {topics.map(topic => {
          // Find user preference for this topic
          const preference = userState.preferences.find(p => p.topicId === topic.id);
          const interactionCount = preference ? preference.interactionCount : 0;

          // Calculate intensity based on interaction count
          const maxInteractions = Math.max(
            1,
            ...userState.preferences.map(p => p.interactionCount)
          );
          const intensity = interactionCount / maxInteractions;

          return (
            <div
              key={topic.id}
              className={`topic-item ${interactionCount > 0 ? 'has-interactions' : ''}`}
              onClick={() => interactWithTopic(topic.id)}
              style={{
                borderColor: interactionCount > 0 ? topic.color : 'var(--color-border)',
                backgroundColor: interactionCount > 0 ? `${topic.color}${Math.floor(intensity * 20 + 10).toString(16)}` : 'transparent'
              }}
            >
              <div
                className="topic-color"
                style={{
                  backgroundColor: topic.color,
                  transform: interactionCount > 0 ? `scale(${1 + (intensity * 0.3)})` : 'scale(1)'
                }}
              />
              <div className="topic-info">
                <div className="topic-name">{topic.name}</div>
                <div className="topic-description">{topic.description}</div>
              </div>
              {interactionCount > 0 && (
                <div
                  className="topic-interactions"
                  style={{
                    backgroundColor: topic.color,
                    transform: `scale(${1 + (intensity * 0.2)})`
                  }}
                >
                  {interactionCount}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TopicSelector;
