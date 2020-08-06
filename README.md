# Meteor App Repo
=========================

Prerequisites
==========

## OSX/Linux
1. Install Meteor - `$ curl https://install.meteor.com/ | sh`
2. Install Meteor (specific version) - `$ curl https://install.meteor.com/?version=1.8.1 | sh`

## Windows 
1. Install Chocolatey - https://chocolatey.org/install
2. Install Meteor - `$ choco install meteor`  

## Both

3. Install Meteor Up - `$ meteor npm install -g mup`  
4. Fork this repo and clone it
5. Create a new app - `$ cd {repository-name} && meteor create app --react`

Run App Locally
==========

After the repository is cloned and the app is created, the app can be run locally and viewed in a local web browser.

`$ cd ./app`  
`$ meteor`

Add Platforms
==========

In order to generate the appropriate source projects to run the app on Android and/or iOS, the following commands must be ran, and the pre-requisites met.

`$ meteor add-platform android`   
`$ meteor add-platform ios`

The setup of the pre-requisites for building on these platforms is also documented here: https://guide.meteor.com/mobile.html#installing-prerequisites

When installing the Java SDK, a very specific version is needed, which is located here:
https://drive.google.com/open?id=1B7_oWuS8XFm9_lm38i2UJ1joc2Ix3glW

