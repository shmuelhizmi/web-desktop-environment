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

# Contribute

if you have any new feature or existing feature you wnat to create or improve fell free to open a Pull Request

# Features

## Desktop
:heavy_check_mark: full web based desktop  
:heavy_check_mark: Themes and custom themes  
:heavy_check_mark: PWA app  
:heavy_check_mark: app windows can be open as in app windows or as native separated windows  

## Apps
:heavy_check_mark: Terminal  
:heavy_check_mark: Explorer  
:heavy_check_mark: Settings / System info  

# To do

## Desktop
:comet: more animations :)  
:comet: white theme color ajustements  

## Apps
:comet: Notepad  
:comet: Task manager  
:comet: Applications store ( will take quite a long time to implement )  

## Run

**quick run**
1. `npm i`
2. `npm start`

## Advanced run

**install packages**
1. `npm i -g lerna`
2. `lerna bootstrap`

**run flow (server)**
1. `cd packages/flow`
2. `npm start`


**run views (web server)**
1. `cd packages/views`
2. `npm start`
