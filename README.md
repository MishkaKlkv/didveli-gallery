# Introduction

This offline app for storing data about clients and booking in hotel. With it you can: 
- add client info
- add booking for existing clients
- add room info
- edit company info and app logo
- create catalog of hotel services and add it to active bookings
- print invoice and calculate client's charges

Just download `didveli.installer.exe` from
https://github.com/MishkaKlkv/didveli-gallery/releases and try it.
For correct work first of all fill company info section

Thanks to kpmy (https://github.com/kpmy) for help with electron build!

For this app I used a electron-angular template by Maxime GRIS:
https://github.com/maximegris/angular-electron

## Getting Started

*Clone this repository locally:*

``` bash
git clone https://github.com/MishkaKlkv/didveli-gallery.git
```

*Install dependencies with npm (used by Electron renderer process):*

``` bash
npm install
```

If you want to generate Angular components with Angular-cli , you **MUST** install `@angular/cli` in npm global context.
Please follow [Angular-cli documentation](https://github.com/angular/angular-cli) if you had installed a previous version of `angular-cli`.

``` bash
npm install -g @angular/cli
```

*Install NodeJS dependencies with npm (used by Electron main process):*

``` bash
cd app/
npm install
```

Why two package.json ? This project follow [Electron Builder two package.json structure](https://www.electron.build/tutorials/two-package-structure) in order to optimize final bundle and be still able to use Angular `ng add` feature.

## To build for development

- **in a terminal window** -> npm start

## Project structure

| Folder | Description                                      |
|--------|--------------------------------------------------|
| app    | Electron main process folder (NodeJS)            |
| src    | Electron renderer process folder (Web / Angular) |
