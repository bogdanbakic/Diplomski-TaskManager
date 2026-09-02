namespace TaskManager.Application.Exceptions
{
    public class EntityNotFound : Exception
    {
        public EntityNotFound(string message) : base(message) { }
    }
}
