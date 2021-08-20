import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { User } from '../user';
import { ApiResponse } from '../api-response';

import { UtilService } from '../util.service';
import { UserService } from '../user.service';
import { AuthService } from '../auth.service';


@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.css']
})
export class UserEditComponent implements OnInit {
  user: User;
  errorResponse: ApiResponse;
  form: FormGroup;
  formErrors = {
    'currentPassword':'',
    'username':'',
    'name':'',
    'email':'',
    'newPassword':'',
    'passwordConfirmation':'',
  };
  formErrorMessages = {
    'username': {
      'required': '아이디를 입력해주십시오.',
      'pattern': '아이디는 4~12글자를 사용해야 합니다!',
    },
    'currentPassword': {
      'required': '비밀번호를 입력해 주십시오!',
    },
    'name': {
      'required': '이름을 입력해주십시오!',
      'pattern': '이름은 3-12자 사이로 입력해 주십시오!',
    },
    'email': {
      'pattern': '올바른 이메일주소로 입력해 주십시오!',
    },
    'newPassword': {
      'pattern': '비밀번호는 최소 8자 이상 영어와 숫자를 혼합해주셔야합니다!',
    },
    'passwordConfirmation': {
      'match': '비밀번호가 같지 않습니다!',
    },
  };
  buildForm(): void {
    this.form = this.formBuilder.group({
      currentPassword:["", [Validators.required]],
      username:[this.user.username, [Validators.required, Validators.pattern(/^.{4,12}$/)]],
      name:[this.user.name, [Validators.required, Validators.pattern(/^.{4,12}$/)]],
      email:[this.user.email, [Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)]],
      newPassword:["", [Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,16}$/)]],
      passwordConfirmation:[""],
    }, {
      validator: this.customValidation,
    });

    this.form.valueChanges.subscribe(data => {
      this.utilService.updateFormErrors(this.form, this.formErrors, this.formErrorMessages);
    });
  };

  customValidation(group: FormGroup) {
    var password = group.get('newPassword');
    var passwordConfirmation = group.get('passwordConfirmation');
    if(password.dirty && passwordConfirmation.dirty && password.value != passwordConfirmation.value){
        passwordConfirmation.setErrors({'match': true});
    }
  }

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private utilService: UtilService,
    private userService: UserService,
    public authService: AuthService,
  ) {
    this.user = this.route.snapshot.data['user'];
    this.buildForm();
  }

  ngOnInit() {
  }

  submit() {
    this.utilService.makeFormDirtyAndUpdateErrors(this.form, this.formErrors, this.formErrorMessages);
    if(this.form.valid){
      this.userService.update(this.user.username, this.form.value)
      .then(data =>{
      this.router.navigate(['/','user','info']);
      })
      .catch(response =>{
        this.errorResponse = response;
        this.utilService.handleFormSubmitError(this.errorResponse, this.form, this.formErrors);
      });
    }
  }

  delete() {
    var answer = confirm("정말 회원 탈퇴를 하시겠습니까?");
    if(answer){
      this.userService.destroy(this.user.username)
      .then(data =>{
        this.authService.logout();
      })
      .catch(response =>{
        this.errorResponse = response;
        this.utilService.handleFormSubmitError(this.errorResponse, this.form, this.formErrors);
      });
    }
  }

}
