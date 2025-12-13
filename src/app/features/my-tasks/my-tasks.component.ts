import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Task, Project } from '../../core/models/task.model';

@Component({
  selector: 'app-my-tasks',
  imports: [CommonModule, FormsModule],
  templateUrl: './my-tasks.component.html',
  styleUrl: './my-tasks.component.css'
})
export class MyTasksComponent {
  currentUser = 'Alice Dupont'; // Simulated logged-in user
  taskFilter: 'all' | 'todo' | 'inprogress' | 'completed' | 'overdue' = 'all';
  projectFilter: string = 'all';
  sortBy: 'dueDate' | 'priority' | 'project' = 'dueDate';

  // Modal state
  showProjectSelectionModal = false;
  selectedProjectForTask: Project | null = null;
  availableProjects: Project[] = [];

  constructor(private router: Router) { }

  tasks: Task[] = [
    {
      id: 1,
      title: 'Design Homepage UI',
      project: 'Website Revamp',
      dueDate: 'Oct 20',
      assignedTo: 'Alice Dupont',
      author: 'John Doe',
      status: 'overdue',
      priority: 'high',
      color: '#ef4444',
      description: 'Create modern homepage design with new branding'
    },
    {
      id: 2,
      title: 'Develop Backend API',
      project: 'Cloud Migration',
      dueDate: 'Nov 30',
      assignedTo: 'Carla',
      author: 'Sarah Johnson',
      status: 'inprogress',
      priority: 'high',
      color: '#eab308',
      description: 'Build RESTful API for cloud services'
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
      color: '#3b82f6',
      description: 'Design and implement database structure'
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
      color: '#3b82f6',
      description: 'Implement secure user login system'
    },
    {
      id: 5,
      title: 'Write API Documentation',
      project: 'Cloud Migration',
      dueDate: 'Dec 5',
      assignedTo: 'Alice Dupont',
      author: 'John Doe',
      status: 'todo',
      priority: 'low',
      color: '#3b82f6',
      description: 'Document all API endpoints and usage'
    },
    {
      id: 6,
      title: 'Design Mobile Layout',
      project: 'Website Revamp',
      dueDate: 'Oct 15',
      assignedTo: 'Emma',
      author: 'Sarah Johnson',
      status: 'completed',
      priority: 'medium',
      color: '#10b981',
      description: 'Create responsive mobile design'
    },
    {
      id: 7,
      title: 'Review Security Protocols',
      project: 'Website Revamp',
      dueDate: 'Nov 10',
      assignedTo: 'Alice Dupont',
      author: 'Mike Wilson',
      status: 'inprogress',
      priority: 'high',
      color: '#eab308',
      description: 'Audit and update security measures'
    }
  ];

  projects: Project[] = [
    {
      id: 1,
      name: 'Website Revamp',
      progress: 75,
      color: '#3b82f6',
      role: 'Lead Developer'
    },
    {
      id: 2,
      name: 'Cloud Migration',
      progress: 45,
      color: '#10b981',
      role: 'Backend Engineer'
    }
  ];

  completedTasksThisWeek = 12;
  overdueProjectsCount = 1;
  overdueProjectName = 'Website Revamp';

  get filteredTasks(): Task[] {
    // First filter by current user - only show tasks assigned to them
    let filtered = this.tasks.filter(task => task.assignedTo === this.currentUser);

    // Then apply status filter
    if (this.taskFilter !== 'all') {
      filtered = filtered.filter(task => task.status === this.taskFilter);
    }

    // Then apply project filter
    if (this.projectFilter !== 'all') {
      filtered = filtered.filter(task => task.project === this.projectFilter);
    }

    return this.sortTasks(filtered);
  }

  get uniqueProjects(): string[] {
    const projects = this.tasks.map(t => t.project);
    return ['all', ...Array.from(new Set(projects))];
  }

  get taskCounts() {
    const myTasks = this.tasks.filter(t => t.assignedTo === this.currentUser);
    return {
      all: myTasks.length,
      todo: myTasks.filter(t => t.status === 'todo').length,
      inProgress: myTasks.filter(t => t.status === 'inprogress').length,
      overdue: myTasks.filter(t => t.status === 'overdue').length,
      completed: myTasks.filter(t => t.status === 'completed').length
    };
  }

  setFilter(filter: 'all' | 'todo' | 'inprogress' | 'completed' | 'overdue'): void {
    this.taskFilter = filter;
  }

  setProjectFilter(project: string): void {
    this.projectFilter = project;
  }

  setSortBy(sort: 'dueDate' | 'priority' | 'project'): void {
    this.sortBy = sort;
  }

  viewTaskDetail(taskId: number): void {
    this.router.navigate(['/tasks', taskId]);
  }

  private sortTasks(tasks: Task[]): Task[] {
    return [...tasks].sort((a, b) => {
      if (this.sortBy === 'priority') {
        const priorityOrder = { high: 0, medium: 1, low: 2 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      } else if (this.sortBy === 'project') {
        return a.project.localeCompare(b.project);
      }
      return 0; // dueDate - would need proper date parsing
    });
  }

  // Modal methods
  openProjectSelectionModal(): void {
    this.availableProjects = this.projects;
    this.showProjectSelectionModal = true;
  }

  closeProjectSelectionModal(): void {
    this.showProjectSelectionModal = false;
    this.selectedProjectForTask = null;
  }

  selectProject(project: Project): void {
    this.selectedProjectForTask = project;
  }

  confirmProjectSelection(): void {
    if (this.selectedProjectForTask) {
      // Navigate to task creation form with selected project
      this.router.navigate(['/tasks/new'], {
        queryParams: { projectId: this.selectedProjectForTask.id }
      });
      this.closeProjectSelectionModal();
    }
  }
}

