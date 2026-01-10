interface QuizTimerProps {
  timeLeft: number;
}

export default function QuizTimer({ timeLeft }: QuizTimerProps) {
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  const isLowTime = timeLeft < 300; // Less than 5 minutes
  const isCriticalTime = timeLeft < 60; // Less than 1 minute

  return (
    <div
      className={`flex items-center px-4 py-2 rounded-lg font-semibold ${
        isCriticalTime
          ? "bg-red-100 text-red-800"
          : isLowTime
          ? "bg-yellow-100 text-yellow-800"
          : "bg-green-100 text-green-800"
      }`}
    >
      <svg
        className="w-5 h-5 mr-2"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      <span className="text-lg">
        {minutes.toString().padStart(2, "0")}:
        {seconds.toString().padStart(2, "0")}
      </span>
    </div>
  );
}
