import { TaskItemStatus } from "./task-item-status";

export interface TaskItem {
  id: number | null;
  name: string | null;
  status: TaskItemStatus | null; 
  description: string | null;
  startDate: Date | null;
  endDate: Date | null;
}
