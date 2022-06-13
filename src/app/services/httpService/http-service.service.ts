import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { configs } from '../../interfaces/serviceConfig'
import { Observable, throwError, of } from 'rxjs';
import { catchError, retry, map, tap } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class HttpServiceService {

  
  constructor(
    private http: HttpClient, 
    public router: Router,
    ) { }
  

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      console.error('Esto es un error')
      this.router.navigateByUrl('/');

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead
      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
  getAll(endpoint: String, token: string) {
    const fullUrl = configs.BaseUri + endpoint + configs.retreiveEndpoint
    return this.http.get<Object>(fullUrl, {
      headers: new HttpHeaders(
        { 
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
        })
    })
      .pipe(
        tap(_ => console.log('fetched heroes')),
        catchError(this.handleError<Object>('getHeroes', []))
      );
  }

  login(userName: String, password: String) {
    const fullUrl = configs.BaseUri + configs.loginEndpoint
    const basic = btoa(userName + ':' + password)
    return this.http.post<any>(fullUrl, null, {
      headers: new HttpHeaders(
        { 
          'Content-Type': 'application/json',
          'Authorization': 'Basic ' + basic
        })
    }).pipe(
      tap((response: any) => console.log(`added hero w/ id=${JSON.stringify(response)}`)),
      catchError(this.handleError<any>('addHero'))
    );
  }
}
