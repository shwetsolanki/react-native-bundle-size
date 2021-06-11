import {
  compressBundleFolders,
  getBundleScript,
  getBundleSizes,
  getFolderPath
} from './lib/helpers'

const exec = require('@actions/exec')
const core = require('@actions/core')
const github = require('@actions/github')

const run = async () => {
  try {
    const context = github.context
    const pullRequest = context.payload.pull_request
    const isHermesEnabled = core.getInput('hermes-enabled') === 'true'
    const includeSourceMaps = core.getInput('include-source-maps') === 'true'
    const includeAssets = core.getInput('include-assets') === 'true'

    const androidBundleScript = await getBundleScript(
      'android',
      core.getInput('android-entry-file'),
      includeAssets,
      includeSourceMaps
    )
    await exec.exec(androidBundleScript)

    if (isHermesEnabled) {
      const folderPath = getFolderPath('android')
      let hermesBundleScript = 'node_modules/hermes-engine/osx-bin/hermesc -emit-binary -out ' + folderPath + '/main.jsbundle.hbc ' + folderPath + '/main.jsbundle'
      if (includeSourceMaps) {
        hermesBundleScript += ' -output-source-map'
      }
      hermesBundleScript += ' -w'
      await exec.exec(hermesBundleScript)
      await exec.exec(`cp ${folderPath}/main.jsbundle.hbc ${folderPath}/main.jsbundle`)
      await exec.exec(`rm ${folderPath}/main.jsbundle.hbc`)
    }

    const iosBundleScript = await getBundleScript(
      'ios',
      core.getInput('ios-entry-file'),
      includeAssets,
      includeSourceMaps
    )
    await exec.exec(iosBundleScript)

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
