import deployer, { DeployOption } from "./deployer";
import Hexo from "hexo";

const getOpts = (args: Hexo.extend.Deployer.Config): DeployOption | null => {
  const username = args.username || process.env.CLODUI_USERNAME;
  const password = args.password || process.env.CLODUI_PASSWORD;
  const websiteId = args.website_id || process.env.CLODUI_WEBSITE;
  const sourceDir = hexo.public_dir;
  const publish = args.publish ?? false;

  if (username && password && websiteId && sourceDir) {
    return {
      username,
      password,
      websiteId,
      sourceDir,
      publish,
    };
  }

  return null;
};

hexo.extend.deployer.register("clodui", async (args) => {
  const opts = getOpts(args);
  if (opts === null) {
    const help = `You should configure deployment settings in _config.yml first!
    Example:
      deploy:
        type: clodui
        username: <Clodui username> # or set environment variable CLODUI_USERNAME
        password: <Clodui password> # or set environment variable CLODUI_PASSWORD
        website_id: <Clodui website id> # or set environment variable CLODUI_WEBSITE
        publish: [true|false] # default is false`;

    console.log(help);
    return;
  }
  return deployer(opts);
});
