import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DbRefBuilder } from '../firebase/db-ref-builder';
import { UserService } from '../user/user.service';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'ml-handshake',
  templateUrl: './handshake.component.html',
  styleUrls: ['./handshake.component.scss']
})
export class HandshakeComponent implements OnInit {
  handshakeId: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private refBuilder: DbRefBuilder,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.handshakeId = this.route.snapshot.paramMap.get('id');
  }

  confirm(handshakeId: string) {
    this.userService
      .getCurrentUser()
      .pipe(
        switchMap(user =>
          this.refBuilder.handshakeCommitRef(handshakeId).update({
            id: handshakeId,
            user_id: user.id
          })
        )
      )
      .subscribe(() => this.router.navigateByUrl(''));
  }

  reject(handshakeId: string) {
    this.router.navigateByUrl('');
  }
}
