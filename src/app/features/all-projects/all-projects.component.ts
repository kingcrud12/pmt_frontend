import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Task } from '../../core/models/task.model';
import { Project } from '../../core/models/project.model';
import { ProjectMember } from '../../core/models/project-member.model';

@Component({
  selector: 'app-all-projects',
  imports: [CommonModule],
  templateUrl: './all-projects.component.html',
  styleUrl: './all-projects.component.css'
})
export class AllProjectsComponent {
  selectedProjectId: string = '123e4567-e89b-12d3-a456-426614174000'; // Default to first project UUID
  taskFilter: 'all' | 'todo' | 'inprogress' | 'completed' | 'overdue' = 'all';
  showAddMemberModal = false;
  showAddObserverModal = false;

  constructor(private router: Router) { }

  projects: Project[] = [
    {
      id: '123e4567-e89b-12d3-a456-426614174000',
      name: 'Website Revamp',
      description: 'Complete redesign of company website with modern UI/UX',
      author_id: 'user-uuid-1',
      created_at: '2024-01-01'
    },
    {
      id: '123e4567-e89b-12d3-a456-426614174001',
      name: 'Cloud Migration',
      description: 'Migrate infrastructure to cloud services',
      author_id: 'user-uuid-1',
      created_at: '2024-02-01'
    }
  ];

  // Mock Members
  allMembers: ProjectMember[] = [
    { id: 'm1', project_id: '123e4567-e89b-12d3-a456-426614174000', user_id: 'user-uuid-1', role: 'Admin' }, // Alice
    { id: 'm2', project_id: '123e4567-e89b-12d3-a456-426614174000', user_id: 'user-uuid-2', role: 'Member' }, // Carla
    { id: 'm3', project_id: '123e4567-e89b-12d3-a456-426614174000', user_id: 'user-uuid-3', role: 'Member' }, // Sarah
    { id: 'm4', project_id: '123e4567-e89b-12d3-a456-426614174000', user_id: 'user-uuid-4', role: 'Observer' }, // Mike
    { id: 'm5', project_id: '123e4567-e89b-12d3-a456-426614174001', user_id: 'user-uuid-1', role: 'Member' },
    { id: 'm6', project_id: '123e4567-e89b-12d3-a456-426614174001', user_id: 'user-uuid-5', role: 'Admin' }
  ];

  // Helper to get mock user name (replace with real user service)
  getUserName(userId: string): string {
    const users: { [key: string]: string } = {
      'user-uuid-1': 'Alice Dupont',
      'user-uuid-2': 'Carla Smith',
      'user-uuid-3': 'Sarah Johnson',
      'user-uuid-4': 'Mike Wilson',
      'user-uuid-5': 'John Doe'
    };
    return users[userId] || 'Unknown User';
  }

  // Mock Tasks
  allTasks: Task[] = [
    {
      id: '550e8400-e29b-41d4-a716-446655440000',
      name: 'Design Homepage UI',
      description: 'Create modern homepage design',
      status: 'inprogress',
      priority: 'High',
      assignee_id: 'user-uuid-2', // Carla
      project_id: '123e4567-e89b-12d3-a456-426614174000',
      due_date: '2024-10-20'
    },
    {
      id: '550e8400-e29b-41d4-a716-446655440001',
      name: 'Create User Authentication',
      description: 'Implement secure login system',
      status: 'completed',
      priority: 'High',
      assignee_id: 'user-uuid-3', // Sarah
      project_id: '123e4567-e89b-12d3-a456-426614174000',
      due_date: '2024-10-25'
    },
    {
      id: '550e8400-e29b-41d4-a716-446655440002',
      name: 'Design Mobile Layout',
      description: 'Create responsive mobile design',
      status: 'completed',
      priority: 'Medium',
      assignee_id: 'user-uuid-5', // Emma (mocking user 5)
      project_id: '123e4567-e89b-12d3-a456-426614174000',
      due_date: '2024-10-15'
    },
    {
      id: '550e8400-e29b-41d4-a716-446655440003',
      name: 'Setup Analytics',
      description: 'Integrate Google Analytics',
      status: 'todo',
      priority: 'Low',
      assignee_id: 'user-uuid-4', // Mike
      project_id: '123e4567-e89b-12d3-a456-426614174000',
      due_date: '2024-11-05'
    },
    {
      id: '550e8400-e29b-41d4-a716-446655440004',
      name: 'Fix Payment Gateway',
      description: 'Resolve payment processing issues',
      status: 'overdue',
      priority: 'High',
      assignee_id: 'user-uuid-2', // Carla
      project_id: '123e4567-e89b-12d3-a456-426614174000',
      due_date: '2024-10-18'
    },
    {
      id: '550e8400-e29b-41d4-a716-446655440005',
      name: 'Develop Backend API',
      description: 'Build RESTful API',
      status: 'inprogress',
      priority: 'High',
      assignee_id: 'user-uuid-5', // John
      project_id: '123e4567-e89b-12d3-a456-426614174001',
      due_date: '2024-11-30'
    },
    {
      id: '550e8400-e29b-41d4-a716-446655440006',
      name: 'Setup Database Schema',
      description: 'Design database structure',
      status: 'todo',
      priority: 'Medium',
      assignee_id: 'user-uuid-5', // John
      project_id: '123e4567-e89b-12d3-a456-426614174001',
      due_date: '2024-11-15'
    },
    {
      id: '550e8400-e29b-41d4-a716-446655440007',
      name: 'Write API Documentation',
      description: 'Document all endpoints',
      status: 'todo',
      priority: 'Low',
      assignee_id: 'user-uuid-4', // Mike
      project_id: '123e4567-e89b-12d3-a456-426614174001',
      due_date: '2024-12-05'
    }
  ];

  get selectedProject(): Project | undefined {
    return this.projects.find(p => p.id === this.selectedProjectId);
  }

  // Helpers to get project-specific data
  get currentProjectTasks(): Task[] {
    return this.allTasks.filter(t => t.project_id === this.selectedProjectId);
  }

  get currentProjectMembers(): ProjectMember[] {
    return this.allMembers.filter(m => m.project_id === this.selectedProjectId && m.role !== 'Observer');
  }

  get currentProjectObservers(): ProjectMember[] {
    return this.allMembers.filter(m => m.project_id === this.selectedProjectId && m.role === 'Observer');
  }

  get filteredTasks(): Task[] {
    const tasks = this.currentProjectTasks;

    if (this.taskFilter === 'all') {
      return tasks;
    }
    return tasks.filter(t => t.status === this.taskFilter);
  }

  get assignedTasks(): Task[] {
    return this.filteredTasks.filter(t => t.assignee_id);
  }

  get unassignedTasks(): Task[] {
    return this.filteredTasks.filter(t => !t.assignee_id);
  }

  get taskStats() {
    const tasks = this.currentProjectTasks;
    return {
      todo: tasks.filter(t => t.status === 'todo').length,
      inprogress: tasks.filter(t => t.status === 'inprogress').length,
      completed: tasks.filter(t => t.status === 'completed').length,
      overdue: tasks.filter(t => t.status === 'overdue').length,
      total: tasks.length
    };
  }

  // Get project progress (mock calculation based on completed tasks)
  getProjectProgress(projectId: string): number {
    const tasks = this.allTasks.filter(t => t.project_id === projectId);
    if (tasks.length === 0) return 0;
    const completed = tasks.filter(t => t.status === 'completed').length;
    return Math.round((completed / tasks.length) * 100);
  }

  selectProject(projectId: string): void {
    this.selectedProjectId = projectId;
    this.taskFilter = 'all';
  }

  setTaskFilter(filter: 'all' | 'todo' | 'inprogress' | 'completed' | 'overdue'): void {
    this.taskFilter = filter;
  }

  openAddMemberModal(): void {
    this.showAddMemberModal = true;
  }

  openAddObserverModal(): void {
    this.showAddObserverModal = true;
  }

  closeModals(): void {
    this.showAddMemberModal = false;
    this.showAddObserverModal = false;
  }

  getInitials(name: string): string {
    return name.split(' ').map(n => n[0]).join('');
  }

  viewTaskDetail(taskId: string): void {
    this.router.navigate(['/tasks', taskId]);
  }

  addTask(): void {
    if (this.selectedProjectId) {
      this.router.navigate(['/tasks/new'], {
        queryParams: { projectId: this.selectedProjectId }
      });
    }
  }
}

