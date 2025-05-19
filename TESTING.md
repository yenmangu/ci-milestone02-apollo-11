# Testing

> [!NOTE]
> Return back to the [README.md](README.md) file.

## Code Validation

### HTML
I have used the recommended [HTML W3C Validator](https://validator.w3.org) to validate all of my HTML files.


### CSS

I have used the recommended [CSS Jigsaw Validator](https://jigsaw.w3.org/css-validator) to validate all of my CSS files.

## Responsiveness

I've tested my deployed project to check for responsiveness issues.

| Page | Mobile | Tablet | Desktop | Notes |
| ---- | ------ | ------ | ------- | ----- |

## Browser Compatibility

| Page | Chrome | Firefox | Safari | Notes |
| ---- | ------ | ------- | ------ | ----- |

## Lighthouse Audit

| Page | Mobile | Desktop |
| ---- | ------ | ------- |

## Defensive Programming

Defensive programming was manually tested with the below user acceptance testing:

| Page | Expectation | Test | Result | Screenshot |
| ---- | ----------- | ---- | ------ | ---------- |

## User Story Testing

| Target | Expectation | Outcome | Screenshot |
| ------ | ----------- | ------- | ---------- |

## Bugs

### Fixed Bugs (Tracked)

[![GitHub issue custom search](https://img.shields.io/github/issues-search?query=repo%3Ayenmangu%2Fci-milestone02-apollo-11%20label%3Abug&label=bugs)](https://www.github.com/yenmangu/ci-milestone02-apollo-11/issues?q=is%3Aissue+is%3Aclosed+label%3Abug)

I've used [GitHub Issues](https://www.github.com/yenmangu/ci-milestone02-apollo-11/issues) to track and manage bugs and issues found whilst testing deployments during the development stages of my project.

All previously closed/fixed bugs can be tracked [here](https://www.github.com/yenmangu/ci-milestone02-apollo-11/issues?q=is%3Aissue+is%3Aclosed+label%3Abug).

![screenshot](documentation/bugs/gh-issues-closed.png)

### Fixed Bugs (Untracked)

> [!IMPORTANT] Note: The following bugs were dicovered and resolved during local development and did not make it into version control. They are recorded here for transparency and future reference.


| Bugs / Issue                        | Explanation                                                                                                                 | Fix                                                                                                                                                                                                 |
| ----------------------------------- | --------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| DOM type assertion / mismatch error | A Type issue arose when trying to access property of `HTMLElement` that is not available on the generic supertype `Element` | Wrote custom [`cast.js`](./src/util/cast.js) script which accepts 2 arguments: `element: Element` and `expectedType: string` and leverages JSDoc tags to assert the expected `HTMLElement` subtype. |
| `undefined` return from `getPhase`  | the [timeline.js](./src/data/timeline.js) `getPhase` method was producing `undefined`.                                      | use the value from the `AppStates` enum  as the lookup in the `.find` method, not the key                                                                                                           |



### Dev/Ops Issues



### Unfixed Bugs / Issues

[![GitHub issues](https://img.shields.io/github/issues/yenmangu/ci-milestone02-apollo-11)](https://www.github.com/yenmangu/ci-milestone02-apollo-11/issues)

Any remaining open issues can be tracked [here](https://www.github.com/yenmangu/ci-milestone02-apollo-11/issues).

![screenshot](documentation/bugs/gh-issues-open.png)

### Known Issues

| Issue | Screnshot |
| ----- | --------- |

---

> [!IMPORTANT]
> There are no remaining bugs that I am aware of, though, even after thorough testing, I cannot rule out the possibility.