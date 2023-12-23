import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {map} from "rxjs/operators";
import {Ammo} from "./app/ammo.model";
import {Item} from "./app/item.model";

@Injectable({
  providedIn: 'root'
})
export class TarkovApiService {

  constructor(
    private http: HttpClient,
  ) { }

  getAmmo(): Observable<Ammo[]> {
    const queryAmmo = `ammo { item { id name shortName weight wikiLink iconLink inspectImageLink category { name normalizedName } } damage penetrationPower penetrationChance tracer stackMaxSize caliber }`;

    const query =  { query: `{ ${queryAmmo} }` };
    return this.http.post<DataWrapper>('https://api.tarkov.dev/graphql', query).pipe(
     map( res => res.data.ammo)
    );
  }

  getGuns(): Observable<Item[]> {
    const queryAmmo = `items(type: gun) { id name shortName weight wikiLink iconLink inspectImageLink category { name normalizedName } }`;

    const query =  { query: `{ ${queryAmmo} }` };
    return this.http.post<DataWrapper>('https://api.tarkov.dev/graphql', query).pipe(
      map( res => res.data.items)
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
  items: Item[]
  ammo: Ammo[]

  constructor(items: Item[], ammo: Ammo[]) {
    this.items = items
    this.ammo = ammo
  }
}
