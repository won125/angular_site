import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { ApiResponse } from '../api-response';

import { UtilService } from '../util.service';
import { UserService } from '../user.service';

@Component({
  selector: 'app-user-new',
  templateUrl: './user-new.component.html',
  styleUrls: ['./user-new.component.css']
})
export class UserNewComponent implements OnInit {
  errorResponse: ApiResponse;
  form: FormGroup;
  formErrors = {
    'username':'',
    'name':'',
    'email':'',
    'password':'',
    'passwordConfirmation':'',
  };
  formErrorMessages = {
    'username': {
      'required': '아이디를 입력해주십시오.',
      'pattern': '아이디는 4~12글자를 사용해야 합니다!',
    },
    'name': {
      'required': '이름을 입력해주십시오!',
      'pattern': '이름은 3~12글자를 사용해야 합니다!',
    },
    'email': {
      'pattern': '올바른 이메일 주소를 입력해 주십시오!',
    },
    'password': {
      'required': '비밀번호를 입력해주십시오!',
      'pattern': '비밀번호는 최소 8자 이상 영어와 숫자를 혼합해주셔야합니다!',
    },
    'passwordConfirmation': {
      'required': '비밀번호 확인을 입력해주십시오!',
      'match': '비밀번호가 같지 않습니다!',
    },
  };
  buildForm(): void {
    this.form = this.formBuilder.group({
      username:["", [Validators.required, Validators.pattern(/^.{4,12}$/)]],
      name:["", [Validators.required, Validators.pattern(/^.{3,12}$/)]],
      email:["", [Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)]],
      password:["", [Validators.required, Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,16}$/)]],
      passwordConfirmation:["", [Validators.required]],
    }, {
      validator: this.customValidation,
    });

    this.form.valueChanges.subscribe(data => {
      this.utilService.updateFormErrors(this.form, this.formErrors, this.formErrorMessages);
    });
  };

  customValidation(group: FormGroup) {
    var password = group.get('password');
    var passwordConfirmation = group.get('passwordConfirmation');
    if(password.dirty && passwordConfirmation.dirty && password.value != passwordConfirmation.value){
        passwordConfirmation.setErrors({'match': true});
    }
  }

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private utilService: UtilService,
    private userService: UserService,
  ) {
    this.buildForm();
  }

  ngOnInit() {
  }

  submit() {
    this.utilService.makeFormDirtyAndUpdateErrors(this.form, this.formErrors, this.formErrorMessages);
    if(this.form.valid){
      this.userService.create(this.form.value)
      .then(data =>{
        this.router.navigate(['/']);
      })
      .catch(response =>{
        this.errorResponse = response;
        this.utilService.handleFormSubmitError(this.errorResponse, this.form, this.formErrors);
      });
    }
  }

}
