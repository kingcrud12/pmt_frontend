import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {
  profileForm: FormGroup;

  // Mock User Data
  user = {
    firstName: 'Alice',
    lastName: 'Dupont',
    email: 'alice.dupont@company.com',
    jobTitle: 'Senior UX Designer',
    password: 'password123'
  };

  constructor(
    privatefb: FormBuilder,
    private router: Router
  ) {
    this.profileForm = privatefb.group({
      firstName: [{ value: '', disabled: true }],
      lastName: [{ value: '', disabled: true }],
      jobTitle: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(8)]]
    });
  }

  ngOnInit(): void {
    // Initialize form with user data
    this.profileForm.patchValue({
      firstName: this.user.firstName,
      lastName: this.user.lastName,
      jobTitle: this.user.jobTitle,
      password: this.user.password
    });
  }

  onSubmit(): void {
    if (this.profileForm.valid) {
      // Simulate API call to update user
      const updatedData = this.profileForm.getRawValue(); // getRawValue to include disabled fields if needed

      // Update local mock object for immediate feedback
      this.user.jobTitle = updatedData.jobTitle;
      this.user.password = updatedData.password;

      console.log('Profile updated:', updatedData);
      alert('Profile updated successfully!');
    } else {
      this.profileForm.markAllAsTouched();
    }
  }

  onCancel(): void {
    this.router.navigate(['/tasks']);
  }
}
