import { getBundleSizes } from './lib/helpers'

const exec = require('@actions/exec')
const core = require('@actions/core')
const github = require('@actions/github')

async function run () {
  try {
    const context = github.context
    const pullRequest = context.payload.pull_request

    await exec.exec(
      'npx react-native bundle --dev false --platform ios --entry-file index.ios.js --bundle-output ios.bundle --reset-cache'
    )

    await exec.exec(
      'npx react-native bundle --dev false --platform android --entry-file index.android.js --bundle-output android.bundle --reset-cache'
    )

    const outputSizes = await getBundleSizes()
    const token = core.getInput('token')

    const octokit = github.getOctokit(token)

    const description = `Android Bundle Size - ${outputSizes.android} | iOS Bundle Size - ${outputSizes.ios}`

    const owner = pullRequest.head.repo.owner.login
    const repo = pullRequest.head.repo.name
    const sha = pullRequest.head.sha
    const state = 'success'

    await octokit.repos.createCommitStatus({
      description,
      owner,
      repo,
      sha,
      state,
      context: 'React Native Bundle Sizes'
    })
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()
