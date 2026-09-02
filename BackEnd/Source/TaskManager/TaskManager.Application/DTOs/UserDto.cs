namespace TaskManager.Application.DTOs
{
    public record UserDto
    (
        string Id,
        string FullName,
        string Email,
        List<string> Roles
    );
}
