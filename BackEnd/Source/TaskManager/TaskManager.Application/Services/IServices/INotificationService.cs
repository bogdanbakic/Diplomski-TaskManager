using TaskManager.Application.DTOs;

namespace TaskManager.Application.Services.IServices
{
    public interface INotificationService
    {
        Task<List<NotificationDto>> GetMyNotificationsAsync(string userId);
        Task MarkAsReadAsync(int id, string userId);
        Task CreateAssignmentNotificationAsync(string assignedToUserId, string assignedByUserId, string taskName, int taskId);
        Task CreatePasswordResetRequestAsync(string requestingUserId, string requestingUserName);
    }
}
