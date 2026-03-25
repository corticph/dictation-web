export default async function ({ github, context, releaseOnly }) {
  const tag = context.ref.replace("refs/tags/", "");

  // find latest release before this one
  const { data: releases } = await github.rest.repos.listReleases({
    owner: context.repo.owner,
    per_page: 30,
    repo: context.repo.repo,
  });

  const previous = releases.find(
    (r) => r.tag_name !== tag && (!releaseOnly || r.prerelease === false),
  );

  let compare;
  if (previous) {
    compare = await github.rest.repos.compareCommits({
      base: previous.tag_name,
      head: tag,
      owner: context.repo.owner,
      repo: context.repo.repo,
    });
  } else {
    // first release → just get commits
    compare = await github.rest.repos.listCommits({
      owner: context.repo.owner,
      per_page: 100,
      repo: context.repo.repo,
      sha: tag,
    });
  }

  // extract merged PRs from commit messages
  const prRegex = /#(\d+)/g;
  const prs = new Set();

  for (const commit of compare.data.commits || compare.data) {
    let match = prRegex.exec(commit.commit.message.split("\n")[0]);
    while (match !== null) {
      prs.add(match[1]);
      match = prRegex.exec(commit.commit.message.split("\n")[0]);
    }
  }

  return { base: previous?.tag_name, prs: Array.from(prs), tag };
}
