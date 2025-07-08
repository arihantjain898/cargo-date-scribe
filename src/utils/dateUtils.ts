
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
  
  // For day 0 (today), check if it's exactly today
  if (days === 0) {
    const targetDate = new Date(date);
    targetDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);
    return targetDate.getTime() === today.getTime();
  }
  
  // For other days, check if the date is exactly X days from today
  const targetDate = new Date(today);
  targetDate.setDate(today.getDate() + days);
  targetDate.setHours(0, 0, 0, 0);
  
  const checkDate = new Date(date);
  checkDate.setHours(0, 0, 0, 0);
  
  return checkDate.getTime() === targetDate.getTime();
};

export const getContainerVolumeColor = (count: string): string => {
  const num = parseInt(count) || 0;
  if (num === 0) return 'bg-gray-200';
  if (num <= 2) return 'bg-blue-300';
  if (num <= 5) return 'bg-blue-400';
  if (num <= 10) return 'bg-blue-500';
  return 'bg-blue-600';
};
