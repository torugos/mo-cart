import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {path: '', redirectTo: 'home',pathMatch: 'full'},
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)},
  {
    path: 'cart-list',
    loadChildren: () => import('./cart-list/cart-list.module').then( m => m.CartListPageModule)
  },
  {
    path: 'cart-list-modal',
    loadChildren: () => import('./cart-list/cart-list-modal/cart-list-modal.module').then( m => m.CartListModalPageModule)
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
