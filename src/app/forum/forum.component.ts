import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { FormsModule, NgForm } from '@angular/forms';
import { ThreadCardComponent } from './thread-card/thread-card.component';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-forum',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule, ThreadCardComponent],
  templateUrl: './forum.component.html',
  styleUrls: ['./forum.component.css']
})
export class ForumComponent {
  http = inject(HttpClient);
  router = inject(Router);
  authService = inject(AuthService);

  threads: any[] = [];
  searchTerm = '';
  submitted = false;
  showEmptyError = false;

  newThread = {
    title: '',
    content: '',
    likes: 0,
    dislikes: 0,
    comments: [],
    user: this.getCurrentUserOrGuest()
  };

  ngOnInit() {
    this.getThreads();
  }

  getCurrentUserOrGuest() {
    const user = this.authService.getCurrentUser();
    return user && user.username
      ? user
      : {
          username: 'guest_user',
          profilePic: 'https://i.pravatar.cc/100'
        };
  }

  getThreads() {
    this.http.get<any[]>('http://localhost:3000/threads').subscribe(data => {
      this.threads = data.reverse();
    });
  }

  postThread(form?: NgForm) {
    this.submitted = true;

    const isTitleEmpty = !this.newThread.title || this.newThread.title.trim().length < 3;
    this.showEmptyError = isTitleEmpty;

    if (form && form.invalid || isTitleEmpty) {
      return;
    }

    const threadToPost = {
      ...this.newThread,
      user: this.getCurrentUserOrGuest()
    };

    this.http.post('http://localhost:3000/threads', threadToPost).subscribe(() => {
      this.newThread.title = '';
      this.newThread.content = '';
      this.submitted = false;
      this.showEmptyError = false;
      this.getThreads();
    });
  }

  onTitleInputChange() {
    if (this.newThread.title.trim().length >= 3) {
      this.showEmptyError = false;
    }
  }

  goToNewThread() {
    this.router.navigate(['/new-thread']);
  }

  get filteredThreads() {
    if (!this.searchTerm.trim()) return this.threads;
    const term = this.searchTerm.toLowerCase();
    return this.threads.filter(t =>
      t.title?.toLowerCase().includes(term) || t.content?.toLowerCase().includes(term)
    );
  }
}
