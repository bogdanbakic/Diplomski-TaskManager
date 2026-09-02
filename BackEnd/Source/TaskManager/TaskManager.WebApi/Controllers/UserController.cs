using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using TaskManager.Application.DTOs.TaskManager.Application.DTOs;
using TaskManager.Application.Services.IServices;

namespace TaskManager.WebApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class UsersController : ControllerBase
    {
        private readonly IUserService _userService;

        public UsersController(IUserService userService)
        {
            _userService = userService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var users = await _userService.GetAllAsync();
            return Ok(users);
        }

        [HttpPut("{id}/role")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UpdateRole(string id, UpdateUserRoleDto dto)
        {
            var success = await _userService.UpdateUserRoleAsync(id, dto.Role);
            if (!success)
                return BadRequest("Invalid user id or role.");

            return Ok(new { message = "Role updated successfully." });
        }
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteUser(string id)
        {
            var currentUserId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (id == currentUserId)
                return BadRequest("Ne možete obrisati sopstveni nalog.");

            var success = await _userService.DeleteUserAsync(id);
            if (!success)
                return NotFound("Korisnik nije pronađen.");

            return Ok(new { message = "Korisnik je uspešno obrisan." });
        }
    }
}