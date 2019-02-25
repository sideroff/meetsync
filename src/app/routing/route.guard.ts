import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';

import apiKey from '../config/apiKeys.js'
import { reject } from 'q';

@Injectable({
  providedIn: 'root'
})
export class RouteGuard implements CanActivate {

  private areLibrariesLoaded: Boolean = false;
  // <script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places">
  private libraryResolveFunctionName = 'libraryResolveFunction';
  private libraries: string[] = [
    `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&callback=${this.libraryResolveFunctionName + '0'}`,
  ];

  constructor(private router: Router) { }

  canActivate(): Promise<boolean> | boolean {
    if (this.areLibrariesLoaded) return true;

    let promises: Promise<any>[] = [];

    for (let librarySrcIndex in this.libraries) {
      promises.push(new Promise((resolve, reject) => {
        const script = window.document.createElement('script');
        script.type = 'text/javascript';
        script.async = true;
        script.defer = true;
        script.src = this.libraries[librarySrcIndex];

        window[this.libraryResolveFunctionName + librarySrcIndex] = () => resolve();

        script.onerror = (error: Event) => { reject(error); };

        window.document.body.appendChild(script);
      }))
    }

    return new Promise((resolve, reject) => {
      Promise.all(promises)
        .then(() => {
          this.areLibrariesLoaded = true;
          this.cleanGlobalCallbacks();
          resolve(true)
        })
        .catch(error => {
          this.router.navigateByUrl('/not-found')
          reject(error)
        })
    })
  }

  cleanGlobalCallbacks() {
    for (let index of this.libraries) {
      delete window[this.libraryResolveFunctionName + index];
    }
  }
}
