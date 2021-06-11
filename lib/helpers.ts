import prettyBytes from 'pretty-bytes'
import fs from 'fs'
import AdmZip from 'adm-zip'
const io = require('@actions/io')

export const getBundleSizes = async () => {
  const iosData = fs.readFileSync('iosbundle.zip')
  const androidData = fs.readFileSync('androidbundle.zip')

  return {
    ios: prettyBytes(Buffer.byteLength(iosData)),
    android: prettyBytes(Buffer.byteLength(androidData))
  }
}

export const getFolderPath = (platform: 'ios' | 'android') => platform + 'bundle'

export const getBundleScript = async (
  platform: 'ios' | 'android',
  entryFile: string,
  includeAssets: boolean,
  includeSourceMaps: boolean
) => {
  const folderPath = getFolderPath(platform)
  await io.mkdirP(folderPath)

  let bundleScript = `npx react-native bundle --dev false --platform ${platform} --entry-file ${entryFile} --bundle-output ${folderPath}/main.jsbundle --reset-cache`
  if (includeAssets) {
    bundleScript += ` --assets-dest ${folderPath}`
  }
  if (includeSourceMaps) {
    bundleScript += ` --sourcemap-output ${folderPath}/main.jsbundle.map`
  }
  return bundleScript
}

export const compressBundleFolders = () => {
  compressFolder('iosbundle')
  compressFolder('androidbundle')
}

const compressFolder = (folderName: string) => {
  const zip = new AdmZip()
  zip.addLocalFolder(folderName)
  zip.writeZip(folderName + '.zip')
}
