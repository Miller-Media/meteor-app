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
4. Duplicate this repo and clone the duplicate - `$ git clone https://github.com/Miller-Media/{your-duplicate-repo}.git`

Run App Locally
==========

Install requirements and run the app locally with the following steps:

5. `$ cd ./app`  
6. `$ meteor npm install` (install required `npm` packages)
7. `$ meteor npm run cordova-setup` (install required `cordova` plugins)
8. `$ meteor npm run atmosphere-setup` (install required `atmosphere` packages)
9. `$ meteor --settings {settings-file}.json` (e.g. `settings-staging.json`)

Add Platforms
==========

In order to generate the appropriate source projects to run the app on Android and/or iOS, the following commands must be ran, and the pre-requisites met.

`$ meteor add-platform android`   
`$ meteor add-platform ios`

The setup of the pre-requisites for building on these platforms is also documented here: https://guide.meteor.com/mobile.html#installing-prerequisites

When installing the Java SDK, a very specific version is needed, which is located here:
https://drive.google.com/open?id=1B7_oWuS8XFm9_lm38i2UJ1joc2Ix3glW

Building, Deploying, & Releasing App
==========

```
$ meteor build ../build --server=https://memberapp.trimhealthymama.com
```

```
$ cd ./deploy/{staging or production}
$ mup deploy
```

```
$ cd ../releases/android
$ cp ../../build/android/project/app/build/outputs/apk/release/app-release-unsigned.apk x.x.x-build.apk
$ jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 x.x.x-build.apk thm-membership
$ $ANDROID_HOME/build-tools/28.0.3/zipalign 4 x.x.x-build.apk x.x.x-release.apk
```

See: https://millermedia.atlassian.net/wiki/spaces/ENG/pages/638255118/Building+Deploying

Frameworks
==========

**CSS Animations**  
Use the animation classes for quick and easy animations.  
Animate.css: https://animate.style/

**Flex Layout CSS**  
Use the flex utility classes for easy screen layout.  
SuitCSS: https://github.com/suitcss/utils-flex

**UI Components**  
Use the UI components for easy UI widgets.  
Onsen UI: https://onsen.io/v2/api/react/  
Ionic: https://ionicframework.com/docs/components  