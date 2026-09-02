using TaskManager.Application.DTOs;

namespace TaskManager.Application.Services.IServices
{
    public interface IUserService
    {
        Task<List<UserDto>> GetAllAsync();
        Task<UserDto?> GetByIdAsync(string userId);
        Task<bool> UserExistsAsync(string userId);
        Task<bool> UpdateUserRoleAsync(string userId, string role);
        Task<bool> DeleteUserAsync(string userId);
        Task<List<UserDto>> GetAdminsAsync();
    }
}
