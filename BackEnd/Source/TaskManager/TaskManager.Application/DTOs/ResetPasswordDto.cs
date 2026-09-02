namespace TaskManager.Application.DTOs
{
    public record ResetPasswordDto(string UserId, string NewPassword);
    public record RequestPasswordResetDto(string UsernameOrEmail);
}
