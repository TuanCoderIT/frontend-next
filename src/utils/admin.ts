// Admin utility functions
export const roleColors = {
  admin: 'bg-red-100 text-red-800 border-red-200',
  teacher: 'bg-blue-100 text-blue-800 border-blue-200',
  moderator: 'bg-purple-100 text-purple-800 border-purple-200',
  user: 'bg-gray-100 text-gray-800 border-gray-200',
};

export const statusColors = {
  active: 'bg-green-100 text-green-800 border-green-200',
  inactive: 'bg-gray-100 text-gray-800 border-gray-200',
  draft: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  published: 'bg-green-100 text-green-800 border-green-200',
  archived: 'bg-gray-100 text-gray-800 border-gray-200',
};

export const difficultyColors = {
  'Beginner': 'bg-green-100 text-green-800 border-green-200',
  'Intermediate': 'bg-yellow-100 text-yellow-800 border-yellow-200',
  'Advanced': 'bg-red-100 text-red-800 border-red-200',
};

export const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export const formatDateTime = (dateString: string) => {
  return new Date(dateString).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const getInitials = (name: string) => {
  return name
    .split(' ')
    .map((word) => word.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

export const generateAvatarColor = (name: string) => {
  const colors = [
    'bg-blue-500',
    'bg-green-500',
    'bg-purple-500',
    'bg-pink-500',
    'bg-indigo-500',
    'bg-red-500',
    'bg-yellow-500',
    'bg-teal-500',
  ];
  const index = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return colors[index % colors.length];
};

export const truncateText = (text: string, maxLength: number = 50) => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
};

export const calculateProgress = (completed: number, total: number) => {
  if (total === 0) return 0;
  return Math.round((completed / total) * 100);
};
