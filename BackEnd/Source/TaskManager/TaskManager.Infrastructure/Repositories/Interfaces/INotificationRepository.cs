using TaskManager.Domain.Entities;

namespace TaskManager.Infrastructure.Repositories.Interfaces
{
    public interface INotificationRepository
    {
        Task<List<Notification>> GetForUserAsync(string userId);
        Task<Notification?> GetByIdAsync(int id);
        Task AddAsync(Notification notification);
        Task UpdateAsync(Notification notification);
    }
}
