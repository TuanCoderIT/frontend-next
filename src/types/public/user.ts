// types/User.ts
export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  avatar?: string;
  bio?: string;
  date_of_birth?: string;
  gender?: string;
  phone_number?: string;
  created_at?: string;
  updated_at?: string;
}

export interface UserProfile extends User {
  total_quizzes_completed?: number;
  average_accuracy?: number;
  total_learning_time?: number;
  current_level?: 'Beginner' | 'Intermediate' | 'Advanced';
  achievements?: Achievement[];
}

export interface Achievement {
  id: number;
  name: string;
  description: string;
  icon: string;
  earned_at: string;
  category: string;
}

export interface UpdateProfileData {
  name?: string;
  bio?: string;
  date_of_birth?: string;
  gender?: string;
  phone_number?: string;
  avatar?: File;
}

export interface ChangePasswordData {
  current_password: string;
  new_password: string;
  new_password_confirmation: string;
}
