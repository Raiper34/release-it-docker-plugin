[![npm version](https://badge.fury.io/js/release-it-docker-plugin.svg)](https://badge.fury.io/js/release-it-docker-plugin)
![npm bundle size](https://img.shields.io/bundlephobia/min/release-it-docker-plugin)
![NPM](https://img.shields.io/npm/l/release-it-docker-plugin)
[![npm](https://img.shields.io/npm/dt/release-it-docker-plugin)](https://badge.fury.io/js/release-it-docker-plugin)
[![npm](https://img.shields.io/npm/dm/release-it-docker-plugin)](https://badge.fury.io/js/release-it-docker-plugin)
[![npm](https://img.shields.io/npm/dw/release-it-docker-plugin)](https://badge.fury.io/js/release-it-docker-plugin)
[![](https://data.jsdelivr.com/v1/package/npm/release-it-docker-plugin/badge?style=rounded)](https://www.jsdelivr.com/package/npm/release-it-docker-plugin)
[![GitHub Repo stars](https://img.shields.io/github/stars/raiper34/release-it-docker-plugin)](https://github.com/Raiper34/release-it-docker-plugin)

# Release It! 🚀 - Docker plugin

Plugin to ability build docker images and push to docker hub in release-it workflow.

### Content
- [🚀 Instalation](#-instalation)
- [💻 Usage](#-usage)
  - [Options](#options)
- [📖 License](#-license)

# 🚀 Instalation

Install library using npm:
```shell
npm install release-it-docker-plugin --save-dev
```

# 💻 Usage
Use the plugin in `.release-it.json` as follows: 
```json
{
  "$schema": "https://unpkg.com/release-it/schema/release-it.json",
  ...
  "plugins": {
    ...
    "release-it-docker-plugin": {
      "build": true,
      "push": true,
      "latestTag": true,
      "imageName": "<YOUR_IMAGE_NAME>"
    }
  }
}
```

## Options
The plugin can be configured with the following options:

| Name      | Default value | Description                                      |
|-----------|---------------|--------------------------------------------------|
| build     | false         | if plugin should build docker image              |
| push      | false         | if plugin should push docker image to docker hub |
| latestTag | false         | if also `latest` tag should be built and pushed  |
| imageName | undefined     | name of docker image to build and push           |

# 📖 License
MIT