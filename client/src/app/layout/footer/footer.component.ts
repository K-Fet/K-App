import { Component, OnInit } from '@angular/core';
import { versions } from '../../../environments/versions';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent implements OnInit {

  version: string;
  link: string;
  tooltip: string;

  constructor() {
    this.version = versions.version;
    this.link = `${versions.repo}/commit/${versions.revision}`;
    this.tooltip = ['version', 'revision', 'branch']
      .map(k => `${k}: ${versions[k]}`)
      .join(' ');
  }

  ngOnInit() {

  }

}
