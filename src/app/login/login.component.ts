import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { ApiResponse } from '../api-response';

import { UtilService } from '../util.service';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  redirectTo: string;
  errorResponse: ApiResponse;
  form: FormGroup;
  formErrors = {
    'username':'',
    'password':'',
  };
  formErrorMessages = {
    'username': {
      'required': '아이디를 입력해 주십시오!',
    },
    'password': {
      'required': '비밀번호를 입력해 주십시오!',
    },
  };
  buildForm(): void {
    this.form = this.formBuilder.group({
      username:["", Validators.required],
      password:["", Validators.required],
    });

    this.form.valueChanges.subscribe(data => {
      this.utilService.updateFormErrors(this.form, this.formErrors, this.formErrorMessages);
    });
  };

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private utilService: UtilService,
    private authService: AuthService,
  ) {
    this.buildForm();
    this.redirectTo = this.route.snapshot.queryParamMap.get('redirectTo');
  }

  ngOnInit() {
  }

  submit() {
    this.utilService.makeFormDirtyAndUpdateErrors(this.form, this.formErrors, this.formErrorMessages);
    if(this.form.valid){
      this.authService.login(this.form.value.username, this.form.value.password)
      .then(data =>{
        this.router.navigate([this.redirectTo?this.redirectTo:'/']);
      })
      .catch(response =>{
        this.errorResponse = response;
        this.utilService.handleFormSubmitError(this.errorResponse, this.form, this.formErrors);
      });
    }
  }

}
