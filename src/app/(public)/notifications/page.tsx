import { Metadata } from 'next';
import NotificationPage from '@/components/common/NotificationPage';

export const metadata: Metadata = {
  title: 'Thông báo - IntelliQuiz',
  description: 'Xem tất cả thông báo của bạn',
};

export default function NotificationsPage() {
  return <NotificationPage />;
}