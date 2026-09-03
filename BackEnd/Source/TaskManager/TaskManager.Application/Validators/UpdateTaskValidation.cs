using FluentValidation;
using TaskManager.Application.DTOs;

namespace TaskManager.Application.Validators
{
    internal class UpdateTaskValidation : AbstractValidator<UpdateTaskDto>
    {
        public UpdateTaskValidation()
        {
            RuleFor(task => task.Name).NotNull().MinimumLength(3);
            RuleFor(task => task.Description).NotNull().MinimumLength(3);
            RuleFor(task => task.EndDate).Must((task, endDate) => IsAfterStartDate(task.StartDate, endDate));
        }

        private bool IsAfterStartDate(DateTime startDate, DateTime endDate)
        {
            return endDate >= startDate;
        }
    }
}
