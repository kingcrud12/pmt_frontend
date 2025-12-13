import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Task, Project, Member, Observer } from '../../core/models/task.model';

@Component({
  selector: 'app-all-projects',
  imports: [CommonModule],
  templateUrl: './all-projects.component.html',
  styleUrl: './all-projects.component.css'
})
export class AllProjectsComponent {
  selectedProjectId: number = 1;
  taskFilter: 'all' | 'todo' | 'inprogress' | 'completed' | 'overdue' = 'all';
  showAddMemberModal = false;
  showAddObserverModal = false;

  constructor(private router: Router) { }

  projects: Project[] = [
    {
      id: 1,
      name: 'Website Revamp',
      description: 'Complete redesign of company website with modern UI/UX',
      progress: 60,
      color: '#3b82f6',
      members: [
        { id: 1, name: 'Alice Dupont', email: 'alice@company.com', role: 'admin' },
        { id: 2, name: 'Carla Smith', email: 'carla@company.com', role: 'member' },
        { id: 3, name: 'Sarah Johnson', email: 'sarah@company.com', role: 'member' }
      ],
      observers: [
        { id: 4, name: 'Mike Wilson', email: 'mike@company.com', role: 'observer' }
      ],
      tasks: [
        {
          id: 1,
          title: 'Design Homepage UI',
          description: 'Create modern homepage design',
          status: 'inprogress',
          priority: 'high',
          assignedTo: 'Carla Smith',
          author: 'John Doe',
          dueDate: 'Oct 20',
          project: 'Website Revamp',
          color: '#f59e0b'
        },
        {
          id: 2,
          title: 'Create User Authentication',
          description: 'Implement secure login system',
          status: 'completed',
          priority: 'high',
          assignedTo: 'Sarah Johnson',
          author: 'Alice Dupont',
          dueDate: 'Oct 25',
          project: 'Website Revamp',
          color: '#10b981'
        },
        {
          id: 3,
          title: 'Design Mobile Layout',
          description: 'Create responsive mobile design',
          status: 'completed',
          priority: 'medium',
          assignedTo: 'Emma Davis',
          author: 'Sarah Johnson',
          dueDate: 'Oct 15',
          project: 'Website Revamp',
          color: '#10b981'
        },
        {
          id: 4,
          title: 'Setup Analytics',
          description: 'Integrate Google Analytics',
          status: 'todo',
          priority: 'low',
          author: 'Mike Wilson',
          dueDate: 'Nov 5',
          project: 'Website Revamp',
          color: '#3b82f6'
        },
        {
          id: 5,
          title: 'Fix Payment Gateway',
          description: 'Resolve payment processing issues',
          status: 'overdue',
          priority: 'high',
          assignedTo: 'Carla Smith',
          author: 'John Doe',
          dueDate: 'Oct 18',
          project: 'Website Revamp',
          color: '#ef4444'
        }
      ]
    },
    {
      id: 2,
      name: 'Cloud Migration',
      description: 'Migrate infrastructure to cloud services',
      progress: 25,
      color: '#10b981',
      members: [
        { id: 1, name: 'Alice Dupont', email: 'alice@company.com', role: 'member' },
        { id: 5, name: 'John Doe', email: 'john@company.com', role: 'admin' }
      ],
      observers: [],
      tasks: [
        {
          id: 6,
          title: 'Develop Backend API',
          description: 'Build RESTful API',
          status: 'inprogress',
          priority: 'high',
          assignedTo: 'John Doe',
          author: 'Alice Dupont',
          dueDate: 'Nov 30',
          project: 'Cloud Migration',
          color: '#f59e0b'
        },
        {
          id: 7,
          title: 'Setup Database Schema',
          description: 'Design database structure',
          status: 'todo',
          priority: 'medium',
          assignedTo: 'John Doe',
          author: 'Sarah Johnson',
          dueDate: 'Nov 15',
          project: 'Cloud Migration',
          color: '#3b82f6'
        },
        {
          id: 8,
          title: 'Write API Documentation',
          description: 'Document all endpoints',
          status: 'todo',
          priority: 'low',
          author: 'Mike Wilson',
          dueDate: 'Dec 5',
          project: 'Cloud Migration',
          color: '#3b82f6'
        }
      ]
    }
  ];

  get selectedProject(): Project | undefined {
    return this.projects.find(p => p.id === this.selectedProjectId);
  }

  get filteredTasks(): Task[] {
    if (!this.selectedProject || !this.selectedProject.tasks) return [];

    if (this.taskFilter === 'all') {
      return this.selectedProject.tasks;
    }
    return this.selectedProject.tasks.filter(t => t.status === this.taskFilter);
  }

  get assignedTasks(): Task[] {
    return this.filteredTasks.filter(t => t.assignedTo);
  }

  get unassignedTasks(): Task[] {
    return this.filteredTasks.filter(t => !t.assignedTo);
  }

  get taskStats() {
    if (!this.selectedProject || !this.selectedProject.tasks) {
      return { todo: 0, inprogress: 0, completed: 0, overdue: 0, total: 0 };
    }

    const tasks = this.selectedProject.tasks;
    return {
      todo: tasks.filter(t => t.status === 'todo').length,
      inprogress: tasks.filter(t => t.status === 'inprogress').length,
      completed: tasks.filter(t => t.status === 'completed').length,
      overdue: tasks.filter(t => t.status === 'overdue').length,
      total: tasks.length
    };
  }

  selectProject(projectId: number): void {
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

  viewTaskDetail(taskId: number): void {
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

