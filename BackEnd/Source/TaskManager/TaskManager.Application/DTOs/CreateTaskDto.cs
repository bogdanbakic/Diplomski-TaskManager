namespace TaskManager.Application.DTOs
{
    public record CreateTaskDto
    (
        string Name,
        string Description,
        DateTime StartDate,
        DateTime EndDate,
        string? AssignedToUserId
    );
}