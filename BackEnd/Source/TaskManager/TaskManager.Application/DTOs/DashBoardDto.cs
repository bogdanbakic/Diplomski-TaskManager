namespace TaskManager.Application.DTOs
{
    public record StatusCountDto(string Status, int Count);

    public record UserTaskCountDto(string UserId, string FullName, int TotalTasks, int CompletedTasks);

    public record DashboardDto
    (
        List<StatusCountDto> TasksByStatus,
        int CreatedByMeCount,
        int AssignedToMeCount,
        int OverdueCount,
        int TotalActiveCount,
        List<UserTaskCountDto>? TasksByUser,
        int? TotalUsersCount,
        int? TotalTasksInSystemCount
    );
}