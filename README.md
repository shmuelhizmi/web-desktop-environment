# Web Desktop Environment
a web/nodejs-based cross-platform desktop environment

## What is a Web Desktop Environment
like any other desktop environemnt it's just a visual interface for your computer.
the twist with this one is that this one visual interface runs on the web (react) with his server (node) running on your computer

## Use Cases
 - interface for a cloud server (can possibly be used as a replacemnt for control panel)
 - interface for small computers like the Raspberry Pi zero
 - interface for controlling your computer over long distance 


## Screenshots

![transparent](https://i.ibb.co/0tT3LW0/Screenshot-from-2020-07-13-21-29-28.png)
![dark theme](https://i.ibb.co/TbsHdxm/Screenshot-from-2020-07-13-21-28-51.png)
![light theme](https://i.ibb.co/m0wjDkB/Screenshot-from-2020-07-13-21-29-50.png)

## Contribute

if you have any new feature or existing feature you wnat to create or improve fell free to open a Pull Request

## Run

**install packages**
1. `npm i -g lerna`
2. `lerna bootstrap`

**run flow (server)**
1. `cd packages/flow`
2. `npm start`


**run view (web server)**
1. `cd packages/views`
2. `npm start`
