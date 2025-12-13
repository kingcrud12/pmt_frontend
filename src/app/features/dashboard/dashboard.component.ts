import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Task } from '../../core/models/task.model';
import { Project } from '../../core/models/project.model';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css' // Fixed styleUrl -> styleUrls if needed, but keeping styleUrl as it matched original
})
export class DashboardComponent {
  activeTab: 'todo' | 'inprogress' | 'overdue' = 'todo';

  completedTasksThisWeek = 7;
  overdueProjectsCount = 1;
  overdueProjectName = 'Website Revamp';

  tasks: Task[] = [
    {
      id: '550e8400-e29b-41d4-a716-446655440000',
      name: 'Design Homepage UI',
      project_id: '123e4567-e89b-12d3-a456-426614174000',
      due_date: '2024-10-20',
      assignee_id: 'user-uuid-1',
      status: 'overdue',
      priority: 'High',
      description: 'Create modern homepage design'
    },
    {
      id: '550e8400-e29b-41d4-a716-446655440001',
      name: 'Develop Backend API',
      project_id: '123e4567-e89b-12d3-a456-426614174001',
      due_date: '2024-11-30',
      assignee_id: 'user-uuid-2',
      status: 'inprogress',
      priority: 'Medium',
      description: 'Build RESTful API'
    },
    {
      id: '550e8400-e29b-41d4-a716-446655440002',
      name: 'Setup Database Schema',
      project_id: '123e4567-e89b-12d3-a456-426614174001',
      due_date: '2024-11-15',
      assignee_id: 'user-uuid-1',
      status: 'todo',
      priority: 'Medium',
      description: 'Db schema design'
    },
    {
      id: '550e8400-e29b-41d4-a716-446655440003',
      name: 'Create User Authentication',
      project_id: '123e4567-e89b-12d3-a456-426614174000',
      due_date: '2024-10-25',
      assignee_id: 'user-uuid-3',
      status: 'todo',
      priority: 'High',
      description: 'Auth system'
    }
  ];

  projects: Project[] = [
    {
      id: '123e4567-e89b-12d3-a456-426614174000',
      name: 'Website Revamp',
      author_id: 'admin-uuid',
      description: 'Revamping the main website'
    },
    {
      id: '123e4567-e89b-12d3-a456-426614174001',
      name: 'Cloud Migration',
      author_id: 'admin-uuid',
      description: 'Moving to AWS'
    }
  ];

  get filteredTasks(): Task[] {
    return this.tasks.filter(task => task.status === this.activeTab);
  }

  get overdueTasksCount(): number {
    return this.tasks.filter(task => task.status === 'overdue').length;
  }

  getProjectName(projectId: string): string {
    const project = this.projects.find(p => p.id === projectId);
    return project ? project.name : 'Unknown Project';
  }

  getUserName(userId: string): string {
    // Simple mock lookup
    const users: { [key: string]: string } = {
      'user-uuid-1': 'Alice Dupont',
      'user-uuid-2': 'Carla',
      'user-uuid-3': 'Sarah'
    };
    return users[userId] || 'Unknown User';
  }

  setActiveTab(tab: 'todo' | 'inprogress' | 'overdue'): void {
    this.activeTab = tab;
  }
}

