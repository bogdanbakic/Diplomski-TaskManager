using TaskManager.Application.DTOs;
using TaskManager.Domain.Entities;
using TaskManager.Domain.Entities.Enums;

namespace TaskManager.Application.Mappers
{
    public static class TaskMapper
    {
        public static TaskDto ToDto(TaskItem entity) =>
            new TaskDto(entity.Id, entity.Name, entity.Description, entity.Status, entity.StartDate, entity.EndDate,
                entity.CreatedByUserId, entity.AssignedToUserId);

        public static TaskItem ToEntity(CreateTaskDto dto, string createdByUserId) =>
            new TaskItem()
            {
                Name = dto.Name,
                Description = dto.Description,
                Status = TaskItemStatus.ToDo,
                StartDate = dto.StartDate,
                EndDate = dto.EndDate,
                CreatedByUserId = createdByUserId,
                AssignedToUserId = dto.AssignedToUserId
            };

        public static void UpdateEntity(TaskItem entity, UpdateTaskDto dto)
        {
            entity.Name = dto.Name;
            entity.Description = dto.Description;
            entity.Status = dto.Status;
            entity.StartDate = dto.StartDate;
            entity.EndDate = dto.EndDate;
            entity.AssignedToUserId = dto.AssignedToUserId;
            entity.Modified = DateTime.Now;
        }
    }
}