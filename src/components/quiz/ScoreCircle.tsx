interface ScoreCircleProps {
  score: number;
  total: number;
  percentage: number;
}

export default function ScoreCircle({
  score,
  total,
  percentage,
}: ScoreCircleProps) {
  const radius = 90;
  const circumference = 2 * Math.PI * radius;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  const getScoreColor = (percentage: number) => {
    if (percentage >= 80) return "#10b981"; // green
    if (percentage >= 60) return "#f59e0b"; // yellow
    return "#ef4444"; // red
  };

  const scoreColor = getScoreColor(percentage);

  return (
    <div className="relative w-64 h-64">
      {/* Background Circle */}
      <svg className="transform -rotate-90 w-64 h-64">
        <circle
          cx="128"
          cy="128"
          r={radius}
          stroke="#e5e7eb"
          strokeWidth="12"
          fill="transparent"
        />
        {/* Progress Circle */}
        <circle
          cx="128"
          cy="128"
          r={radius}
          stroke={scoreColor}
          strokeWidth="12"
          fill="transparent"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
          style={{
            animation: "drawCircle 2s ease-out forwards",
          }}
        />
      </svg>

      {/* Score Text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="text-5xl font-bold" style={{ color: scoreColor }}>
          {percentage}%
        </div>
        <div className="text-gray-600 font-medium mt-2">
          {score}/{total}
        </div>
        <div className="text-sm text-gray-500">Score</div>
      </div>

      <style jsx>{`
        @keyframes drawCircle {
          from {
            stroke-dashoffset: ${circumference};
          }
          to {
            stroke-dashoffset: ${strokeDashoffset};
          }
        }
      `}</style>
    </div>
  );
}
