import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { User } from '../user';

import { AuthService } from '../auth.service';

@Component({
  selector: 'app-user-info',
  templateUrl: './user-info.component.html',
  styleUrls: ['./user-info.component.css']
})
export class UserInfoComponent implements OnInit {

  user: User;

  constructor(
    private route: ActivatedRoute,
    public authService: AuthService,
  ) {
    this.user = authService.getCurrentUser();
  }

  ngOnInit() {
  }

}
