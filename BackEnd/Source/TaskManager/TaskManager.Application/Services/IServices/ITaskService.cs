using TaskManager.Application.DTOs;
using TaskManager.Domain.Entities.Enums;

namespace TaskManager.Application.Services.IServices
{
    public interface ITaskService
    {
        Task<TaskDto> CreateAsync(CreateTaskDto dto, string createdByUserId);
        Task<List<TaskDto>> GetAllAsync(string userId, bool isAdmin, TaskItemStatus? status = null);
        Task<TaskDto> GetByIdAsync(int id, string userId, bool isAdmin);
        Task UpdateAsync(int id, UpdateTaskDto dto, string userId, bool isAdmin);
        Task DeleteAsync(int id, string userId, bool isAdmin);
    }
}