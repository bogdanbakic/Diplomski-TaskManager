using Microsoft.EntityFrameworkCore;
using TaskManager.Domain.Entities;
using TaskManager.Domain.Entities.Enums;
using TaskManager.Infrastructure.Data;
using TaskManager.Infrastructure.Repositories.Interfaces;

namespace TaskManager.Infrastructure.Repositories
{
    public class TaskRepository : ITaskRepository
    {
        private readonly ApplicationDbContext _context;

        public TaskRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<List<TaskItem>> GetAllAsync(TaskItemStatus? status, string userId, bool isAdmin)
        {
            var query = _context.TaskItems.AsQueryable();

            if (!isAdmin)
                query = query.Where(x => x.CreatedByUserId == userId || x.AssignedToUserId == userId);

            if (status != null)
                query = query.Where(x => x.Status == status);

            return await query.ToListAsync();
        }

        public async Task<TaskItem?> GetByIdAsync(int id)
        {
            return await _context.TaskItems.FindAsync(id);
        }

        public async Task<TaskItem> AddAsync(TaskItem newTask)
        {
            _context.TaskItems.Add(newTask);
            await _context.SaveChangesAsync();
            return newTask;
        }

        public async Task UpdateAsync(TaskItem updatedTask)
        {
            _context.Update(updatedTask);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(TaskItem item)
        {
            _context.Remove(item);
            await _context.SaveChangesAsync();
        }
    }
}