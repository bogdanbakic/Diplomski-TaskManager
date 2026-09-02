using TaskManager.Application.DTOs;

namespace TaskManager.Application.Services.IServices
{
    public interface IDashboardService
    {
        Task<DashboardDto> GetDashboardAsync(string userId, bool isAdmin);
    }
}