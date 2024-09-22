import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { ElementService } from '../../services/data.service';
import { Elements } from '../../interfaces/elements';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { EditDialogComponent } from '../edit-dialog/edit-dialog.component';
import { FormsModule } from '@angular/forms';
import { fromEvent } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  standalone: true,
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrl: './table.component.css',
  imports: [MatTableModule, MatDialogModule, CommonModule, FormsModule],
})
export class TableComponent implements OnInit {
  clearFilter(filterInput: HTMLInputElement) {
    this.dataSource.filter = '';
    filterInput.value = '';
  }
  displayedColumns: string[] = [
    'position',
    'name',
    'weight',
    'symbol',
    'actions',
  ];
  dataSource = new MatTableDataSource<Elements>();
  @ViewChild('filterInput', { static: true }) filterInput!: ElementRef;

  constructor(
    private elementService: ElementService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.elementService.getElements().subscribe((data: Elements[]) => {
      this.dataSource.data = data;
    });

    fromEvent(this.filterInput.nativeElement, 'input')
      .pipe(debounceTime(2000), distinctUntilChanged())
      .subscribe(() => {
        const filterValue = this.filterInput.nativeElement.value
          .trim()
          .toLowerCase();
        this.dataSource.filter = filterValue;
      });
  }

  openEditDialog(element: Elements): void {
    const dialogRef = this.dialog.open(EditDialogComponent, {
      width: '250px',
      data: { ...element },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.updateElement(result);
      }
    });
  }

  updateElement(updatedElement: Elements): void {
    const updatedData = this.dataSource.data.map((element) =>
      element.position === updatedElement.position ? updatedElement : element
    );
    this.dataSource.data = [...updatedData];
  }
}
