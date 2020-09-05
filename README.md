![Web Desktop Environment](./assets/Logo.png)
<p align="center">
  A cross-platform desktop-environment with a web interface
</p>

## What is a Web Desktop Environment
just like any other desktop environment it is just a visual interface for your computer.  
the twist with this desktop-environment is that "web-desktop-environment" visual interface runs on the web with his server running localy on your computer

## Use Cases
 - interface for a cloud servers (can possibly be used as a replacemnt for control panel)
 - interface for small/low power computers like the Raspberry Pi zero
 - interface for controlling your computer over long distance 

## The technologies behind "web-desktop-devironment"
both the server and are build using a react framework called ["react-fullstack"](https://github.com/shmuelhizmi/react-fullstack/tree/master/packages/fullstack) which is a framework for building fast react applications that rely a tight connection between the client and the server.

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
