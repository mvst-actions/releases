const core = require('@actions/core');
const {getOctokit, context} = require('@actions/github');

const github = getOctokit(process.env.GITHUB_TOKEN)
const { owner: currentOwner, repo: currentRepo } = context.repo;

const getLatestReleaseTag = () => {
  const latestRelease = github.repos.getLatestRelease({
    owner: currentOwner,
    repo: currentRepo
  });
  
  console.log(latestRelease);
}

try {
  const latestReleaseTag = getLatestReleaseTag();
} catch (error) {
  core.setFailed(error.message);
}
