using TaskManager.Domain.Entities.Enums;

namespace TaskManager.Application.DTOs
{
    public record TaskDto
    (
        int Id,
        string Name,
        string Description,
        TaskItemStatus Status,
        DateTime StartDate,
        DateTime EndDate,
        string CreatedByUserId,
        string? AssignedToUserId
    );
}