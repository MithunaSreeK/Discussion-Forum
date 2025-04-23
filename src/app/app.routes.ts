import { Routes } from '@angular/router';
import { LoginComponent } from '../login/login/login.component';
import { RegisterComponent } from '../login/register/register.component';
import { HomeComponent } from './home/home.component';
import { ForumComponent } from './forum/forum.component';
import { NewThreadComponent } from './forum/new-thread/new-thread.component';

// Dummy placeholder components for sidebar pages
import { AboutComponent } from '../components/about/about.component';
import { AdvertiseComponent } from '../components/advertise/advertise.component';
import { DiscussionForumComponent } from '../components/discussion-forum/discussion-forum.component';
import { AssistComponent } from '../components/assist/assist.component';
import { BlogComponent } from '../components/blog/blog.component';
import { CareersComponent } from '../components/careers/careers.component';
import { PressComponent } from '../components/press/press.component';
import { CommunitiesComponent } from '../components/communities/communities.component';
import { BestOfComponent } from '../components/best-of/best-of.component';
import { TopicsComponent } from '../components/topics/topics.component';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },   
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'forum', component: ForumComponent },
  { path: 'new-thread', component: NewThreadComponent },

  // Sidebar routes
  { path: 'about', component: AboutComponent },
  { path: 'advertise', component: AdvertiseComponent },
  { path: 'discussionForum', component: DiscussionForumComponent },
  { path: 'assist', component: AssistComponent },
  { path: 'blog', component: BlogComponent },
  { path: 'careers', component: CareersComponent },
  { path: 'press', component: PressComponent },
  { path: 'communities', component: CommunitiesComponent },
  { path: 'best-of', component: BestOfComponent },
  { path: 'topics', component: TopicsComponent },
];
