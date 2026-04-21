import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, CardModule, ButtonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  username: string = 'User';

  stats = [
    { label: 'Active CRQs', value: 12 },
    { label: 'In Progress', value: 3 },
    { label: 'Success Rate', value: '98.5%' }
  ];

  // Blog posts data
  blogPosts = [
    {
      title: 'How to Manage CRQs Effectively',
      author: 'Sarah Chen',
      date: 'Aug 20, 2025',
      preview: 'Discover best practices for handling Change Requests in enterprise deployments with minimal risk...',
      image: 'https://picsum.photos/seed/crq/600/300'
    },
    {
      title: 'Zero-Downtime Deployment Strategies',
      author: 'Mike Rodriguez',
      date: 'Aug 22, 2025',
      preview: 'Learn different deployment strategies like Blue-Green, Canary, and Rolling updates with real-world use cases...',
      image: 'https://picsum.photos/seed/deploy/600/300'
    },
    {
      title: 'Post-Deployment Validation',
      author: 'John Smith',
      date: 'Aug 24, 2025',
      preview: 'Ensure that your deployments are successful by implementing automated validation and monitoring...',
      image: 'https://picsum.photos/seed/validation/600/300'
    }
  ];

  ngOnInit(): void {
    const storedUser = localStorage.getItem('username');
    if (storedUser) {
      this.username = storedUser;
    }
  }
}
