import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { configs } from '../../interfaces/serviceConfig'
import { Observable, throwError, of } from 'rxjs';
import { catchError, retry, map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class HttpServiceService {

  token: String = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdXRob3JpemF0aW9uIjoiTVRFeE5ERXlNV1JrTVdSa01UcEtNSEpuUlVCTU1WUTMiLCJpYXQiOjE2NTQ4ODkxNDIsImV4cCI6MTY1NDkxNzk0Mn0.m0fd_IgqKSWsvX_Oa8hCdHLBWQldHemv7TDzq3X5mok'
  constructor(private http: HttpClient) { }
  

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead
      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
  getAll(endpoint: String) {
    const fullUrl = configs.BaseUri + endpoint + configs.retreiveEndpoint
    return this.http.get<Object>(fullUrl, {
      headers: new HttpHeaders(
        { 
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + this.token
        })
    })
      .pipe(
        tap(_ => console.log('fetched heroes')),
        catchError(this.handleError<Object>('getHeroes', []))
      );
  }
}
