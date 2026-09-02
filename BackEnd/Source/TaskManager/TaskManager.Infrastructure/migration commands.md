# Entity framework migration commands

Run these commands from Package Manager Console.

## Powershell commands

### Add migration

``` powershell
Add-Migration MIGRATION_NAME_HERE -Project TaskManager.Infrastructure -StartupProject TaskManager.WebApi
```

### Update database

``` powershell
Update-Database -Project TaskManager.Infrastructure -StartUpProject TaskManager.WebApi
```

### Remove migration

``` powershell
Remove-Migration -Project TaskManager.Infrastructure -StartUpProject TaskManager.WebApi
```