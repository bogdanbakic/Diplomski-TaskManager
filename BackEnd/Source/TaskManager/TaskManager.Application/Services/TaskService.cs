using TaskManager.Application.DTOs;
using TaskManager.Application.Exceptions;
using TaskManager.Application.Mappers;
using TaskManager.Application.Services.IServices;
using TaskManager.Application.Validators;
using TaskManager.Domain.Entities.Enums;
using TaskManager.Infrastructure.Repositories.Interfaces;

namespace TaskManager.Application.Services
{
    public class TaskService : ITaskService
    {
        private readonly ITaskRepository _repository;
        private readonly IUserService _userService;
        private readonly INotificationService _notificationService;

        public TaskService(ITaskRepository repository, IUserService userService, INotificationService notificationService)
        {
            _repository = repository;
            _userService = userService;
            _notificationService = notificationService;
        }

        public async Task<TaskDto> CreateAsync(CreateTaskDto dto, string createdByUserId)
        {
            var validator = new AddTaskValidation();
            var validationResult = await validator.ValidateAsync(dto);

            if (!validationResult.IsValid)
            {
                throw new FluentValidation.ValidationException(validationResult.Errors);
            }

            if (!string.IsNullOrEmpty(dto.AssignedToUserId) && !await _userService.UserExistsAsync(dto.AssignedToUserId))
            {
                throw new EntityNotFound($"User with id: {dto.AssignedToUserId} not found.");
            }

            var taskEntity = await _repository.AddAsync(TaskMapper.ToEntity(dto, createdByUserId));

            if (!string.IsNullOrEmpty(taskEntity.AssignedToUserId))
            {
                await _notificationService.CreateAssignmentNotificationAsync(
                    taskEntity.AssignedToUserId, createdByUserId, taskEntity.Name, taskEntity.Id);
            }

            return TaskMapper.ToDto(taskEntity);
        }

        public async Task<List<TaskDto>> GetAllAsync(string userId, bool isAdmin, TaskItemStatus? status = null)
        {
            var taskList = await _repository.GetAllAsync(status, userId, isAdmin);
            return taskList.Select(x => TaskMapper.ToDto(x)).ToList();
        }

        public async Task<TaskDto> GetByIdAsync(int id, string userId, bool isAdmin)
        {
            var item = await _repository.GetByIdAsync(id);
            if (item == null)
                throw new EntityNotFound($"Entity with id: {id} not found! ");

            EnsureAccess(item.CreatedByUserId, item.AssignedToUserId, userId, isAdmin);
            return TaskMapper.ToDto(item);
        }

        public async Task UpdateAsync(int id, UpdateTaskDto dto, string userId, bool isAdmin)
        {
            var item = await _repository.GetByIdAsync(id);
            if (item == null)
                throw new EntityNotFound($"Entity with id: {id} not found! ");

            EnsureAccess(item.CreatedByUserId, item.AssignedToUserId, userId, isAdmin);

            if (!string.IsNullOrEmpty(dto.AssignedToUserId) && !await _userService.UserExistsAsync(dto.AssignedToUserId))
            {
                throw new EntityNotFound($"User with id: {dto.AssignedToUserId} not found.");
            }

            var previousAssignee = item.AssignedToUserId;

            var validator = new UpdateTaskValidation();
            var validationResult = await validator.ValidateAsync(dto);

            TaskMapper.UpdateEntity(item, dto);
            if (!validationResult.IsValid)
                throw new FluentValidation.ValidationException(validationResult.Errors);

            await _repository.UpdateAsync(item);

            if (!string.IsNullOrEmpty(item.AssignedToUserId) && item.AssignedToUserId != previousAssignee)
            {
                await _notificationService.CreateAssignmentNotificationAsync(
                    item.AssignedToUserId, userId, item.Name, item.Id);
            }
        }

        public async Task DeleteAsync(int id, string userId, bool isAdmin)
        {
            var item = await _repository.GetByIdAsync(id);
            if (item == null)
                throw new EntityNotFound($"Entity with id: {id} does not exist or has already been deleted!");

            EnsureAccess(item.CreatedByUserId, item.AssignedToUserId, userId, isAdmin);
            await _repository.DeleteAsync(item);
        }

        private static void EnsureAccess(string createdByUserId, string? assignedToUserId, string userId, bool isAdmin)
        {
            if (isAdmin) return;
            if (createdByUserId == userId) return;
            if (assignedToUserId == userId) return;

            throw new UnauthorizedAccessException("You do not have access to this task.");
        }
    }
}