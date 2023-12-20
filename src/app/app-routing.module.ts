import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {SortingComponent} from './sorting/sorting.component';
import {HelloComponent} from './hello/hello.component';


const routes: Routes = [
  { path: '',   redirectTo: '/hello', pathMatch: 'full' },
  { path: 'hello', component: HelloComponent },
  { path: 'sorting', component: SortingComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
