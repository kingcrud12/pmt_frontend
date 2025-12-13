import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from './components/layout/sidebar/sidebar.component';
import { TopNavComponent } from './components/layout/top-nav/top-nav.component';
import { TextComponent } from './components/text/text.component';

@NgModule({
  imports: [
    CommonModule,
    SidebarComponent,
    TopNavComponent,
    TextComponent
  ],
  exports: [
    SidebarComponent,
    TopNavComponent,
    TextComponent
  ]
})
export class SharedModule { }
