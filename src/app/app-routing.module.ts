import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from './auth.guard';
import { UsersResolve } from './users.resolve';
import { UserResolve } from './user.resolve';

import { WelcomeComponent } from './welcome/welcome.component';
import { Error404Component } from './error404/error404.component';
import { LoginComponent } from './login/login.component';
import { UserNewComponent } from './user-new/user-new.component';
import { UserIndexComponent } from './user-index/user-index.component';
import { UserShowComponent } from './user-show/user-show.component';
import { UserEditComponent } from './user-edit/user-edit.component';
import { UserInfoComponent } from './user-info/user-info.component';
import { CampaignListComponent } from './campaign-list/campaign-list.component';
import { CampaignDetailComponent } from './campaign-detail/campaign-detail.component';

const routes: Routes = [
  { path: '',  component: WelcomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'users/new',  component: UserNewComponent },

  { path: 'users', canActivate: [AuthGuard],
    children: [
      { path: '',
        component: UserIndexComponent,
        resolve: {
          users: UsersResolve,
        }
      },
      { path: ':username',
        component: UserShowComponent,
        resolve: {
          user: UserResolve
        }
      },
      { path: ':username/edit',
        component: UserEditComponent,
        resolve: {
          user: UserResolve
        }
      },
    ]
  },
  { path: 'user/info',  component: UserInfoComponent },
  { path: 'campaign/list',  component: CampaignListComponent },
  { path: 'campaign/detail',  component: CampaignDetailComponent },
  { path: '**', component: Error404Component },
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
