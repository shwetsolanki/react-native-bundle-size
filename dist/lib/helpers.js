"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.compressBundleFolders = exports.getBundleScript = exports.getBundleSizes = void 0;
const pretty_bytes_1 = __importDefault(require("pretty-bytes"));
const fs_1 = __importDefault(require("fs"));
const adm_zip_1 = __importDefault(require("adm-zip"));
const io = require('@actions/io');
const getBundleSizes = async () => {
    const iosData = fs_1.default.readFileSync('iosbundle.zip');
    const androidData = fs_1.default.readFileSync('androidbundle.zip');
    return {
        ios: pretty_bytes_1.default(Buffer.byteLength(iosData)),
        android: pretty_bytes_1.default(Buffer.byteLength(androidData))
    };
};
exports.getBundleSizes = getBundleSizes;
const getBundleScript = async (platform, entryFile, includeAssets, includeSourceMaps) => {
    const folderPath = platform + 'bundle';
    await io.mkdirP(folderPath);
    let bundleScript = `npx react-native bundle --dev false --platform ${platform} --entry-file ${entryFile} --bundle-output ${folderPath}/main.jsbundle --reset-cache`;
    if (includeAssets) {
        bundleScript += ` --assets-dest ${folderPath}`;
    }
    if (includeSourceMaps) {
        bundleScript += ` --sourcemap-output ${folderPath}/main.jsbundle.map`;
    }
    return bundleScript;
};
exports.getBundleScript = getBundleScript;
const compressBundleFolders = () => {
    compressFolder('iosbundle');
    compressFolder('androidbundle');
};
exports.compressBundleFolders = compressBundleFolders;
const compressFolder = (folderName) => {
    const zip = new adm_zip_1.default();
    zip.addLocalFolder(folderName);
    zip.writeZip(folderName + '.zip');
};
//# sourceMappingURL=helpers.js.map