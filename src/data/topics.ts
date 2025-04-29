import { Post, Topic } from '../types';

export const topics: Topic[] = [
  {
    id: 'technology',
    name: '科技',
    color: '#3498db',
    description: '最新科技新闻和创新',
  },
  {
    id: 'health',
    name: '健康',
    color: '#2ecc71',
    description: '健康生活方式和医疗进展',
  },
  {
    id: 'politics',
    name: '政治',
    color: '#e74c3c',
    description: '政治新闻和分析',
  },
  {
    id: 'entertainment',
    name: '娱乐',
    color: '#9b59b6',
    description: '电影、音乐和名人新闻',
  },
  {
    id: 'science',
    name: '科学',
    color: '#f39c12',
    description: '科学发现和研究',
  },
  {
    id: 'sports',
    name: '体育',
    color: '#1abc9c',
    description: '体育新闻和赛事',
  },
];

export const generatePosts = (): Post[] => {
  const posts: Post[] = [];
  
  // Generate 5 posts for each topic
  topics.forEach((topic) => {
    for (let i = 1; i <= 5; i++) {
      posts.push({
        id: `${topic.id}-${i}`,
        title: `${topic.name}内容 #${i}`,
        content: `这是关于${topic.name}的第${i}篇文章。这里包含了一些示例内容，展示了信息流中的典型内容。`,
        topicId: topic.id,
        timestamp: Date.now() - Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000), // Random time in the last week
      });
    }
  });
  
  // Sort by timestamp (newest first)
  return posts.sort((a, b) => b.timestamp - a.timestamp);
};

export const posts = generatePosts();
