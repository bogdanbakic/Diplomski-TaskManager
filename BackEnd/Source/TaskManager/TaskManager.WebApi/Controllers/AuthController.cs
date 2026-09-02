using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using TaskManager.Application.DTOs;
using TaskManager.Application.Services.IServices;
using TaskManager.Domain.Entities;

namespace TaskManager.WebApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;

    public AuthController(IAuthService authService)
    {
        _authService = authService;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register(RegisterDto dto)
    {
        var result = await _authService.RegisterAsync(dto);
        if (!result.Success) return BadRequest(result.Errors);
        return Ok(new { message = "User registered successfully." });
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login(LoginDto dto)
    {
        var result = await _authService.LoginAsync(dto);
        if (!result.Success) return Unauthorized(result.Errors);
        return Ok(new { token = result.Token });
    }
    [HttpPost("reset-password")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> AdminResetPassword([FromServices] UserManager<ApplicationUser> userManager, [FromBody] ResetPasswordDto dto)
    {
        var user = await userManager.FindByIdAsync(dto.UserId);
        if (user == null) return NotFound("User not found.");

        await userManager.RemovePasswordAsync(user);
        var result = await userManager.AddPasswordAsync(user, dto.NewPassword);

        if (!result.Succeeded)
            return BadRequest(result.Errors.Select(e => e.Description));

        return Ok(new { message = "Password reset successfully." });
    }
    [HttpPost("request-password-reset")]
    public async Task<IActionResult> RequestPasswordReset(
     [FromServices] UserManager<ApplicationUser> userManager,
     [FromServices] INotificationService notificationService,
     [FromBody] RequestPasswordResetDto dto)
    {
        var user = await userManager.FindByNameAsync(dto.UsernameOrEmail)
                   ?? await userManager.FindByEmailAsync(dto.UsernameOrEmail);

        if (user != null)
        {
            await notificationService.CreatePasswordResetRequestAsync(user.Id, user.UserName ?? "Korisnik");
        }

        return Ok(new { message = "Ako nalog postoji, administrator je obavešten o zahtevu za resetovanje lozinke." });
    }
}