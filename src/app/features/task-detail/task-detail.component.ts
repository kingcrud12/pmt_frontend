import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { TaskDetail } from '../../core/models/task.model';
import { TaskHistory } from '../../core/models/task-history.model';

@Component({
  selector: 'app-task-detail',
  imports: [CommonModule],
  templateUrl: './task-detail.component.html',
  styleUrl: './task-detail.component.css'
})
export class TaskDetailComponent implements OnInit {
  taskId: string | null = null;
  task: TaskDetail | null = null;

  // Mock data - in real app, this would come from a service
  private tasks: TaskDetail[] = [
    {
      id: '550e8400-e29b-41d4-a716-446655440000',
      name: 'Design Homepage UI',
      description: 'Create modern homepage design with new branding.',
      status: 'overdue',
      priority: 'High',
      assignee_id: 'user-uuid-1',
      project_id: '123e4567-e89b-12d3-a456-426614174000',
      created_at: '2024-10-01',
      due_date: '2024-10-20',
      history: [
        {
          id: 'hist-1',
          task_id: '550e8400-e29b-41d4-a716-446655440000',
          modifier_id: 'user-uuid-admin',
          change_type: 'Created task',
          modified_at: '2024-10-01T10:30:00'
        },
        {
          id: 'hist-2',
          task_id: '550e8400-e29b-41d4-a716-446655440000',
          modifier_id: 'user-uuid-admin',
          change_type: 'Assigned to',
          old_value: 'Unassigned',
          new_value: 'Alice Dupont',
          modified_at: '2024-10-05T14:20:00'
        }
      ]
    }
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.taskId = params['id'];
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
