export default async function ({ github, context }, prs) {
  if (!prs || prs.length === 0) {
    return { issueIds: [], pullRequests: [] };
  }

  const pullRequests = [];
  const issueIds = new Set();
  const linearBotUser = "linear[bot]";

  // Reusable helper to extract Linear issue IDs (e.g. GRO-123) from text
  const extractIssueIds = (text) => {
    if (!text) return [];
    const re = /\b([A-Z]{3,}-\d+)\b/g;
    const matches = [];
    let match;
    while ((match = re.exec(text)) !== null) {
      matches.push(match[1]);
    }
    return matches;
  };

  for (const prNumber of prs) {
    const { data: pr } = await github.rest.pulls.get({
      owner: context.repo.owner,
      pull_number: Number.parseInt(prNumber, 10),
      repo: context.repo.repo,
    });

    const prData = {
      html_url: pr.html_url,
      number: pr.number,
      title: pr.title,
      user: { login: pr.user.login },
    };

    const prIssueIds = new Set();

    // Search PR body for Linear issue IDs (covers api-specs release mentions and manual links)
    for (const id of extractIssueIds(pr.body)) {
      issueIds.add(id);
      prIssueIds.add(id);
    }

    // Search Linear bot comments
    const { data: comments } = await github.rest.issues.listComments({
      issue_number: Number.parseInt(prNumber, 10),
      owner: context.repo.owner,
      repo: context.repo.repo,
    });

    for (const comment of comments) {
      if (comment.user.login === linearBotUser) {
        for (const id of extractIssueIds(comment.body)) {
          issueIds.add(id);
          prIssueIds.add(id);
        }
      }
    }

    prData.issueIds = Array.from(prIssueIds);
    pullRequests.push(prData);
  }

  return {
    issueIds: Array.from(issueIds),
    pullRequests,
  };
}
