import { Component, OnInit } from '@angular/core';
import { KommissionService } from '../../_services';
import { ActivatedRoute } from '@angular/router';
import { Kommission, Barman } from '../../_models';

@Component({
  templateUrl: './kommission-view.component.html',
})

export class KommissionViewComponent implements OnInit {

  kommission: Kommission;

  constructor(
    private kommissionService: KommissionService,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.kommissionService.getById(params['id']).subscribe((kommission) => {
        this.kommission = kommission;
      });
    });
  }

  getBarmen(active: boolean): Barman[] {
    if (this.kommission) return this.kommission.barmen.filter(b => active ? !b.leaveAt : b.leaveAt);
    return [];
  }
}
