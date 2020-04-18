import { Client } from "@clodui/cli";
import ProgressBar from "progress";
import ora from "ora";

export type DeployOption = {
  username: string;
  password: string;
  websiteId: string;
  sourceDir: string;
  publish?: boolean;
};

export default async (opts: DeployOption) => {
  const client = new Client();

  const spinner = ora();
  spinner.prefixText = "[Clodui]";
  const progressBar = new ProgressBar(
    "[Clodui] Uploading [:bar] :rate/bps :percent :etas",
    {
      complete: "=",
      incomplete: " ",
      width: 20,
      total: 100,
    }
  );

  client.on("login", (status) => {
    if (status) {
      spinner.succeed("Login success");
    } else {
      spinner.fail("Login failed, please check your credentials");
    }
  });

  client.on("logout", () => {
    spinner.succeed("Logged out successfully");
  });

  client.on("message", (message) => {
    if (!spinner.isSpinning) {
      spinner.start();
    }
    spinner.text = message;
  });

  client.on("executed", () => {
    spinner.stop();
  });

  client.on("status", (action, status, error) => {
    if (!status) {
      spinner.fail(`${action} failed - ${error}`);
      process.exit(1);
    }
  });

  client.on("uploadProgress", (progress) => {
    spinner.stop();
    if (!progressBar.complete) {
      progressBar.tick(progress);
    }
  });

  try {
    const status = await client.login(opts.username, opts.password);
    if (!status) {
      return;
    }

    const deployment = await client.deployChanges(
      opts.websiteId,
      opts.sourceDir,
      opts.publish
    );
    if (deployment) {
      spinner.succeed(`Deployment started for website ${opts.websiteId}`);
    } else {
      spinner.fail(`Deployment failed for website ${opts.websiteId}`);
    }
  } catch (error) {
    const message =
      error.message ||
      "An error occurred during deployment. Check clodui.log for more details";
    spinner.fail(message);
  }
};
