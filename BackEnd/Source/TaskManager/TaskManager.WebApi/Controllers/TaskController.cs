using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using TaskManager.Application.DTOs;
using TaskManager.Application.Exceptions;
using TaskManager.Application.Services.IServices;
using TaskManager.Domain.Entities.Enums;

namespace TaskManager.WebApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class TaskController : Controller
    {
        public readonly ITaskService _taskService;

        public TaskController(ITaskService taskService)
        {
            _taskService = taskService;
        }

        private string CurrentUserId => User.FindFirstValue(ClaimTypes.NameIdentifier)!;
        private bool IsAdmin => User.IsInRole("Admin");

        [HttpGet]
        public async Task<IActionResult> GetAll([FromQuery] TaskItemStatus? status)
        {
            var result = await _taskService.GetAllAsync(CurrentUserId, isAdmin: false, status);
            return Ok(result);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            try
            {
                var result = await _taskService.GetByIdAsync(id, CurrentUserId, IsAdmin);
                return Ok(result);
            }
            catch (UnauthorizedAccessException)
            {
                return Forbid();
            }
        }

        [HttpPost]
        public async Task<IActionResult> Create(CreateTaskDto newTaskItem)
        {
            try
            {
                var newTask = await _taskService.CreateAsync(newTaskItem, CurrentUserId);
                return Ok(newTask);
            }
            catch (EntityNotFound ex)
            {
                return NotFound(ex.Message);
            }
            catch (FluentValidation.ValidationException ex)
            {
                return BadRequest(ex.Errors);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Neočekivana greška:{ex}");
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, UpdateTaskDto task)
        {
            try
            {
                await _taskService.UpdateAsync(id, task, CurrentUserId, IsAdmin);
                return Ok();
            }
            catch (EntityNotFound ex)
            {
                return NotFound(ex.Message);
            }
            catch (FluentValidation.ValidationException ex)
            {
                return BadRequest(ex.Errors);
            }
            catch (UnauthorizedAccessException)
            {
                return Forbid();
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Neočekivana greška prilikom editovanja task-a sa id: {id} , message: {ex}");
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            try
            {
                await _taskService.DeleteAsync(id, CurrentUserId, IsAdmin);
                return NoContent();
            }
            catch (EntityNotFound ex)
            {
                return NotFound(ex.Message);
            }
            catch (UnauthorizedAccessException)
            {
                return Forbid();
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Neočekivana greška prilikom brisanja task-a sa id: {id} , message: {ex}");
            }
        }
    }
}