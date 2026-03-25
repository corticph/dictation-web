export default async function ({ pullRequests, issues }) {
  const prNotes = pullRequests
    .map((pr) => `- ${pr.title} (#${pr.number}) by @${pr.user.login}`)
    .join("\n");

  let issueNotes = "No issues in this release";

  if (issues.length > 0) {
    issueNotes = issues
      .map((issue) => {
        const assignee = issue.assignee ? issue.assignee.name : "Unassigned";
        return `- [${issue.identifier}](${issue.url}): ${issue.title} - By ${assignee}`;
      })
      .join("\n");
  }

  return `# Release Notes

## Pull Requests

${prNotes}

## Linear Issues

${issueNotes}

`;
}
