import { Component, OnInit } from '@angular/core';
import { ElementService } from '../../services/data.service';
import { Elements } from '../../interfaces/elements';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { EditDialogComponent } from '../edit-dialog/edit-dialog.component';

@Component({
  standalone: true,
  selector: 'app-table',
  templateUrl: './table.component.html',
  imports: [MatTableModule, MatDialogModule, CommonModule],
})
export class TableComponent implements OnInit {
  elements: Elements[] = [];
  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];
  dataSource = new MatTableDataSource<Elements>();

  constructor(
    private elementService: ElementService,
    public dialog: MatDialog
  ) {}

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

  openEditDialog(element: Elements): void {
    const dialogRef = this.dialog.open(EditDialogComponent, {
      width: '250px',
      data: { ...element },
    });

    dialogRef.afterClosed().subscribe((result: Elements) => {
      if (result) {
        this.updateElement(result);
      }
    });
  }

  updateElement(newElement: Elements) {
    this.elements = this.elements.map((element) =>
      element.position === newElement.position ? { ...newElement } : element
    );
    this.dataSource.data = [...this.elements];
  }
}
