import { Routes } from '@angular/router';
import { AddOrUpdateTask } from './components/add-or-update-task/add-or-update-task';
import { DeleteTask } from './components/delete-task/delete-task';
import { TaskListComponent } from './components/task-list/task-list';

export const routes: Routes = [
    {
        path: 'task-list',
        component: TaskListComponent,
        children: [
            { path: 'add-task', component: AddOrUpdateTask },
            { path: 'edit-task/:id', component: AddOrUpdateTask },
            { path: 'delete-task/:id', component: DeleteTask }
        ]
    },
    {
        path: '**' , redirectTo:'/task-list'
    }
];

