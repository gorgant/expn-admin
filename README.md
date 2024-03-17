# ExpnAdmin

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 17.1.2.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

1. Run `firebase use production` or `firebase use development` to select the appropriate Firebase workspace
2. Run `FIREBASE_FRAMEWORKS_BUILD_TARGET=production firebase deploy` or `FIREBASE_FRAMEWORKS_BUILD_TARGET=development firebase deploy` depending on which workspace is active, which will build the app with the appropriate configuration. 

Note that, currently, only running `firebase deploy` will always default to building the app using the production environment config, which is problematic for the development build. This may get resolved in the future.

The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.
