import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { SocketMessageType } from 'src/payload/socketmessage.payload';
import { ApiService } from 'src/services/api.service';
import { WebSocketService } from 'src/services/websocket.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.sass']
})
export class LoginComponent implements OnInit {

  form!: FormGroup;
  loading = false;
  submitted = false;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private api: ApiService,
    private socket: WebSocketService
  ) { }

  ngOnInit() {
    this.form = this.formBuilder.group({
      username: ['sean@test.com', Validators.required],
      password: ['SeanPass', Validators.required]
    });
  }

  // convenience getter for easy access to form fields
  get f() { return this.form.controls; }

  onSubmit() {
    this.submitted = true;

    // reset alerts on submit
    // this.alertService.clear();

    // stop here if form is invalid
    if (this.form.invalid) {
      return;
    }

    this.loading = true;
    this.api.getToken({ email: this.f.username.value, password: this.f.password.value }).subscribe(res => {
      this.socket.connect(res.data.token);      
      this.router.navigateByUrl("/welcome");
    }, error => {
      this.loading = false;
      console.error(error);
    })
  }

}
