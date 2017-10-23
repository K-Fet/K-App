import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
    title = 'app';

    constructor(private http: HttpClient) {}

    ngOnInit(): void {
        this.http.get('/api/hello', {responseType: 'text'}).subscribe(data => {
            console.log('Result: ' + data);
        });
    }
}
