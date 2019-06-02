import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { Provider } from '../provider.model';

@Component({
  templateUrl: './view.component.html',
})
export class ViewComponent implements OnInit {

  provider: Provider;

  constructor(private route: ActivatedRoute,
              public dialog: MatDialog) { }

  ngOnInit() {
    this.route.data.subscribe((data: { provider: Provider }) => {
      this.provider = data.provider;
    });
  }
}
