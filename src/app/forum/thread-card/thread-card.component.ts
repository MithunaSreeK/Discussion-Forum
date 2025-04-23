import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CommentService, Comment } from '../../../services/comment.service';
import { ThreadService } from '../../../services/thread.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-thread-card',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './thread-card.component.html',
  styleUrls: ['./thread-card.component.css']
})
export class ThreadCardComponent implements OnInit {
  @Input() thread: any;

  showCommentBox = false;
  newComment = '';
  comments: Comment[] = [];

  currentUserId = 'user123'; // You can get this dynamically if needed
  userReaction: 'like' | 'dislike' | null = null;
  currentUser: { username: string; profilePic?: string } | null = null;

  constructor(
    private commentService: CommentService,
    private threadService: ThreadService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadComments();
    this.currentUser = this.authService.getCurrentUser();
    this.currentUserId = this.currentUser?.username || 'user123';
    this.loadUserReaction();
  }

  toggleCommentBox() {
    this.showCommentBox = !this.showCommentBox;
  }

  likeThread() {
    if (this.userReaction === 'like') {
      this.thread.likes = Math.max(this.thread.likes - 1, 0);
      this.thread.likedBy = this.thread.likedBy.filter((id: string) => id !== this.currentUserId);
      this.userReaction = null;
    } else {
      if (this.userReaction === 'dislike') {
        this.thread.dislikes = Math.max(this.thread.dislikes - 1, 0);
        this.thread.dislikedBy = this.thread.dislikedBy.filter((id: string) => id !== this.currentUserId);
      }

      this.thread.likes = (this.thread.likes || 0) + 1;
      this.thread.likedBy = [...(this.thread.likedBy || []), this.currentUserId];
      this.userReaction = 'like';
    }

    this.updateThread();
  }

  dislikeThread() {
    if (this.userReaction === 'dislike') {
      this.thread.dislikes = Math.max(this.thread.dislikes - 1, 0);
      this.thread.dislikedBy = this.thread.dislikedBy.filter((id: string) => id !== this.currentUserId);
      this.userReaction = null;
    } else {
      if (this.userReaction === 'like') {
        this.thread.likes = Math.max(this.thread.likes - 1, 0);
        this.thread.likedBy = this.thread.likedBy.filter((id: string) => id !== this.currentUserId);
      }

      this.thread.dislikes = (this.thread.dislikes || 0) + 1;
      this.thread.dislikedBy = [...(this.thread.dislikedBy || []), this.currentUserId];
      this.userReaction = 'dislike';
    }

    this.updateThread();
  }

  updateThread() {
    this.threadService.updateThread(this.thread.id, {
      likes: this.thread.likes,
      likedBy: this.thread.likedBy,
      dislikes: this.thread.dislikes,
      dislikedBy: this.thread.dislikedBy
    }).subscribe((updated: any) => {
      this.thread = updated;
    });
  }

  loadUserReaction() {
    if (this.thread.likedBy?.includes(this.currentUserId)) {
      this.userReaction = 'like';
    } else if (this.thread.dislikedBy?.includes(this.currentUserId)) {
      this.userReaction = 'dislike';
    }
  }

  loadComments() {
    this.commentService.getCommentsForThread(this.thread.id).subscribe((data: Comment[]) => {
      this.comments = data;
    });
  }

  addComment() {
    const user = this.authService.getCurrentUser();
    const username = user?.username || 'Anonymous';

    if (this.newComment.trim()) {
      const comment: Comment = {
        threadId: this.thread.id,
        user: username,
        text: this.newComment.trim()
      };

      this.commentService.addComment(comment).subscribe((saved: Comment) => {
        this.comments.push(saved);
        this.newComment = '';
      });
    }
  }
}
