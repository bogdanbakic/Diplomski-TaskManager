import { Routes } from '@angular/router';
import { AddOrUpdateTask } from './components/add-or-update-task/add-or-update-task';
import { DeleteTask } from './components/delete-task/delete-task';
import { TaskListComponent } from './components/task-list/task-list';
import { Login } from './components/login/login';
import { authGuard } from './guards/auth-guard';
import { Register } from './components/register/register';
import { UserManagement } from './components/user-management/user-management';
import { ForgotPassword } from './components/forgot-password/forgot-password';

export const routes: Routes = [
    {
        path: 'login',
        component: Login
    },
    {
        path: 'register',
        component: Register
    },
    {
        path: 'forgot-password',
        component: ForgotPassword
    },
    {
        path: 'task-list',
        component: TaskListComponent,
        canActivate: [authGuard],
        children: [
            { path: 'add-task', component: AddOrUpdateTask },
            { path: 'edit-task/:id', component: AddOrUpdateTask },
            { path: 'delete-task/:id', component: DeleteTask }
        ]
    },
    {
        path: '',
        redirectTo: '/login',
        pathMatch: 'full'
    },
    {
        path: '**', redirectTo: '/login'
    },
];