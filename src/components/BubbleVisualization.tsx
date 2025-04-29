import { useEffect, useRef } from 'react';
import { useUser } from '../context/UserContext';

const BubbleVisualization = () => {
  const { getBubbleVisualization, userState } = useUser();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();

  // Calculate bubble score color based on value
  const getBubbleScoreColor = () => {
    const score = userState.bubbleScore;
    if (score < 30) return '#2ecc71'; // Green for low bubble score
    if (score < 70) return '#f39c12'; // Yellow/Orange for medium
    return '#e74c3c'; // Red for high bubble score
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas dimensions with higher resolution for retina displays
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();

    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;

    ctx.scale(dpr, dpr);
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;

    // Animation variables
    let animationTime = 0;

    // Get bubble data
    const bubbles = getBubbleVisualization();

    // Animation function
    const animate = () => {
      animationTime += 0.01;

      // Clear canvas
      ctx.clearRect(0, 0, rect.width, rect.height);

      // Calculate positions for bubbles
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const radius = Math.min(centerX, centerY) * 0.7;

      // Draw background pattern
      drawBackgroundPattern(ctx, rect.width, rect.height);

      // Draw connections first (so they appear behind bubbles)
      drawConnections(ctx, bubbles, centerX, centerY, radius, animationTime);

      // Draw bubbles in a circle
      drawBubbles(ctx, bubbles, centerX, centerY, radius, animationTime);

      // Draw center bubble (user)
      drawCenterBubble(ctx, centerX, centerY, animationTime);

      // Continue animation
      animationRef.current = requestAnimationFrame(animate);
    };

    // Start animation
    animate();

    // Cleanup function
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [getBubbleVisualization, userState]);

  // Draw background pattern
  const drawBackgroundPattern = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    ctx.save();

    // Draw subtle grid pattern
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.03)';
    ctx.lineWidth = 1;

    const gridSize = 20;

    // Vertical lines
    for (let x = 0; x <= width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }

    // Horizontal lines
    for (let y = 0; y <= height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    ctx.restore();
  };

  // Draw connections between user and topic bubbles
  const drawConnections = (
    ctx: CanvasRenderingContext2D,
    bubbles: ReturnType<typeof getBubbleVisualization>,
    centerX: number,
    centerY: number,
    radius: number,
    time: number
  ) => {
    const angleStep = (2 * Math.PI) / bubbles.length;

    bubbles.forEach((bubble, index) => {
      const angle = index * angleStep;

      // Add slight movement to the bubbles
      const wobble = Math.sin(time * 2 + index) * 5;

      // Calculate position
      const x = centerX + Math.cos(angle) * radius * 0.7 + wobble;
      const y = centerY + Math.sin(angle) * radius * 0.7 + wobble;

      // Draw connection to center if there are interactions
      if (bubble.size > 0.5) {
        // Create gradient for connection
        const gradient = ctx.createLinearGradient(centerX, centerY, x, y);
        gradient.addColorStop(0, 'rgba(67, 97, 238, 0.3)');
        gradient.addColorStop(1, bubble.topic.color + '66');

        // Draw connection with pulse effect
        const pulseEffect = Math.sin(time * 3) * 0.2 + 0.8;

        ctx.beginPath();
        ctx.moveTo(centerX, centerY);

        // Create a curved line instead of straight
        const controlPointX = (centerX + x) / 2 + Math.sin(angle) * 30;
        const controlPointY = (centerY + y) / 2 - Math.cos(angle) * 30;

        ctx.quadraticCurveTo(controlPointX, controlPointY, x, y);
        ctx.strokeStyle = gradient;
        ctx.lineWidth = bubble.size * 3 * pulseEffect;
        ctx.stroke();

        // Add small particles moving along the connection
        if (bubble.size > 0.8) {
          drawParticlesAlongConnection(ctx, centerX, centerY, controlPointX, controlPointY, x, y, time, bubble.topic.color);
        }
      }
    });
  };

  // Draw particles moving along connections
  const drawParticlesAlongConnection = (
    ctx: CanvasRenderingContext2D,
    x1: number, y1: number,
    cpx: number, cpy: number,
    x2: number, y2: number,
    time: number,
    color: string
  ) => {
    // Number of particles based on userState.bubbleScore
    const particleCount = Math.max(1, Math.floor(userState.bubbleScore / 20));

    for (let i = 0; i < particleCount; i++) {
      // Calculate position along the curve (0 to 1)
      const t = ((time * 0.5) + (i / particleCount)) % 1;

      // Quadratic bezier formula
      const u = 1 - t;
      const tt = t * t;
      const uu = u * u;

      const px = uu * x1 + 2 * u * t * cpx + tt * x2;
      const py = uu * y1 + 2 * u * t * cpy + tt * y2;

      // Draw particle
      ctx.beginPath();
      ctx.arc(px, py, 2, 0, 2 * Math.PI);
      ctx.fillStyle = color + 'CC';
      ctx.fill();

      // Add glow effect
      ctx.beginPath();
      ctx.arc(px, py, 4, 0, 2 * Math.PI);
      ctx.fillStyle = color + '33';
      ctx.fill();
    }
  };

  // Draw the topic bubbles
  const drawBubbles = (
    ctx: CanvasRenderingContext2D,
    bubbles: ReturnType<typeof getBubbleVisualization>,
    centerX: number,
    centerY: number,
    radius: number,
    time: number
  ) => {
    const angleStep = (2 * Math.PI) / bubbles.length;

    bubbles.forEach((bubble, index) => {
      const angle = index * angleStep;

      // Add slight movement to the bubbles
      const wobble = Math.sin(time * 2 + index) * 5;

      // Calculate position
      const x = centerX + Math.cos(angle) * radius * 0.7 + wobble;
      const y = centerY + Math.sin(angle) * radius * 0.7 + wobble;

      // Calculate bubble radius based on size with slight pulsing
      const pulse = 1 + Math.sin(time * 3 + index) * 0.05;
      const bubbleRadius = (20 + (bubble.size * 20)) * pulse;

      // Draw bubble glow
      ctx.beginPath();
      ctx.arc(x, y, bubbleRadius + 5, 0, 2 * Math.PI);
      ctx.fillStyle = bubble.topic.color + '33';
      ctx.fill();

      // Draw bubble
      ctx.beginPath();
      ctx.arc(x, y, bubbleRadius, 0, 2 * Math.PI);

      // Create gradient fill
      const gradient = ctx.createRadialGradient(
        x - bubbleRadius * 0.3, y - bubbleRadius * 0.3, 0,
        x, y, bubbleRadius
      );
      gradient.addColorStop(0, bubble.topic.color + 'FF');
      gradient.addColorStop(1, bubble.topic.color + 'CC');

      ctx.fillStyle = gradient;
      ctx.fill();

      // Add highlight
      ctx.beginPath();
      ctx.arc(x - bubbleRadius * 0.3, y - bubbleRadius * 0.3, bubbleRadius * 0.2, 0, 2 * Math.PI);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
      ctx.fill();

      // Draw topic name
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 14px var(--font-secondary)';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(bubble.topic.name, x, y);

      // Add shadow
      ctx.shadowColor = 'rgba(0, 0, 0, 0.2)';
      ctx.shadowBlur = 10;
      ctx.shadowOffsetX = 2;
      ctx.shadowOffsetY = 2;
    });

    // Reset shadow
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
  };

  // Draw the center bubble (user)
  const drawCenterBubble = (
    ctx: CanvasRenderingContext2D,
    centerX: number,
    centerY: number,
    time: number
  ) => {
    // Pulse effect
    const pulse = 1 + Math.sin(time * 2) * 0.05;
    const bubbleRadius = 35 * pulse;

    // Draw glow based on bubble score
    ctx.beginPath();
    ctx.arc(centerX, centerY, bubbleRadius + 10, 0, 2 * Math.PI);
    ctx.fillStyle = getBubbleScoreColor() + '33';
    ctx.fill();

    // Draw center bubble
    ctx.beginPath();
    ctx.arc(centerX, centerY, bubbleRadius, 0, 2 * Math.PI);

    // Create gradient fill
    const gradient = ctx.createRadialGradient(
      centerX - bubbleRadius * 0.3, centerY - bubbleRadius * 0.3, 0,
      centerX, centerY, bubbleRadius
    );

    // Gradient color based on bubble score
    gradient.addColorStop(0, 'rgba(67, 97, 238, 1)');
    gradient.addColorStop(1, 'rgba(58, 12, 163, 1)');

    ctx.fillStyle = gradient;
    ctx.fill();

    // Add highlight
    ctx.beginPath();
    ctx.arc(centerX - bubbleRadius * 0.3, centerY - bubbleRadius * 0.3, bubbleRadius * 0.2, 0, 2 * Math.PI);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.fill();

    // Draw user icon in center
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 16px var(--font-secondary)';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('用户', centerX, centerY);
  };

  return (
    <div className="bubble-visualization">
      <h2>泡沫可视化</h2>
      <p className="visualization-description">
        {userState.totalInteractions === 0
          ? '与内容互动以查看你的信息泡沫如何形成。'
          : `泡沫指数: ${userState.bubbleScore.toFixed(0)}% - ${
              userState.bubbleScore < 30
                ? '你的信息流多样化'
                : userState.bubbleScore < 70
                  ? '你的信息流开始形成泡沫'
                  : '你的信息流已高度同质化'
            }`
        }
      </p>
      <canvas
        ref={canvasRef}
        className="bubble-canvas"
      />
    </div>
  );
};

export default BubbleVisualization;
