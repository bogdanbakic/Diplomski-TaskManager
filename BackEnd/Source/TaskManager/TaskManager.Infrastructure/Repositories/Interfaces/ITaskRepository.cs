using TaskManager.Domain.Entities;
using TaskManager.Domain.Entities.Enums;

namespace TaskManager.Infrastructure.Repositories.Interfaces
{
    public interface ITaskRepository
    {
        Task<List<TaskItem>> GetAllAsync(TaskItemStatus? status, string userId, bool isAdmin);
        Task<TaskItem?> GetByIdAsync(int id);
        Task<TaskItem> AddAsync(TaskItem newTask);
        Task UpdateAsync(TaskItem updatedTask);
        Task DeleteAsync(TaskItem item);
    }
}