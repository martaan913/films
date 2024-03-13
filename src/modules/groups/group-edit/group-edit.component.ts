import { Component } from '@angular/core';
import { GroupEditChildComponent } from '../group-edit-child/group-edit-child.component';

@Component({
  selector: 'app-group-edit',
  standalone: true,
  imports: [GroupEditChildComponent],
  templateUrl: './group-edit.component.html',
  styleUrl: './group-edit.component.css'
})
export class GroupEditComponent {

}
