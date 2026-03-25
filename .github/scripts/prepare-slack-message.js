// RELEASE_WHAT and RELEASE_WHERE are set as env vars in the workflow (e.g. "TypeScript SDK" / "npm")
function generateSlackMessage(isRelease, versionName, linearIssuesList, otherPRsList, releaseUrl) {
  const what = process.env.RELEASE_WHAT || "SDK";
  const where = process.env.RELEASE_WHERE || "npm";
  const releaseType = isRelease ? "Release" : "Pre-Release";

  return `*New ${what} ${releaseType} Published to ${where}*

${versionName}
------------------------

**Linear Issues & Related Pull Requests:**

${linearIssuesList}

**Other Pull Requests:**

${otherPRsList}

------------------------

See full release notes: ${releaseUrl}

------------------------

`;
}

export default async function ({ context }, { pullRequests, issues }, isRelease) {
  // Map Linear issues to their related PRs
  const issuesPRMap = new Map();
  const linkedPRIds = new Set();

  for (const pr of pullRequests) {
    for (const issueId of pr.issueIds) {
      if (!issuesPRMap.has(issueId)) {
        issuesPRMap.set(issueId, pr);
        linkedPRIds.add(pr.number);
      }
    }
  }

  const otherPRs = pullRequests.filter((pr) => !linkedPRIds.has(pr.number));

  let linearIssuesList = "";
  if (issues.length > 0) {
    const issuesWithQA = issues.map((issue) => ({
      ...issue,
      needsQA: !isRelease && issue.labels.nodes.some((label) => label.name === "QA"),
    }));

    const sortedIssues = [...issuesWithQA].sort((a, b) => b.needsQA - a.needsQA);

    linearIssuesList = sortedIssues
      .map((issue) => {
        const relatedPR = issuesPRMap.get(issue.identifier);
        const prLink = relatedPR ? ` (<${relatedPR.html_url}|#${relatedPR.number}>)` : "";
        return `- <${issue.url}|${issue.identifier}>${issue.needsQA ? " (Needs QA)" : ""}: ${issue.title}${prLink}`;
      })
      .join("\n");
  } else {
    linearIssuesList = "No Linear issues in this release";
  }

  let otherPRsList = "";
  if (otherPRs.length > 0) {
    otherPRsList = otherPRs
      .map((pr) => `- <${pr.html_url}|#${pr.number}: ${pr.title}>`)
      .join("\n");
  } else {
    otherPRsList = "No additional pull requests";
  }

  const versionName = context.payload.release?.tag_name || "v0.0.0";
  const releaseUrl =
    context.payload.release?.html_url ||
    `${context.serverUrl}/${context.repo.owner}/${context.repo.repo}/releases`;

  return generateSlackMessage(isRelease, versionName, linearIssuesList, otherPRsList, releaseUrl);
}
