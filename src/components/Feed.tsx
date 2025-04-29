import { useState, useEffect } from 'react';
import { Post } from '../types';
import { posts as allPosts } from '../data/topics';
import { useUser } from '../context/UserContext';
import FeedItem from './FeedItem';

const Feed = () => {
  const { getFilteredPosts, userState } = useUser();
  const [displayedPosts, setDisplayedPosts] = useState<Post[]>([]);

  useEffect(() => {
    // Apply filtering based on user preferences
    const filteredPosts = getFilteredPosts(allPosts);
    setDisplayedPosts(filteredPosts);
  }, [userState, getFilteredPosts]);

  // Get warning message based on bubble score
  const getWarningMessage = () => {
    const score = userState.bubbleScore;
    if (score < 50) return '你的信息流开始形成泡沫';
    if (score < 80) return '你的信息流已形成明显泡沫';
    return '警告：你的信息流已高度同质化';
  };

  return (
    <div className="feed-container">
      <div className="feed-header">
        <h2>信息流</h2>
        <div className="feed-stats">
          {userState.bubbleScore > 30 && (
            <div className="bubble-warning">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '8px' }}>
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                <line x1="12" y1="9" x2="12" y2="13"></line>
                <line x1="12" y1="17" x2="12.01" y2="17"></line>
              </svg>
              {getWarningMessage()} ({userState.bubbleScore.toFixed(0)}%)
            </div>
          )}
        </div>
      </div>

      <div className="feed-items">
        {displayedPosts.length > 0 ? (
          displayedPosts.map(post => (
            <FeedItem key={post.id} post={post} />
          ))
        ) : (
          <div className="no-posts-message">
            <p>没有符合条件的内容。尝试重置偏好以查看更多内容。</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Feed;
