import { Octokit } from "octokit";

export async function parseMD(bundle: string) {
  const octokit = new Octokit({
    auth: process.env.OCTOKIT_ACCESS_TOKEN,
  });

  const { data } = await octokit.request("POST /markdown", {
    text: bundle,
  });

  return data;
}
