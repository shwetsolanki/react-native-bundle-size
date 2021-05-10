import prettyBytes from 'pretty-bytes'
import fs from 'fs'

export const getBundleSizes = async () => {
  const iosData = fs.readFileSync('ios.bundle')
  const androidData = fs.readFileSync('android.bundle')

  return {
    ios: prettyBytes(Buffer.byteLength(iosData)),
    android: prettyBytes(Buffer.byteLength(androidData))
  }
}
