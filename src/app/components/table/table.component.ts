import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { ElementService } from '../../services/data.service';
import { Elements } from '../../interfaces/elements';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { EditDialogComponent } from '../edit-dialog/edit-dialog.component';
import { FormsModule } from '@angular/forms';
import { Observable, fromEvent } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  standalone: true,
  selector: 'app-table',
  templateUrl: './table.component.html',
  imports: [MatTableModule, MatDialogModule, CommonModule, FormsModule],
})
export class TableComponent implements OnInit {
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

    // Filtrowanie z opóźnieniem 2s
    fromEvent(this.filterInput.nativeElement, 'input')
      .pipe(
        debounceTime(2000), // 2 sekundy opóźnienia
        distinctUntilChanged() // Sprawdź, czy wartość faktycznie się zmieniła
      )
      .subscribe(() => {
        const filterValue = this.filterInput.nativeElement.value
          .trim()
          .toLowerCase();
        this.dataSource.filter = filterValue;
      });
  }

  // Otwiera popup do edycji rekordu
  openEditDialog(element: Elements): void {
    const dialogRef = this.dialog.open(EditDialogComponent, {
      width: '250px',
      data: { ...element }, // Przekazujemy kopię obiektu
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.updateElement(result); // Aktualizuj rekord w tabeli po zapisaniu
      }
    });
  }

  // Aktualizuje rekord w tabeli (niemutowalnie)
  updateElement(updatedElement: Elements): void {
    const updatedData = this.dataSource.data.map((element) =>
      element.position === updatedElement.position ? updatedElement : element
    );
    this.dataSource.data = [...updatedData]; // Niemutowalna aktualizacja
  }
}
