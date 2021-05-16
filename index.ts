import {
  compressBundleFolders,
  getBundleScript,
  getBundleSizes
} from './lib/helpers'

const exec = require('@actions/exec')
const core = require('@actions/core')
const github = require('@actions/github')

const run = async () => {
  try {
    const context = github.context
    const pullRequest = context.payload.pull_request

    const iosBundleScript = await getBundleScript(
      'ios',
      core.getInput('ios-entry-file'),
      core.getInput('include-assets') === 'true',
      core.getInput('include-source-maps') === 'true'
    )
    await exec.exec(iosBundleScript)

    const androidBundleScript = await getBundleScript(
      'android',
      core.getInput('android-entry-file'),
      core.getInput('include-assets') === 'true',
      core.getInput('include-source-maps') === 'true'
    )
    await exec.exec(androidBundleScript)
    compressBundleFolders()
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
