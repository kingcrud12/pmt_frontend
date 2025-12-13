import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Project } from '../../core/models/task.model';

@Component({
  selector: 'app-task-create',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './task-create.component.html',
  styleUrl: './task-create.component.css'
})
export class TaskCreateComponent implements OnInit {
  taskForm: FormGroup;
  selectedProjectId: number | null = null;
  selectedProjectName: string = '';

  // Mock Data
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

  users: string[] = ['Alice Dupont', 'Sarah Johnson', 'Mike Wilson', 'Emma', 'Carla'];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.taskForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      projectId: [null, Validators.required],
      priority: ['medium', Validators.required],
      dueDate: ['', Validators.required],
      assignedTo: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    // Get projectId from query params
    this.route.queryParams.subscribe(params => {
      if (params['projectId']) {
        this.selectedProjectId = +params['projectId'];
        const project = this.projects.find(p => p.id === this.selectedProjectId);

        if (project) {
          this.selectedProjectName = project.name;
          this.taskForm.patchValue({ projectId: this.selectedProjectId });
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
