import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Elements } from '../interfaces/elements';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ElementService {
  constructor(private httpClient: HttpClient) {}

  jsonUrl = '/assets/data.json';

  getElements(): Observable<Elements[]> {
    return this.httpClient.get<Elements[]>(this.jsonUrl);
  }
}
