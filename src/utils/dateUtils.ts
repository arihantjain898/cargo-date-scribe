
export const isDateOverdue = (dateString: string): boolean => {
  if (!dateString) return false;
  const date = new Date(dateString);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return date < today;
};

export const isDateWithinDays = (dateString: string, days: number): boolean => {
  if (!dateString) return false;
  const date = new Date(dateString);
  const today = new Date();
  const futureDate = new Date(today);
  futureDate.setDate(today.getDate() + days);
  
  today.setHours(0, 0, 0, 0);
  futureDate.setHours(23, 59, 59, 999);
  
  return date >= today && date <= futureDate;
};

export const getContainerVolumeColor = (count: string): string => {
  const num = parseInt(count) || 0;
  if (num === 0) return 'bg-gray-200';
  if (num <= 2) return 'bg-blue-300';
  if (num <= 5) return 'bg-blue-400';
  if (num <= 10) return 'bg-blue-500';
  return 'bg-blue-600';
};
