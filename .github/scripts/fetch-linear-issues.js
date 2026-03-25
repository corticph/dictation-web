export default async function (ids) {
  if (ids.length === 0) return [];

  const issues = [];

  // Query each issue individually to avoid one failure affecting others
  for (const id of ids) {
    const query = `query {
      issue(id: "${id}") {
        id
        identifier
        title
        url
        labels {
          nodes { 
            name
          }
        } 
        assignee {
          name
        }
      }
    }`;

    try {
      const res = await fetch("https://api.linear.app/graphql", {
        body: JSON.stringify({ query }),
        headers: {
          // biome-ignore lint/style/noProcessEnv: github action
          Authorization: process.env.LINEAR_API_KEY,
          "Content-Type": "application/json",
        },
        method: "POST",
      });

      const json = await res.json();

      if (json.data?.issue) {
        issues.push(json.data.issue);
      }
    } catch {
      // Silently skip failed issues
    }
  }

  return issues;
}
