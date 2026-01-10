import { format, formatDistanceToNow, isToday, isYesterday, parseISO } from 'date-fns';
import { vi } from 'date-fns/locale';

export const formatMessageTime = (dateString: string): string => {
  const date = parseISO(dateString);
  
  if (isToday(date)) {
    return format(date, 'HH:mm');
  }
  
  if (isYesterday(date)) {
    return 'Hôm qua';
  }
  
  // Nếu trong cùng tuần
  const daysDiff = Math.floor(
    (Date.now() - date.getTime()) / (1000 * 60 * 60 * 24)
  );
  
  if (daysDiff < 7) {
    return format(date, 'EEEE', { locale: vi }); // Thứ Hai, Thứ Ba, etc.
  }
  
  // Nếu quá 7 ngày, hiển thị ngày tháng
  return format(date, 'dd/MM/yyyy');
};

export const formatRelativeTime = (dateString: string): string => {
  const date = parseISO(dateString);
  return formatDistanceToNow(date, {
    addSuffix: true,
    locale: vi,
  });
};

export const formatDateSeparator = (dateString: string): string => {
  const date = parseISO(dateString);
  
  if (isToday(date)) {
    return 'Hôm nay';
  }
  
  if (isYesterday(date)) {
    return 'Hôm qua';
  }
  
  return format(date, 'dd MMMM yyyy', { locale: vi });
};

export const isSameDay = (date1: string, date2: string): boolean => {
  const d1 = parseISO(date1);
  const d2 = parseISO(date2);
  return (
    d1.getDate() === d2.getDate() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getFullYear() === d2.getFullYear()
  );
};