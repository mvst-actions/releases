const core = require("@actions/core");
const { getOctokit, context } = require("@actions/github");

const github = getOctokit(process.env.GITHUB_TOKEN);
const { owner, repo } = context.repo;

const getLatestReleaseTag = async () => {
  try {
    const releases = await github.rest.repos.listReleases({
      owner,
      repo,
    });

    const latestReleaseTag = releases.data?.[0]?.tag_name;

    return latestReleaseTag;
  } catch {}
};

const getLatestTag = async () => {
  const tags = await github.rest.repos.listTags({
    owner,
    repo,
  });

  const latestTag = tags.data[0].name;

  return latestTag;
};

const getReleaseNotes = async (tag_name, previous_tag_name) => {
  const generatedNotes = await github.rest.repos.generateReleaseNotes({
    owner,
    repo,
    tag_name,
    previous_tag_name,
  });

  return generatedNotes.data;
};

const createRelease = async () => {
  const latestReleaseTag = await getLatestReleaseTag();
  const latestTag = await getLatestTag();

  const releaseNotes = await getReleaseNotes(latestTag, latestReleaseTag);

  await github.rest.repos.createRelease({
    owner,
    repo,
    tag_name: latestTag,
    name: releaseNotes.name,
    body: releaseNotes.body,
    prerelease: true,
  });
};

try {
  createRelease();
} catch (error) {
  core.setFailed(error.message);
}
