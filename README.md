# GitHub Actions: `react-native-bundle-size`

This GitHub Action allows you to keep a check on the React Native Bundle Size for both iOS and Android apps.

## Usage

The following shows how to publish the react native bundle size on the PR request as commit status

```yml
name: "react-native-pull-request"
on: [pull-request]

jobs:
  test_something:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2
    - uses: shwetsolanki/react-native-bundle-size@v1
      with:
        token: ${{ secrets.GITHUB_TOKEN }}
```

## Inputs

### `token`

**Required** Your `GITHUB_TOKEN`

## RoadMap

* Adds comparison with bundle size from last Appstore / Playstore released build
* Adds color code formatting for better readability, if possible
