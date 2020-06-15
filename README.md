# [TypeScript](http://www.typescriptlang.org/) [GitHub](https://github.com) Tools

Tools used for setting up a `repository`.

## [API Docs](./docs/index.md)

[![Dependency Status][daviddm-image]][daviddm-url]
[![License][license-image]][license-url]
[![Issues][issues-image]][issues-url]
[![Code maintainability][code-maintainability-image]][code-maintainability-url] [![Code issues][code-issues-image]][code-issues-url] [![Code Technical Debt][code-tech-debt-image]][code-tech-debt-url]

[![Main Language][language-image]][code-metric-url] [![Languages][languages-image]][code-metric-url] [![Code Size][code-size-image]][code-metric-url] [![Repo-Size][repo-size-image]][code-metric-url]

## Features

- TypeScript
- Jest Snapshot/Unit Tests with Code Coverage
- API Docs Generation
- GitHub CI Integration (feature, development, master, release)
- Travis Integration
- CircleCI Integration
- AppVeyor Integration
- Code Quality via Code Climate

| GitHub                                                           | Travis                                                       | CircleCI                                                         | AppVeyor                                                         | Coveralls                                                                  |                                                                              |
| ---------------------------------------------------------------- | ------------------------------------------------------------ | ---------------------------------------------------------------- | ---------------------------------------------------------------- | -------------------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| [![ReleaseMaster Build][release-build-image]][release-url]       |                                                              |                                                                  |                                                                  |                                                                            | [![Release][release-image]][release-url]                                     |
| [![Master Build][master-build-image]][master-url]                | [![Master Build][travis-master-image]][travis-url]           | [![Master Build][circleci-master-image]][circleci-url]           | [![Master Build][appveyor-master-image]][appveyor-url]           | [![Master Coverage][master-coveralls-image]][master-coveralls-url]         | [![Master Version][master-version-image]][master-version-url]                |
| [![Development Build][development-build-image]][development-url] | [![Development Build][travis-development-image]][travis-url] | [![Development Build][circleci-development-image]][circleci-url] | [![Development Build][appveyor-development-image]][appveyor-url] | [![Test Coverage][development-coveralls-image]][development-coveralls-url] | [![Development Version][development-version-image]][development-version-url] |

### Clone repository

```
git clone https://github.com/gregoranders/ts-github-tools
```

### Install dependencies

```
npm install
```

### Build

```
npm run build
```

### Testing

#### Test using [Jest](https://jestjs.io/)

```
npm test
```

### Code Climate Checks [docker required](docs/CODECLIMATE.md)

```
npm run codeclimate
```

### Run

```
npm start
```

### Clear

```
npm run clear
```

[release-url]: https://github.com/gregoranders/ts-github-tools/releases
[master-url]: https://github.com/gregoranders/ts-github-tools/tree/master
[development-url]: https://github.com/gregoranders/ts-github-tools/tree/development
[repository-url]: https://github.com/gregoranders/ts-github-tools
[code-metric-url]: https://github.com/gregoranders/ts-github-tools/search?l=TypeScript
[travis-url]: https://travis-ci.org/gregoranders/ts-github-tools
[travis-image]: https://travis-ci.org/gregoranders/ts-github-tools.svg?branch=master
[daviddm-url]: https://david-dm.org/gregoranders/ts-github-tools
[daviddm-image]: https://david-dm.org/gregoranders/ts-github-tools.svg?branch=master
[license-url]: https://github.com/gregoranders/ts-github-tools/blob/master/LICENSE
[license-image]: https://img.shields.io/github/license/gregoranders/ts-github-tools.svg
[master-version-url]: https://github.com/gregoranders/ts-github-tools/blob/master/package.json
[master-version-image]: https://img.shields.io/github/package-json/v/gregoranders/ts-github-tools/master
[development-version-url]: https://github.com/gregoranders/ts-github-tools/blob/development/package.json
[development-version-image]: https://img.shields.io/github/package-json/v/gregoranders/ts-github-tools/development
[issues-url]: https://github.com/gregoranders/ts-github-tools/issues
[issues-image]: https://img.shields.io/github/issues-raw/gregoranders/ts-github-tools.svg
[release-image]: https://img.shields.io/github/release/gregoranders/ts-github-tools
[release-build-image]: https://github.com/gregoranders/ts-github-tools/workflows/Release%20CI/badge.svg
[master-build-image]: https://github.com/gregoranders/ts-github-tools/workflows/Master%20CI/badge.svg
[development-build-image]: https://github.com/gregoranders/ts-github-tools/workflows/Development%20CI/badge.svg
[master-coveralls-url]: https://coveralls.io/github/gregoranders/ts-github-tools?branch=master
[master-coveralls-image]: https://img.shields.io/coveralls/github/gregoranders/ts-github-tools/master
[development-coveralls-image]: https://img.shields.io/coveralls/github/gregoranders/ts-github-tools/development
[development-coveralls-url]: https://coveralls.io/github/gregoranders/ts-github-tools?branch=development
[code-maintainability-url]: https://codeclimate.com/github/gregoranders/ts-github-tools/maintainability
[code-maintainability-image]: https://img.shields.io/codeclimate/maintainability/gregoranders/ts-github-tools
[code-issues-url]: https://codeclimate.com/github/gregoranders/ts-github-tools/maintainability
[code-issues-image]: https://img.shields.io/codeclimate/issues/gregoranders/ts-github-tools
[code-tech-debt-url]: https://codeclimate.com/github/gregoranders/ts-github-tools/maintainability
[code-tech-debt-image]: https://img.shields.io/codeclimate/tech-debt/gregoranders/ts-github-tools
[language-image]: https://img.shields.io/github/languages/top/gregoranders/ts-github-tools
[languages-image]: https://img.shields.io/github/languages/count/gregoranders/ts-github-tools
[code-size-image]: https://img.shields.io/github/languages/code-size/gregoranders/ts-github-tools
[repo-size-image]: https://img.shields.io/github/repo-size/gregoranders/ts-github-tools
[travis-url]: https://travis-ci.org/gregoranders/ts-github-tools
[travis-master-image]: https://travis-ci.org/gregoranders/ts-github-tools.svg?branch=master
[travis-development-image]: https://travis-ci.org/gregoranders/ts-github-tools.svg?branch=development
[circleci-url]: https://app.circleci.com/pipelines/github/gregoranders/ts-github-tools
[circleci-master-image]: https://img.shields.io/circleci/build/github/gregoranders/ts-github-tools/master
[circleci-development-image]: https://img.shields.io/circleci/build/github/gregoranders/ts-github-tools/development
[appveyor-url]: https://ci.appveyor.com/project/gregoranders/ts-github-tools
[appveyor-master-image]: https://img.shields.io/appveyor/build/gregoranders/ts-github-tools/master
[appveyor-development-image]: https://img.shields.io/appveyor/build/gregoranders/ts-github-tools/development
