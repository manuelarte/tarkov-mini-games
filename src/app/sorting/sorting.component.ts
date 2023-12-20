import { Component, OnInit } from '@angular/core';
import {TarkovapiService} from '../tarkovapi.service';
import {tap} from 'rxjs/operators';

@Component({
  selector: 'app-sorting',
  templateUrl: './sorting.component.html',
  styleUrls: ['./sorting.component.scss']
})
export class SortingComponent implements OnInit {

  constructor(private api: TarkovapiService) { }

  ngOnInit() {
    console.log('Calling get ammo');
    this.api.getAmmo().pipe(
        tap(console.log),
    ).subscribe(value => console.log('value', value));
  }

}
