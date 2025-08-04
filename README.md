# Apollo 11 Simulation

## Overview

## Glossary

| Term                   | Definition                                                                                                                                                                                                                         |
| ---------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **PDI**                | *Powered Descent Initiation* — The moment the Lunar Module fires its descent engine to begin the landing phase, transitioning from orbit to surface approach. For Apollo 11, this occurred at Ground Elapsed Time (GET) 102:33:05. |
| **GET**                | *Ground Elapsed Time* — Mission time measured from the moment of launch (T+0), used to timestamp events in the mission.                                                                                                            |
| **AGC**                | *Apollo Guidance Computer* — The on-board computer used to control spacecraft navigation, running programs such as P63 and P64 during descent.                                                                                     |
| **DSKY**               | *Display and Keyboard* (pronounced “Dis-key”) — The interface astronauts used to interact with the AGC using numeric codes (verbs and nouns).                                                                                      |
| **1201 / 1202 Alarms** | Program alarms triggered by the AGC due to memory overload during descent. The system recovered and continued functioning, but they briefly caused uncertainty about whether the landing should be aborted.                        |

## Architcture

> Note:

### Class Diagrams for gameController

### State Diagrams



## Features

### Existing Features

#### User Facing Features

Linear interpolation of telemetry
Time controls (fast forward, pause, resume)


#### Development Features

Custom Event Emitter
Custom event watchers with default no-ops


### Future Features
Animation??

## Agile Development Process

### GitHub Projects

### GitHub Issues

### MoSCoW Prioritisation

## Testing
> [!NOTE]
> For all testing please refer to the [TESTING.md](TESTING.md) file.

## Deployment

The site was deployed to GitHub Pages. The steps to deploy are as follows:

- In the [GitHub repository](https://www.github.com/yenmangu/ci-milestone02-apollo-11), navigate to the "Settings" tab.
- In Settings, click on the "Pages" link from the menu on the left.
- From the "Build and deployment" section, click the drop-down called "Branch", and select the **main** branch, then click "Save".
- The page will be automatically refreshed with a detailed message display to indicate the successful deployment.
- Allow up to 5 minutes for the site to fully deploy.

The live link can be found on [GitHub Pages](https://yenmangu.github.io/ci-momentum).

### GitHub Pages

### Local Development

> [!IMPORTANT]
> Whilst all of the code is open source, currently the API is ***not*** public, and is deployed on my own private cloud infrastructure. The API has strict access rules which ***only*** allow access from the deployed origin and my own local development environment. Should you wish to clone your own version, please contact me via GitHub to arrange API access.

This project can be cloned or forked in order to make a local copy on your own system.

#### Cloning

#### Forking

### Local VS Deployment

There are no remaining major differences between the local version when compared to the deployed version online.

## Credits

links to add to write up:
https://fontsinuse.com/uses/56966/nasa-apollo-11-mission
https://fontsinuse.com/typefaces/4496/spartan
https://medium.com/@dovid11564/using-css-animations-to-mimic-the-look-of-a-crt-monitor-3919de3318e2
[AGC references](https://tcf.pages.tcnj.edu/files/2013/12/Apollo-Guidance-Computer.pdf)
[Don Eyles Blog](https://www.doneyles.com/LM/Tales.html)

EventEmitter architecture for the [EventEmitter]('./src/event/eventEmitter.js) -
https://javascript.plainenglish.io/building-a-simple-event-emitter-in-javascript-f82f68c214ad

Nasa Archives - [Apollo Operations Handbook](https://ia600205.us.archive.org/27/items/nasa_techdoc_19730061045/19730061045.pdf)

[Apollo 11 Guidance And Navigationby AC Electronics Division, General Motors Corporation, Milwaukee, Wisconsin](https://www.ibiblio.org/apollo/Documents/AcElectronicsApollo11.pdf) - A detailed description of the configuration and programming of the
Apollo 11 guidance computers (AGCs). The description includes COLOSSUS
2A, used in the Command Module, and LUMINARY 1A, used in the Lunar
Module.

Linear interpolation functions for the [telemetry]('./src/telemetry/telemetryController.js) - [Trys Mudford blog](https://www.trysmudford.com/blog/linear-interpolation-functions/)


### Content

- Template code for the navbar taken from [Bootstrap](https://getbootstrap.com/docs/5.3/components/navbar/#nav) and heavily modified to suit the site's needs.
-



### Media

#### Apollo Media

| Media               | Source     |
| ------------------- | ---------- |
| All Apollo 11 audio | [Source]() |
|                     |            |

### Acknowledgements

