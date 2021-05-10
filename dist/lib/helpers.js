"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBundleSizes = void 0;
const pretty_bytes_1 = __importDefault(require("pretty-bytes"));
const fs_1 = __importDefault(require("fs"));
const getBundleSizes = async () => {
    const iosData = fs_1.default.readFileSync('ios.bundle');
    const androidData = fs_1.default.readFileSync('android.bundle');
    return {
        ios: pretty_bytes_1.default(Buffer.byteLength(iosData)),
        android: pretty_bytes_1.default(Buffer.byteLength(androidData))
    };
};
exports.getBundleSizes = getBundleSizes;
//# sourceMappingURL=helpers.js.map