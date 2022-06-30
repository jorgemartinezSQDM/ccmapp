import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { configs } from '../../interfaces/serviceConfig'
import { Observable, throwError, of } from 'rxjs';
import { catchError, retry, map, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { IR_campaign } from 'src/app/interfaces/datamodel/request/campaign';

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

  getAll(endpoint: String, token: string, page: any, size: any) {
    let params = "";
    if (!page && !size) {
      params = "";
    } else if (page && !size) {
      params = "?page=" + page.toString();
    } else if (!page && size) {
      params = "?size=" + size.toString();
    } else {
      params = "?page=" + page.toString() + "&size=" + size.toString();
    }
    const fullUrl = configs.BaseUri + endpoint + configs.retreiveEndpoint + params;
    return this.http.get<any>(fullUrl, {
      headers: new HttpHeaders(
        {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
        })
    })
      .pipe(
        tap(_ => console.log('fetched heroes')),
        catchError(this.handleError<any>('getHeroes', []))
      );
  }

  getAllFrecuencies(token: string, page: any, size: any, parameter: any, parameterValue: any) {
    let params = "";
    if (!page && !size) {
      params = "";
    } else if (page && !size) {
      params = "?page=" + page.toString();
    } else if (!page && size) {
      params = "?size=" + size.toString();
    } else {
      params = "?page=" + page.toString() + "&size=" + size.toString();
    }
    if (params == "") {
      params = "?" + parameter + "=" + parameterValue;
    } else {
      if (parameter) {
        params = params + "&" + parameter + "=" + parameterValue;
      }
    }
    const fullUrl = configs.BaseUri + "frecuencies" + configs.retreiveEndpoint + params;
    return this.http.get<any>(fullUrl, {
      headers: new HttpHeaders(
        {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
        })
    })
      .pipe(
        tap(_ => console.log('fetched heroes')),
        catchError(this.handleError<any>('getHeroes', []))
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

  updateCampaign(request: any, token: any) {
    const fullUrl = configs.BaseUri + "/campaigns/update";
    let raw = JSON.stringify(request);
    return this.http.put<any>(fullUrl, raw, {
      headers: new HttpHeaders(
        {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
        })
    }).pipe(
      tap(_ => console.log('fetched heroes')),
      catchError(this.handleError<any>('getHeroes', []))
    );
  }

  updateCustomer(request: any, token: any) {
    const fullUrl = configs.BaseUri + "/customers/update";
    let raw = JSON.stringify(request);
    return this.http.put<any>(fullUrl, raw, {
      headers: new HttpHeaders(
        {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
        })
    }).pipe(
      tap(_ => console.log('fetched heroes')),
      catchError(this.handleError<any>('getHeroes', []))
    );
  }

  updateUser(request: any, token: any) {
    const fullUrl = configs.BaseUri + "/users/update";
    let raw = JSON.stringify(request);
    return this.http.put<any>(fullUrl, raw, {
      headers: new HttpHeaders(
        {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
        })
    }).pipe(
      tap(_ => console.log('fetched heroes')),
      catchError(this.handleError<any>('getHeroes', []))
    );
  }

  updateFrequency(request: any, token: any) {
    const fullUrl = configs.BaseUri + "/frecuencies/update";
    let raw = JSON.stringify(request);
    return this.http.put<any>(fullUrl, raw, {
      headers: new HttpHeaders(
        {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
        })
    }).pipe(
      tap(_ => console.log('fetched heroes')),
      catchError(this.handleError<any>('getHeroes', []))
    );
  }

  deleteCampaign(id: any, token: any) {
    const fullUrl = configs.BaseUri + "campaigns/delete";
    let raw = JSON.stringify({
      "records": id,
    });
    return this.http.put<any>(fullUrl, raw, {
      headers: new HttpHeaders(
        {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
        })
    }).pipe(
      tap(_ => console.log('fetched heroes')),
      catchError(this.handleError<any>('getHeroes', []))
    );
  }

  deleteCustomer(id: any, token: any) {
    const fullUrl = configs.BaseUri + "customers/delete";
    let raw = JSON.stringify({
      "records": id,
    });
    return this.http.put<any>(fullUrl, raw, {
      headers: new HttpHeaders(
        {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
        })
    }).pipe(
      tap(_ => console.log('fetched heroes')),
      catchError(this.handleError<any>('getHeroes', []))
    );
  }

  deleteUser(id: any, token: any) {
    const fullUrl = configs.BaseUri + "users/delete";
    let raw = JSON.stringify({
      "records": id,
    });
    return this.http.put<any>(fullUrl, raw, {
      headers: new HttpHeaders(
        {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
        })
    }).pipe(
      tap(_ => console.log('fetched heroes')),
      catchError(this.handleError<any>('getHeroes', []))
    );
  }

  deleteFrequency(id: any, token: any) {
    const fullUrl = configs.BaseUri + "frecuencies/delete";
    let raw = JSON.stringify({
      "records": id,
    });
    return this.http.put<any>(fullUrl, raw, {
      headers: new HttpHeaders(
        {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
        })
    }).pipe(
      tap(_ => console.log('fetched heroes')),
      catchError(this.handleError<any>('getHeroes', []))
    );
  }
}
