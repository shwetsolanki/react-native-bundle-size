import { getBundleSizes } from './lib/helpers'

const exec = require('@actions/exec')
const core = require('@actions/core')
const github = require('@actions/github')

async function run () {
  try {
    const context = github.context
    const pullRequest = context.payload.pull_request

    if (pullRequest) {
      await exec.exec(
        'npx react-native bundle --entry-file index.ios.js --bundle-output ios.bundle'
      )

      await exec.exec(
        'npx react-native bundle --entry-file index.android.js --bundle-output android.bundle'
      )

      const outputSizes = await getBundleSizes()
      const token = core.getInput('token')

      const octokit = github.getOctokit(token)

      // on pull request commit push add comment to pull request
      const result = `Android Bundle Size - ${outputSizes.android} \niOS Bundle Size - ${outputSizes.ios}`
      octokit.issues.createComment(
        Object.assign(Object.assign({}, context.repo), {
          issue_number: pullRequest.number,
          body: result
        })
      )
    }
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()
