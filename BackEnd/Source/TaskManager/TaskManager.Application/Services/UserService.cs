using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using TaskManager.Application.DTOs;
using TaskManager.Application.Services.IServices;
using TaskManager.Domain.Entities;

namespace TaskManager.Infrastructure.Services
{
    public class UserService : IUserService
    {
        private static readonly string[] AllowedRoles = { "Admin", "User" };

        private readonly UserManager<ApplicationUser> _userManager;

        public UserService(UserManager<ApplicationUser> userManager)
        {
            _userManager = userManager;
        }

        public async Task<List<UserDto>> GetAllAsync()
        {
            var users = await _userManager.Users.ToListAsync();
            var result = new List<UserDto>();

            foreach (var user in users)
            {
                var roles = await _userManager.GetRolesAsync(user);
                result.Add(new UserDto(user.Id, user.FullName, user.Email!, roles.ToList()));
            }

            return result;
        }

        public async Task<bool> UserExistsAsync(string userId)
        {
            var user = await _userManager.FindByIdAsync(userId);
            return user != null;
        }

        public async Task<UserDto?> GetByIdAsync(string userId)
        {
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null) return null;

            var roles = await _userManager.GetRolesAsync(user);
            return new UserDto(user.Id, user.FullName, user.Email!, roles.ToList());
        }

        public async Task<bool> UpdateUserRoleAsync(string userId, string role)
        {
            if (!AllowedRoles.Contains(role))
                return false;

            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
                return false;

            var currentRoles = await _userManager.GetRolesAsync(user);
            await _userManager.RemoveFromRolesAsync(user, currentRoles);
            await _userManager.AddToRoleAsync(user, role);

            return true;
        }

        public async Task<bool> DeleteUserAsync(string userId)
        {
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null) return false;

            try
            {
                var result = await _userManager.DeleteAsync(user);
                return result.Succeeded;
            }
            catch (DbUpdateException)
            {
                throw new InvalidOperationException("Korisnik ima kreirane zadatke i ne može biti obrisan.");
            }
        }
        public async Task<List<UserDto>> GetAdminsAsync()
        {
            var admins = await _userManager.GetUsersInRoleAsync("Admin");
            var result = new List<UserDto>();

            foreach (var admin in admins)
            {
                var roles = await _userManager.GetRolesAsync(admin);
                result.Add(new UserDto(admin.Id, admin.FullName, admin.Email!, roles.ToList()));
            }

            return result;
        }
    }
}