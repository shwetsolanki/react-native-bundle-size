const exec = require("@actions/exec");
const core = require("@actions/core");
const github = require("@actions/github");

const humanFileSize = (size: number) => {
  var i = Math.floor(Math.log(size) / Math.log(1024));
  return (
    (size / Math.pow(1024, i)).toFixed(2) +
    " " +
    ["B", "kB", "MB", "GB", "TB"][i]
  );
};

async function run() {
  try {
    await exec.exec(
      "npx react-native bundle --entry-file index.ios.js --bundle-output ios.bundle"
    );

    await exec.exec(
      "npx react-native bundle --entry-file index.android.js --bundle-output android.bundle"
    );

    let output = "";
    let error = "";
    const options: any = {};
    options.listeners = {
      stdout: (data: Buffer) => {
        output += data.toString();
      },
      stderr: (data: Buffer) => {
        error += data.toString();
      },
    };
    await exec.exec("ls -l ios.bundle | awk '{print $5}'", options);
    const iosOutput = output;

    output = "";
    await exec.exec("ls -l android.bundle | awk '{print $5}'", options);
    const androidOutput = output;

    if (iosOutput != "" && androidOutput != "") {
      const iosBundleSize = humanFileSize(parseInt(iosOutput, 10));
      const androidBundleSize = humanFileSize(parseInt(androidOutput, 10));
      const [
        gitHubRepoOwner,
        gitHubRepoName,
      ] = process.env.GITHUB_REPOSITORY.split("/");
      const gitHubSha = process.env.GITHUB_SHA;
      const gitHubToken = core.getInput("github-token");

      const octokit = new github.GitHub(gitHubToken);

      octokit.checks.create({
        owner: gitHubRepoOwner,
        repo: gitHubRepoName,
        name: "React Native Bundle Size",
        head_sha: gitHubSha,
        status: "completed",
        conclusion: "success",
        output: {
          title: "React Native Bundle Size",
          summary: `Android Bundle Size - ${androidBundleSize} \niOS Bundle Size - ${iosBundleSize}`,
        },
      });

      core.setOutput("time", new Date().toTimeString());
    } else {
      core.setFailed();
    }
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
