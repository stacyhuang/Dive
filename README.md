# Dive
 [http://getdiveapp.herokuapp.com](http://getdiveapp.herokuapp.com)

Dive is a mobile application that provides customized dive bar and restaurant recommendations for users


## Table of Contents

1. [Team](#team)
1. [Development](#development)
    1. [Installing Dependencies](#installing-dependencies)
    1. [Get Started:](#get-started)
1. [Tech Stack](#tech-stack)
1. [Contributing](#contributing)

## Team

  - __Product Owner__: Bryan Liu
  - __Scrum Master__: Jack McDevitt
  - __Development Team Members__: John Paulino, Stacy Huang

## Development

### Installing Dependencies

From within the root directory:
```sh
npm install
```

From within the public directory:

```sh
npm install
```

### Get Started:

```sh
//Adding OS platform to ionic and cordova whitelist plugin
cordova platform add <ios / android>
ionic plugin add https://github.com/apache/cordova-plugin-whitelist.git

//for ios specifically
ionic build ios

//for android specifically
ionic run android

ionic serve
//to run in browser
ionic emulate
//to run in emulator
```

## Tech Stack

- Node.js / Express
- Redis
- AngularJS
- Ionic
- Cordova
- ion-sim


## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for contribution guidelines.
