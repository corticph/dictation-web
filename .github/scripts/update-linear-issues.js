export default async function (issues, state) {
  if (!issues || issues.length === 0) return;

  for (const issue of issues) {
    const mutation = `mutation {
      issueUpdate(id: "${issue.id}", input: { stateId: "${state}" }) {
        success
      }
    }`;

    try {
      await fetch("https://api.linear.app/graphql", {
        body: JSON.stringify({ query: mutation }),
        headers: {
          // biome-ignore lint/style/noProcessEnv: github action
          Authorization: process.env.LINEAR_API_KEY,
          "Content-Type": "application/json",
        },
        method: "POST",
      });
    } catch {
      // Silently skip failed updates
    }
  }
}
