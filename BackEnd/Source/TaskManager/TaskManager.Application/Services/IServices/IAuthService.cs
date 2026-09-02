using TaskManager.Application.DTOs;

namespace TaskManager.Application.Services.IServices
{
    public interface IAuthService
    {
        Task<AuthResultDto> RegisterAsync(RegisterDto dto);
        Task<AuthResultDto> LoginAsync(LoginDto dto);
    }
}
