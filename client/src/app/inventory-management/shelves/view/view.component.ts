import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material';
import { Shelf} from '../shelves.model';

@Component({
  templateUrl: './view.component.html',
})
export class ViewComponent implements OnInit {

  shelf: Shelf;

  constructor(private route: ActivatedRoute,
              public dialog: MatDialog) { }

  ngOnInit() {
    this.route.data.subscribe((data: { shelf: Shelf }) => {
      this.shelf = data.shelf;
    });
  }
}
