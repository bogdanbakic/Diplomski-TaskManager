using TaskManager.Domain.Entities.Enums;

namespace TaskManager.Application.DTOs
{
    public record UpdateTaskDto
    (
        string Name,
        string Description,
        TaskItemStatus Status,
        DateTime StartDate,
        DateTime EndDate,
        string? AssignedToUserId
    );
}