import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-top-nav',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './top-nav.component.html',
  styleUrl: './top-nav.component.css'
})
export class TopNavComponent {
  userName: string = 'Alice Dupont';
  userInitials: string = 'AD';
  showUserMenu = false;

  constructor(private router: Router) { }

  toggleUserMenu(): void {
    this.showUserMenu = !this.showUserMenu;
  }

  navigateToProfile(): void {
    this.showUserMenu = false;
    this.router.navigate(['/profile']);
  }

  logout(): void {
    this.showUserMenu = false;
    console.log('User logged out');
    // Implement actual logout logic here
    this.router.navigate(['/tasks']); // temporary redirect
  }
}

