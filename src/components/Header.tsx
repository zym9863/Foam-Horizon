import { useUser } from '../context/UserContext';

const Header = () => {
  const { userState, resetPreferences } = useUser();

  // Calculate bubble score color based on value
  const getBubbleScoreColor = () => {
    const score = userState.bubbleScore;
    if (score < 30) return '#2ecc71'; // Green for low bubble score
    if (score < 70) return '#f39c12'; // Yellow/Orange for medium
    return '#e74c3c'; // Red for high bubble score
  };

  return (
    <header className="app-header">
      <div className="header-content">
        <div className="header-title">
          <h1>泡沫视界</h1>
          <span className="header-subtitle">Foam Horizon</span>
        </div>
        <div className="header-stats">
          <div className="stat-item">
            <span className="stat-label">互动次数</span>
            <span className="stat-value">{userState.totalInteractions}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">泡沫指数</span>
            <span className="stat-value" style={{ color: getBubbleScoreColor() }}>
              {userState.bubbleScore.toFixed(0)}%
              <div
                className="bubble-indicator"
                style={{
                  width: `${Math.max(5, userState.bubbleScore)}%`,
                  backgroundColor: getBubbleScoreColor()
                }}
              />
            </span>
          </div>
          <button
            className="reset-button"
            onClick={resetPreferences}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '6px' }}>
              <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path>
              <path d="M3 3v5h5"></path>
            </svg>
            重置偏好
          </button>
        </div>
      </div>
      <p className="header-description">
        随着你与内容的互动，信息流会逐渐适应你的偏好，形成"信息茧房"。
        点击内容卡片与其互动，观察泡沫如何形成。
      </p>
    </header>
  );
};

export default Header;
