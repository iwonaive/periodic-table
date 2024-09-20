import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Elements } from '../interfaces/elements';
@Injectable({
  providedIn: 'root',
})
export class ElementService {
  ELEMENT_DATA: Elements[] = [];

  getElements(): Observable<Elements[]> {
    return of(this.ELEMENT_DATA);
  }
}
