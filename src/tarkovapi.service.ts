import { Injectable } from '@angular/core';
import {Observable, of} from 'rxjs';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TarkovapiService {

  constructor(
    private http: HttpClient,
  ) { }

  getAmmo(): Observable<{}> {
    const queryAmmo = `
      items(name: "m855a1") {
          id
          name
          shortName
      }`;

    const headers = {'Content-Type': 'application/json'};
    const query =  { query: `{ ${queryAmmo} }` };
    return this.http.request('post', 'https://api.tarkov.dev/graphql', {
      headers,
      body: query,
    });
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      console.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
}
