import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Task, Project } from '../../core/models/task.model';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  activeTab: 'todo' | 'in-progress' | 'overdue' = 'todo';

  completedTasksThisWeek = 7;
  overdueProjectsCount = 1;
  overdueProjectName = 'Website Revamp';

  tasks: Task[] = [
    {
      id: 1,
      title: 'Design Homepage UI',
      project: 'Website Revamp',
      dueDate: 'Oct 20',
      assignedTo: 'Carla',
      author: 'John Doe',
      status: 'overdue',
      priority: 'high',
      color: '#ef4444'
    },
    {
      id: 2,
      title: 'Develop Backend API',
      project: 'Cloud Migration',
      dueDate: 'Nov 30',
      assignedTo: 'Carla',
      author: 'Sarah Johnson',
      status: 'inprogress',
      priority: 'medium',
      color: '#eab308'
    },
    {
      id: 3,
      title: 'Setup Database Schema',
      project: 'Cloud Migration',
      dueDate: 'Nov 15',
      assignedTo: 'Alice Dupont',
      author: 'Mike Wilson',
      status: 'todo',
      priority: 'medium',
      color: '#3b82f6'
    },
    {
      id: 4,
      title: 'Create User Authentication',
      project: 'Website Revamp',
      dueDate: 'Oct 25',
      assignedTo: 'Sarah',
      author: 'Alice Dupont',
      status: 'todo',
      priority: 'high',
      color: '#3b82f6'
    }
  ];

  projects: Project[] = [
    {
      id: 1,
      name: 'Website Revamp',
      progress: 60,
      role: 'Admin',
      color: '#3b82f6'
    },
    {
      id: 2,
      name: 'Cloud Migration',
      progress: 25,
      role: 'Member',
      color: '#eab308'
    }
  ];

  get filteredTasks(): Task[] {
    return this.tasks.filter(task => task.status === this.activeTab);
  }

  get overdueTasksCount(): number {
    return this.tasks.filter(task => task.status === 'overdue').length;
  }

  setActiveTab(tab: 'todo' | 'in-progress' | 'overdue'): void {
    this.activeTab = tab;
  }
}

