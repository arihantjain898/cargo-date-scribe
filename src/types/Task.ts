export interface Task {
  id: string;
  description: string;
  dueDate: string; // ISO date string
  assignedTo: string;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
}