import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Barman } from '../../shared/models';

@Component({
  templateUrl: './view.component.html',
})
export class ViewComponent implements OnInit {

  barman: Barman;

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.data.subscribe((data: { barman: Barman }) => {
      this.barman = data.barman;
    });
  }
}
