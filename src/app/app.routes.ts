import { Routes } from '@angular/router';
import {SortingComponent} from "./sorting/sorting.component";
import {HelloComponent} from "./hello/hello.component";
import {GuessingComponent} from "./guessing/guessing.component";

export const routes: Routes = [
  { path: '',   redirectTo: '/hello', pathMatch: 'full' },
  { path: 'hello', component: HelloComponent },
  { path: 'sorting', component: SortingComponent },
  { path: 'guessing', component: GuessingComponent }
];
