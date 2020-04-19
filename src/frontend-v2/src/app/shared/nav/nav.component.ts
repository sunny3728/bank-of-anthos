import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {

  name: string = null;
  authenticated: boolean = false;

  constructor(private auth: AuthService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.auth.listen().subscribe(
      (updatedRoute) => { 
        this.updateNav();
      }
    );
  }

  updateNav() {
    this.authenticated = this.auth.isAuthenticated();
    this.name = this.authenticated ? this.auth.getName() : null;
  }

  logout() {
    this.auth.logout();
  }
}
