import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Task } from '../../core/models/task.model';
import { Project } from '../../core/models/project.model';

@Component({
  selector: 'app-my-tasks',
  imports: [CommonModule, FormsModule],
  templateUrl: './my-tasks.component.html',
  styleUrl: './my-tasks.component.css'
})
export class MyTasksComponent {
  currentUser = 'user-uuid-1'; // Simulated logged-in user ID
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
      priority: 'High',
      description: 'Build RESTful API'
    },
    // ... Add more mock tasks if needed
    {
      id: '550e8400-e29b-41d4-a716-446655440002',
      name: 'Setup Database Schema',
      project_id: '123e4567-e89b-12d3-a456-426614174001',
      due_date: '2024-11-15',
      assignee_id: 'user-uuid-1',
      status: 'todo',
      priority: 'Medium',
      description: 'Db schema design'
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

  completedTasksThisWeek = 12;
  overdueProjectsCount = 1;

  get filteredTasks(): Task[] {
    // First filter by current user - only show tasks assigned to them
    let filtered = this.tasks.filter(task => task.assignee_id === this.currentUser);

    // Then apply status filter
    if (this.taskFilter !== 'all') {
      filtered = filtered.filter(task => task.status === this.taskFilter);
    }

    // Then apply project filter
    if (this.projectFilter !== 'all') {
      filtered = filtered.filter(task => task.project_id === this.projectFilter);
    }

    return this.sortTasks(filtered);
  }

  get uniqueProjects(): string[] { // Returns names or IDs? Let's return IDs for logic but need names for display
    // Actually for the dropdown, we need unique project IDs
    const projectIds = this.tasks.map(t => t.project_id);
    return ['all', ...Array.from(new Set(projectIds))];
  }

  // Helper to get project list for dropdown
  get uniqueProjectList(): Project[] {
    const ids = this.uniqueProjects.filter(id => id !== 'all');
    return this.projects.filter(p => ids.includes(p.id));
  }

  getProjectName(projectId: string): string {
    const p = this.projects.find(proj => proj.id === projectId);
    return p ? p.name : 'Unknown';
  }

  get taskCounts() {
    const myTasks = this.tasks.filter(t => t.assignee_id === this.currentUser);
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

  setProjectFilter(projectId: string): void {
    this.projectFilter = projectId;
  }

  setSortBy(sort: 'dueDate' | 'priority' | 'project'): void {
    this.sortBy = sort;
  }

  viewTaskDetail(taskId: string): void {
    this.router.navigate(['/tasks', taskId]);
  }

  private sortTasks(tasks: Task[]): Task[] {
    return [...tasks].sort((a, b) => {
      if (this.sortBy === 'priority') {
        const priorityOrder = { High: 0, Medium: 1, Low: 2 };
        return (priorityOrder[a.priority] ?? 3) - (priorityOrder[b.priority] ?? 3);
      } else if (this.sortBy === 'project') {
        return this.getProjectName(a.project_id).localeCompare(this.getProjectName(b.project_id));
      }
      // dueDate
      return (a.due_date || '').localeCompare(b.due_date || '');
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

