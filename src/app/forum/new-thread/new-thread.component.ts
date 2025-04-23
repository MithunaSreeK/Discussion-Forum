import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-new-thread',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './new-thread.component.html',
  styleUrls: ['./new-thread.component.css']
})
export class NewThreadComponent {
  newThread = { title: '', content: '', imageUrl: '' };
  selectedImage: File | null = null;

  constructor(private http: HttpClient, public router: Router) {}

  onImageSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.selectedImage = file;

      const reader = new FileReader();
      reader.onload = () => {
        this.newThread.imageUrl = reader.result as string; // base64
      };
      reader.readAsDataURL(file);
    }
  }

  postThread() {
    this.http.post('http://localhost:3000/threads', this.newThread).subscribe(() => {
      this.router.navigate(['/forum']);
    });
  }
}
