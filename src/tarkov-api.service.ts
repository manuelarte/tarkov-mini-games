import { Injectable } from '@angular/core';
import {Observable, of} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {map} from "rxjs/operators";
import {Ammo} from "./app/ammo.model";

@Injectable({
  providedIn: 'root'
})
export class TarkovApiService {

  constructor(
    private http: HttpClient,
  ) { }

  getAmmo(): Observable<Ammo[]> {
    const queryAmmo = `ammo { item { id name shortName wikiLink iconLink } damage penetrationPower penetrationChance tracer stackMaxSize caliber }`;

    const query =  { query: `{ ${queryAmmo} }` };
    return this.http.post<DataWrapper>('https://api.tarkov.dev/graphql', query).pipe(
     map( res => res.data.ammo)
    );
  }
}


class DataWrapper {
  data: Data

  constructor(data: Data) {
    this.data = data
  }
}


class Data {
  ammo: Ammo[]

  constructor(ammo: Ammo[]) {
    this.ammo = ammo
  }
}
