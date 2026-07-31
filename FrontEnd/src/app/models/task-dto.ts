import { TaskItemStatus } from "./task-item-status";

export interface TaskDto {
    id: number;
    name: string;
    description: string;
    status: TaskItemStatus;
    startDate: Date;
    endDate: Date;
    createdByUserId: string;
    assignedToUserId: string | null;
}