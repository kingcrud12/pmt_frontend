import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { TaskDetail, HistoryEntry } from '../../core/models/task.model';

@Component({
  selector: 'app-task-detail',
  imports: [CommonModule],
  templateUrl: './task-detail.component.html',
  styleUrl: './task-detail.component.css'
})
export class TaskDetailComponent implements OnInit {
  taskId: number | null = null;
  task: TaskDetail | null = null;

  // Mock data - in real app, this would come from a service
  private tasks: TaskDetail[] = [
    {
      id: 1,
      title: 'Design Homepage UI',
      description: 'Create modern homepage design with new branding. The design should include a hero section, feature highlights, testimonials, and a clear call-to-action. Use the new color palette and ensure mobile responsiveness.',
      status: 'overdue',
      priority: 'high',
      assignedTo: 'Alice Dupont',
      author: 'John Doe',
      project: 'Website Revamp',
      createdAt: 'Oct 1, 2024',
      dueDate: 'Oct 20, 2024',
      color: '#ef4444',
      history: [
        { date: 'Oct 1, 2024 10:30', user: 'John Doe', action: 'Created task' },
        { date: 'Oct 5, 2024 14:20', user: 'John Doe', action: 'Assigned to', field: 'assignedTo', oldValue: 'Unassigned', newValue: 'Alice Dupont' },
        { date: 'Oct 10, 2024 09:15', user: 'Alice Dupont', action: 'Updated', field: 'description', oldValue: 'Create homepage design', newValue: 'Create modern homepage design with new branding' },
        { date: 'Oct 15, 2024 16:45', user: 'Alice Dupont', action: 'Changed priority', field: 'priority', oldValue: 'medium', newValue: 'high' }
      ]
    },
    {
      id: 3,
      title: 'Setup Database Schema',
      description: 'Design and implement database structure for the new cloud migration project. Include tables for users, projects, tasks, and relationships.',
      status: 'todo',
      priority: 'medium',
      assignedTo: 'Alice Dupont',
      author: 'Sarah Johnson',
      project: 'Cloud Migration',
      createdAt: 'Oct 15, 2024',
      dueDate: 'Nov 15, 2024',
      color: '#3b82f6',
      history: [
        { date: 'Oct 15, 2024 11:00', user: 'Sarah Johnson', action: 'Created task' },
        { date: 'Oct 16, 2024 09:30', user: 'Sarah Johnson', action: 'Assigned to', field: 'assignedTo', oldValue: 'Unassigned', newValue: 'Alice Dupont' }
      ]
    }
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.taskId = +params['id'];
      this.loadTask();
    });
  }

  loadTask(): void {
    if (this.taskId) {
      this.task = this.tasks.find(t => t.id === this.taskId) || null;
    }
  }

  goBack(): void {
    this.router.navigate(['/tasks']);
  }

  getStatusClass(status: string): string {
    return `status-badge--${status}`;
  }

  getPriorityClass(priority: string): string {
    return `priority-badge--${priority}`;
  }
}
