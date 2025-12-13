import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Project } from '../../core/models/project.model';

@Component({
  selector: 'app-task-create',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './task-create.component.html',
  styleUrl: './task-create.component.css'
})
export class TaskCreateComponent implements OnInit {
  taskForm: FormGroup;
  selectedProjectId: string | null = null;
  selectedProjectName: string = '';

  // Mock Data
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

  // Mock Users - In real app, load from UserService
  users: { id: string, name: string }[] = [
    { id: 'user-uuid-1', name: 'Alice Dupont' },
    { id: 'user-uuid-2', name: 'Carla' },
    { id: 'user-uuid-3', name: 'Sarah Johnson' },
    { id: 'user-uuid-4', name: 'Mike Wilson' },
    { id: 'user-uuid-5', name: 'Emma' }
  ];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.taskForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      project_id: [null, Validators.required],
      priority: ['Medium', Validators.required],
      due_date: ['', Validators.required],
      assignee_id: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    // Get projectId from query params
    this.route.queryParams.subscribe(params => {
      if (params['projectId']) {
        this.selectedProjectId = params['projectId']; // No + conversion
        const project = this.projects.find(p => p.id === this.selectedProjectId);

        if (project) {
          this.selectedProjectName = project.name;
          this.taskForm.patchValue({ project_id: this.selectedProjectId });
        }
      }
    });
  }

  onSubmit(): void {
    if (this.taskForm.valid) {
      console.log('Task Created:', this.taskForm.value);
      // Here we would call a service to save the task

      // Navigate back to tasks list
      this.router.navigate(['/tasks']);
    } else {
      this.taskForm.markAllAsTouched();
    }
  }

  onCancel(): void {
    this.router.navigate(['/tasks']);
  }
}
