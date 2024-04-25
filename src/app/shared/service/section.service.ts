import { SectionManagerApiService } from '../api/sectionManagerApi.service';
import { UpdateSection } from './../../model/section/updateSection.model';
import { NewSection } from './../../model/section/newSection.model';
import { Section } from './../../model/section/section.model';
import { SectionRequest } from './../../model/requests/section.request';
import { LogService } from './log.service';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class SectionService {
  public sections$: BehaviorSubject<Section[]>;

  constructor(
    private sectionManagenerApiService: SectionManagerApiService,
    private log: LogService
  ) {}

  get(name?: string, typeId?: number, gymId?: number, coachId?: number): Observable<Section[]> {
    const request = new SectionRequest(name, typeId, gymId, coachId);
    return this.sectionManagenerApiService.get(request).pipe(
      catchError(error => {
        this.log.error('Error occurred while fetching sections:', error);
        return throwError('Failed to fetch sections. Please try again later.');
      })
    );
  }

  add(name: string, typeId: number, gymId: number): Observable<any> {
    const newObj = new NewSection(name, typeId, gymId);
    return this.sectionManagenerApiService.add(newObj).pipe(
      catchError(error => {
        this.log.error('Error occurred while adding section:', error);
        return throwError('Failed to add section. Please try again later.');
      })
    );
  }

  update(id: number, name: string, typeId: number, gymId: number): Observable<any> {
    const objToUpdate = new UpdateSection(id, name, typeId, gymId);
    return this.sectionManagenerApiService.update(objToUpdate).pipe(
      catchError(error => {
        this.log.error('Error occurred while updating section:', error);
        return throwError('Failed to update section. Please try again later.');
      })
    );
  }
}
