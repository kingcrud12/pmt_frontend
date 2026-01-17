import { Routes } from '@angular/router';
import { MyTasksComponent } from './features/my-tasks/my-tasks.component';
import { AllProjectsComponent } from './features/all-projects/all-projects.component';
import { TaskDetailComponent } from './features/task-detail/task-detail.component';
import { TaskCreateComponent } from './features/task-create/task-create.component';
import { ProfileComponent } from './features/user/profile/profile.component';
import { RegisterComponent } from './features/auth/register/register.component';
import { LoginComponent } from './features/auth/login/login.component';
import { LayoutComponent } from './shared/layout/layout.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';

export const routes: Routes = [
    { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    { path: 'auth/register', component: RegisterComponent },
    { path: 'auth/login', component: LoginComponent },
    {
        path: '',
        component: LayoutComponent,
        children: [
            { path: 'dashboard', component: DashboardComponent },
            { path: 'tasks', component: MyTasksComponent },
            { path: 'tasks/new', component: TaskCreateComponent },
            { path: 'tasks/:id', component: TaskDetailComponent },
            { path: 'projects', component: AllProjectsComponent },
            { path: 'profile', component: ProfileComponent }
        ]
    }
];

