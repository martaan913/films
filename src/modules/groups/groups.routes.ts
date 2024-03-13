import { Routes } from '@angular/router';
import { GroupsListComponent } from './groups-list/groups-list.component';
import { GroupsMenuComponent } from './groups-menu/groups-menu.component';
import { GroupEditComponent } from './group-edit/group-edit.component';
import { GroupDetailComponent } from './group-detail/group-detail.component';

export const routes: Routes = [
  {path : '', component: GroupsMenuComponent, children:[
    {path: '', component: GroupsListComponent},
    {path: 'new', component: GroupEditComponent},
    {path: 'edit/:id', component: GroupEditComponent},
    {path: 'detail/:id', component: GroupDetailComponent}
  ]}
];
