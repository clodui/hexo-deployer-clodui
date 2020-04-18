# hexo-deployer-clodui

[Clodui](https://www.clodui.com) deployer plugin for [Hexo](https://hexo.io).

## Installation

```bash
npm install hexo-deployer-clodui --save
```

## Options

You can configure this plugin in `_config.yml`.

```
deploy:
  type: clodui
  username: <Clodui username> # or set environment variable CLODUI_USERNAME
  password: <Clodui password> # or set environment variable CLODUI_PASSWORD
  website_id: <Website id>
  publish: [true|false] # default is false`
```

Check out [Clodui docs](https://www.clodui.com/docs/) for more details.
