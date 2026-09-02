namespace TaskManager.Application.DTOs
{
    public record NotificationDto(int Id, string Message, bool IsRead, DateTime CreatedAt, int? RelatedTaskId);
}
