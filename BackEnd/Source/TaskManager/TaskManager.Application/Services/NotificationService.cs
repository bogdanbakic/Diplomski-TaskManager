using TaskManager.Application.DTOs;
using TaskManager.Application.Services.IServices;
using TaskManager.Domain.Entities;
using TaskManager.Infrastructure.Repositories.Interfaces;

namespace TaskManager.Application.Services
{
    public class NotificationService : INotificationService
    {
        private readonly INotificationRepository _repository;
        private readonly IUserService _userService;

        public NotificationService(INotificationRepository repository, IUserService userService)
        {
            _repository = repository;
            _userService = userService;
        }

        public async Task<List<NotificationDto>> GetMyNotificationsAsync(string userId)
        {
            var notifications = await _repository.GetForUserAsync(userId);
            return notifications.Select(n => new NotificationDto(n.Id, n.Message, n.IsRead, n.CreatedAt, n.RelatedTaskId)).ToList();
        }

        public async Task MarkAsReadAsync(int id, string userId)
        {
            var notification = await _repository.GetByIdAsync(id);
            if (notification == null || notification.UserId != userId) return;

            notification.IsRead = true;
            await _repository.UpdateAsync(notification);
        }

        public async Task CreateAssignmentNotificationAsync(string assignedToUserId, string assignedByUserId, string taskName, int taskId)
        {
            if (assignedToUserId == assignedByUserId) return; // ne obaveštavaj sam sebe

            var sender = await _userService.GetByIdAsync(assignedByUserId);
            var senderName = sender?.FullName ?? "Neko";

            var notification = new Notification
            {
                UserId = assignedToUserId,
                Message = $"{senderName} vam je dodelio zadatak: {taskName}",
                RelatedTaskId = taskId
            };

            await _repository.AddAsync(notification);
        }
        public async Task CreatePasswordResetRequestAsync(string requestingUserId, string requestingUserName)
        {
            var admins = await _userService.GetAdminsAsync();

            foreach (var admin in admins)
            {
                var notification = new Notification
                {
                    UserId = admin.Id,
                    Message = $"{requestingUserName} je zatražio/la resetovanje lozinke."
                };

                await _repository.AddAsync(notification);
            }
        }
    }
}