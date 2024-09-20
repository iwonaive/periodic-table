import { Component, OnInit } from '@angular/core';
import { ElementService } from '../../services/data.service';
import { Elements } from '../../interfaces/elements';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  standalone: true,
  selector: 'app-table',
  templateUrl: './table.component.html',
  imports: [],
})
export class TableComponent implements OnInit {
  elements: Elements[] = []; 
  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];
  dataSource = new MatTableDataSource<Elements>(); 

  constructor(private elementService: ElementService) {}

  ngOnInit(): void {
    this.elementService.getElements().subscribe((data: Elements[]) => {
      this.elements = data;
      this.dataSource.data = this.elements;
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  updateElement(newElement: Elements) {
    this.elements = this.elements.map((element) =>
      element.position === newElement.position ? { ...newElement } : element
    );
    this.dataSource.data = [...this.elements];
  }
}
