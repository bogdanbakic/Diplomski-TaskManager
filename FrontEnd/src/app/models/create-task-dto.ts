import { TaskItemStatus } from "./task-item-status";

export interface CreateTaskDto {
    name: string | null;
    description: string | null;
    status: TaskItemStatus | null;
    startDate: Date | null;
    endDate: Date | null;
    assignedToUserId: string | null;
}