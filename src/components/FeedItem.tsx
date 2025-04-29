import { useState } from 'react';
import { Post, Topic } from '../types';
import { useUser } from '../context/UserContext';
import { topics } from '../data/topics';

interface FeedItemProps {
  post: Post;
}

const FeedItem = ({ post }: FeedItemProps) => {
  const { interactWithTopic } = useUser();
  const [expanded, setExpanded] = useState(false);

  // Find the topic for this post
  const topic = topics.find(t => t.id === post.topicId) as Topic;

  // Format the timestamp
  const formattedDate = new Date(post.timestamp).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  const handleClick = () => {
    setExpanded(!expanded);
    interactWithTopic(post.topicId);
  };

  // Prevent button click from triggering the parent div click
  const handleButtonClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setExpanded(!expanded);
    interactWithTopic(post.topicId);
  };

  return (
    <div
      className={`feed-item ${expanded ? 'expanded' : ''}`}
      onClick={handleClick}
      style={{ borderLeft: `4px solid ${topic.color}` }}
    >
      <div className="feed-item-header">
        <div className="topic-tag" style={{ backgroundColor: topic.color }}>
          {topic.name}
        </div>
        <div className="post-date">{formattedDate}</div>
      </div>

      {post.imageUrl && (
        <div className="feed-item-image">
          <img src={post.imageUrl} alt={post.title} />
        </div>
      )}

      <h3 className="feed-item-title">{post.title}</h3>

      <div className="feed-item-content">
        <p>{expanded ? post.content : `${post.content.substring(0, 100)}...`}</p>
      </div>

      <div className="feed-item-footer">
        <button
          className="read-more-button"
          onClick={handleButtonClick}
        >
          {expanded ? (
            <>
              收起
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: '4px' }}>
                <polyline points="18 15 12 9 6 15"></polyline>
              </svg>
            </>
          ) : (
            <>
              阅读更多
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: '4px' }}>
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default FeedItem;
