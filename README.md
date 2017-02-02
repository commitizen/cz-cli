### Commitizen for contributors
When you commit with Commitizen, you'll be prompted to fill out any required commit fields at commit time. No more waiting until later for a git commit hook to run and reject your commit (though [that](https://github.com/kentcdodds/validate-commit-msg) can still be helpful). No more digging through [CONTRIBUTING.md](CONTRIBUTING.md) to find what the preferred format is. Get instant feedback on your commit message formatting and be prompted for required fields.

[![travis.ci](https://img.shields.io/travis/commitizen/cz-cli.svg?style=flat-square)](https://travis-ci.org/commitizen/cz-cli) [![Build status](https://ci.appveyor.com/api/projects/status/ha5vb0p6iq8450un/branch/master?svg=true)](https://ci.appveyor.com/project/jimthedev/cz-cli/branch/master)
 [![codecov.io](https://img.shields.io/codecov/c/github/commitizen/cz-cli.svg?style=flat-square)](https://codecov.io/github/commitizen/cz-cli?branch=master) [![npm monthly downloads](https://img.shields.io/npm/dm/commitizen.svg?style=flat-square)](https://www.npmjs.com/package/commitizen) [![current version](https://img.shields.io/npm/v/commitizen.svg?style=flat-square)](https://www.npmjs.com/package/commitizen) [![bitHound Score](https://www.bithound.io/github/commitizen/cz-cli/badges/score.svg)](https://www.bithound.io/github/commitizen/cz-cli) [![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg?style=flat-square)](https://github.com/semantic-release/semantic-release)

#### Installing the command line tool
Installation is as simple as running the following command (if you see `EACCES` error, reading [fixing npm permissions](https://docs.npmjs.com/getting-started/fixing-npm-permissions) may help):

```
npm install -g commitizen
```

#### Using the command line tool
Now, simply use `git cz` instead of `git commit` when committing.

When you're working in a Commitizen friendly repository, you'll be prompted to fill in any required fields and your commit messages will be formatted according to the standards defined by project maintainers.

[![Add and commit with Commitizen](https://github.com/commitizen/cz-cli/raw/master/meta/screenshots/add-commit.png)](https://github.com/commitizen/cz-cli/raw/master/meta/screenshots/add-commit.png)

If you're not working in a Commitizen friendly repository, then `git cz` will work just the same as `git commit`.

#### Conventional commit messages as a global utility

Install `commitizen` globally, if you have not already.

```
npm install -g commitizen
```

Install your preferred `commitizen` adapter globally, for example [`cz-conventional-changelog`](https://www.npmjs.com/package/cz-conventional-changelog)

```
npm install -g cz-conventional-changelog
```

Create a `.czrc` file in your `home` directory, with `path` referring to the preferred, globally installed, `commitizen` adapter

```
echo '{ "path": "cz-conventional-changelog" }' > ~/.czrc
```

You are all set! Now `cd`into any `git` repository and use `git cz` instead of `git commit` and you will find the `commitizen` prompt.

Protip:  You can use all the `git commit` `options` with `git cz`, for example: `git cz -a`.

>If your repository is a [nodejs](https://nodejs.org/en/) project, making it [Commitizen-friendly](#making-your-repo-commitizen-friendly) is super easy.

If your repository is already [Commitizen-friendly](#making-your-repo-commitizen-friendly), the local `commitizen` adapter will be used, instead of globally installed one.

### Commitizen for project maintainers
As a project maintainer, making your repo Commitizen friendly allows you to select pre-existing commit message conventions or to create your own custom commit message convention. When a contributor to your repo uses Commitizen, they will be prompted for the correct fields at commit time.

#### Making your repo Commitizen-friendly

For this example, we'll be setting up our repo to use [AngularJS's commit message convention](https://github.com/angular/angular.js/blob/master/CONTRIBUTING.md#-git-commit-guidelines) also known as [conventional-changelog](https://github.com/ajoslin/conventional-changelog).

First, install the Commitizen cli tools:

```
npm install commitizen -g
```

Next, initialize your project to use the cz-conventional-changelog adapter by typing:

```
commitizen init cz-conventional-changelog --save-dev --save-exact
```

Note that if you want to force install over the top of an old adapter, you can apply the `--force` argument. For more information on this, just run `commitizen help`.

The above command does three things for you. It installs the cz-conventional-changelog adapter npm module, it saves it to the package.json's dependencies or devDependencies, and lastly it  add the `config.commitizen` key to the root of your **package.json** as shown here:

```json
...
  "config": {
    "commitizen": {
      "path": "cz-conventional-changelog"
    }
  }
```

This just tells Commitizen which adapter we actually want our contributors to use when they try to commit to this repo.

`commitizen.path` is resolved via [require.resolve](https://nodejs.org/api/globals.html#globals_require_resolve) and supports

*  npm modules
*  directories relative to `process.cwd()` containing an `index.js` file
*  file base names relative to `process.cwd()` with `js` extension
*  full relative file names
*  absolute paths.

Please note that in previous version of Commitizen we used czConfig. **czConfig has been deprecated** and you should migrate to the new format before Commitizen 3.0.0.

#### Optional: Install and run Commitizen locally

Installing and running Commitizen locally allows you to make sure that developers are running the exact same version of Commitizen on every machine.

Install Commitizen with `npm install --save-dev commitizen`.

Once you have Commitizen installed as a local dev dependency you can execute `./node_modules/.bin/commitizen` or `./node_modules/.bin/git-cz` in order to actually use the commands.

You can then initialize the conventional changelog adapter using: `./node_modules/.bin/commitizen init cz-conventional-changelog --save-dev --save-exact`

And you can then add some nice npm run scripts in your package.json pointing to the local version of commitizen:

```json
  ...
  "scripts": {
    "commit": "git-cz"
  }
```

This will be more convenient for your users because then if they want to do a commit, all they need to do is run `npm run commit` and they will get the prompts needed to start a commit!

#### Congratulations your repo is Commitizen-friendly. Time to flaunt it!

Add the Commitizen-friendly badge to your README using the following markdown:
```
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)
```

Your badge will look like this:

[![Commitizen-friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)

It may also make sense to change your README.md or CONTRIBUTING.md to include or link to the Commitizen project so that your new contributors may learn more about installing and using Commitizen.


#### Go further

Commitizen is great on its own, but it shines when you use it with some other amazing open source tools. Kent C. Dodds shows you how to accomplish this in his Egghead.io series, [How to write an open source javascript library](https://egghead.io/series/how-to-write-an-open-source-javascript-library). Many of the concepts can be applied to non-javascript projects as well.

#### Retrying failed commits

As of version 2.7.1, you may attempt to retry the last commit using the `git cz --retry` command. This can be helpful when you have tests set up to run via a git precommit hook.  In this scenario, you may have attempted a Commitizen commit, painstakingly filled out all of the commitizen fields, but your tests fail. In previous Commitizen versions, after fixing your tests, you would be forced to fill out all of the fields again. Enter the retry command. Commitizen will retry the last commit that you attempted in this repo without you needing to fill out the fields again.

Please note that the retry cache may be cleared when upgrading commitizen versions, upgrading adapters, or if you delete the `commitizen.json` file in your home or temp directory.  Additionally, the commit cache uses the filesystem path of the repo, so if you move a repo or change its path, you will not be able to retry a commit. This is an edge case, but might be confusing if you have scenarios where you are moving folders that contain repos.

It is important to note that if you are running `git-cz` from a npm script (let's say it is called `commit`) you will need to do one of the following:
- Pass `-- --retry` as an argument for your script. i.e: `npm run commit -- --retry`
- Use [npm-run](https://www.npmjs.com/package/npm-run) to find and call git-cz executable directly. i.e: `npm-run git-cz --retry`
- Use [npm-quick-run](https://www.npmjs.com/package/npm-quick-run) i.e: `nr commit --retry` or just `nr c --retry` (which will run all scripts that starts with the letter 'c')

Note that the last two options **do not** require you to pass `--` before the args but the first **does**.

### Commitizen for multi-repo projects

As a project maintainer of many projects, you may want to standardize on a single commit message
format for all of them. You can create your own node module which acts as front-end for commitizen.

#### 1. Create your own entry point script


```
// my-cli.js

#!/usr/bin/env node
"use strict";

const path = require('path');
const bootstrap = require('commitizen/dist/cli/git-cz').bootstrap;

bootstrap({
  cliPath: path.join(__dirname, '../../node_modules/commitizen'),
  // this is new
  config: {
    "path": "cz-conventional-changelog"
  }
});
```

#### 2. Add script to package.json

```
// package.json

{
  "name": "company-commit",
  "bin": "./my-cli.js"
  "dependencies": {
    "commitizen": "^2.7.6",
    "cz-conventional-changelog": "^1.1.5",
  }
}
```

#### 3. Publish it to npm and use it!

```
npm install company-commit --save-dev
./node_modules/.bin/company-commit
```

### Adapters

We know that every project and build process has different requirements so we've tried to keep Commitizen open for extension. You can do this by choosing from any of the pre-build adapters or even by building your own. Here are some of the great adapters available to you:

- [cz-conventional-changelog](https://www.npmjs.com/package/cz-conventional-changelog)
- [cz-jira-smart-commit](https://www.npmjs.com/package/cz-jira-smart-commit)
- [rb-conventional-changelog](https://www.npmjs.com/package/rb-conventional-changelog)
- [cz-mapbox-changelog](https://www.npmjs.com/package/cz-mapbox-changelog)
- [cz-customizable](https://github.com/leonardoanalista/cz-customizable)
- [cz-conventional-changelog-lint](https://github.com/marionebl/cz-conventional-changelog-lint)
- [vscode-commitizen](https://github.com/KnisterPeter/vscode-commitizen)
- [cz-emoji](https://github.com/ngryman/cz-emoji)

To create an adapter, just fork one of these great adapters and modify it to suit your needs.  We pass you an instance of [Inquirer.js](https://github.com/SBoudrias/Inquirer.js/) but you can capture input using whatever means necessary. Just call the `commit` callback with a string and we'll be happy. Publish it to npm, and you'll be all set!

### Philosophy

#### About Commitizen
Commitizen is an open source project that helps contributors be good open source citizens. It accomplishes this by prompting them to follow commit message conventions at commit time. It also empowers project maintainers to create or use predefined commit message conventions in their repos to better communicate their expectations to potential contributors.

#### Commitizen or Commit Hooks
Both! Commitizen is not meant to be a replacement for git commit hooks. Rather, it is meant to work side-by-side with them to ensure a consistent and positive experience for your contributors. Commitizen treats the commit command as a declarative action. The contributor is declaring that they wish to contribute to your project. It is up to you as the maintainer to define what rules they should be following.

We accomplish this by letting you define which adapter you'd like to use in your project. Adapters just allow multiple projects to share the same commit message conventions. A good example of an adapter is the cz-conventional-changlog adapter.

### Authors and Contributors
@JimTheDev (Jim Cummins, author)
@kentcdodds
@accraze
@kytwb
@Den-dp

Special thanks to @stevelacy, whose [gulp-git](https://www.npmjs.com/package/gulp-git) project makes commitizen possible.
