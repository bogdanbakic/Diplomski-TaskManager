import { TaskItemStatus } from './task-item-status';

export interface TaskItem {
  id: number | null;
  name: string;
  description: string;
  status: TaskItemStatus;
  startDate: Date;
  endDate: Date;
  assignedToUserId: string | null;
  createdByUserId?: string;
}