using TaskManager.Application.DTOs;
using TaskManager.Application.Services.IServices;
using TaskManager.Domain.Entities.Enums;
using TaskManager.Infrastructure.Repositories.Interfaces;

namespace TaskManager.Application.Services
{
    public class DashboardService : IDashboardService
    {
        private readonly ITaskRepository _taskRepository;
        private readonly IUserService _userService;

        public DashboardService(ITaskRepository taskRepository, IUserService userService)
        {
            _taskRepository = taskRepository;
            _userService = userService;
        }

        public async Task<DashboardDto> GetDashboardAsync(string userId, bool isAdmin)
        {
            var visibleTasks = await _taskRepository.GetAllAsync(null, userId, isAdmin);

            var tasksByStatus = visibleTasks
                .GroupBy(t => t.Status)
                .Select(g => new StatusCountDto(g.Key.ToString(), g.Count()))
                .ToList();

            var createdByMeCount = visibleTasks.Count(t => t.CreatedByUserId == userId);
            var assignedToMeCount = visibleTasks.Count(t => t.AssignedToUserId == userId);
            var overdueCount = visibleTasks.Count(t => t.EndDate < DateTime.UtcNow && t.Status != TaskItemStatus.Done);
            var totalActiveCount = visibleTasks.Count(t => t.Status != TaskItemStatus.Done);

            List<UserTaskCountDto>? tasksByUser = null;
            int? totalUsersCount = null;
            int? totalTasksInSystemCount = null;

            if (isAdmin)
            {
                var allUsers = await _userService.GetAllAsync();
                tasksByUser = allUsers.Select(u => new UserTaskCountDto(
                    u.Id,
                    u.FullName,
                    visibleTasks.Count(t => t.CreatedByUserId == u.Id || t.AssignedToUserId == u.Id),
                    visibleTasks.Count(t => (t.CreatedByUserId == u.Id || t.AssignedToUserId == u.Id) && t.Status == TaskItemStatus.Done)
                )).ToList();

                totalUsersCount = allUsers.Count;
                totalTasksInSystemCount = visibleTasks.Count;
            }

            return new DashboardDto(
                tasksByStatus,
                createdByMeCount,
                assignedToMeCount,
                overdueCount,
                totalActiveCount,
                tasksByUser,
                totalUsersCount,
                totalTasksInSystemCount
            );
        }
    }
}