### Commitizen for contributors
When you commit with Commitizen, you'll be prompted to fill out any required commit fields at commit time. No more waiting until later for a git commit hook to run and reject your commit (though [that](https://github.com/kentcdodds/validate-commit-msg) can still be helpful). No more digging through CONTRIBUTING.md to find what the preferred format is. Get instant feedback on your commit message formatting and be prompted for required fields.

[![travis.ci](https://img.shields.io/travis/commitizen/cz-cli.svg?style=flat-square)](https://travis-ci.org/commitizen/cz-cli) [![codecov.io](https://img.shields.io/codecov/c/github/commitizen/cz-cli.svg?style=flat-square)](https://codecov.io/github/commitizen/cz-cli?branch=master) [![npm monthly downloads](https://img.shields.io/npm/dm/commitizen.svg?style=flat-square)](https://www.npmjs.com/package/commitizen) [![current version](https://img.shields.io/npm/v/commitizen.svg?style=flat-square)](https://www.npmjs.com/package/commitizen) [![bitHound Score](https://www.bithound.io/github/commitizen/cz-cli/badges/score.svg)](https://www.bithound.io/github/commitizen/cz-cli)

#### Installing the command line tool
Installation is as simple as running the following command (add sudo if on OSX/Linux):

```
npm install -g commitizen
```

#### Using the command line tool
Now, simply use `git cz` instead of `git commit` when committing. 

When you're working in a Commitizen friendly repository, you'll be prompted to fill in any required fields and your commit messages will be formatted according to the the standards defined by project maintainers. 

[![Add and commit with Commitizen](https://github.com/commitizen/cz-cli/raw/master/meta/screenshots/add-commit.png)](https://github.com/commitizen/cz-cli/raw/master/meta/screenshots/add-commit.png)

If you're not working in a Commitizen friendly repository, then `git cz` will work just the same as `git commit`.

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
commitizen init cz-conventional-changelog --save --save-exact
```

Note that if you want to force install over the top of an old adapter, you can apply the `--force` argument. For more information on this, just run `commitizen help`.

Then just add the `config.commitizen` key to the root of your **package.json** as shown here:

```json
...
  "config": {
    "commitizen": {
      "path": "node_modules/cz-conventional-changelog"
    }
  }
```

This just tells Commitizen which adapter we actually want our contributors to use when they try to commit to this repo.

Please note that in previous version of Commitizen we used czConfig. **czConfig has been deprecated** and you should migrate to the new format before Commitizen 3.0.0.

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

### Adapters

We know that every project and build process has different requirements so we've tried to keep Commitizen open for extension. You can do this by choosing from any of the pre-build adapters or even by building your own. Here are some of the great adapters available to you:

- [cz-conventional-changelog](https://www.npmjs.com/package/cz-conventional-changelog)
- [cz-jira-smart-commit](https://www.npmjs.com/package/cz-jira-smart-commit)
- [rb-conventional-changelog](https://www.npmjs.com/package/rb-conventional-changelog)
- [cz-mapbox-changelog](https://www.npmjs.com/package/cz-mapbox-changelog)

To create an adapter, just fork one of these great adapters and modify it to suit your needs.  We pass you an instance of [Inquirer.js](https://github.com/SBoudrias/Inquirer.js/) but you can capture input using whatever means neccesary. Just call the `commit` callback with a string and we'll be happy. Publish it to npm, and you'll be all set!

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

[![Bitdeli Badge](https://d2weczhvl823v0.cloudfront.net/commitizen/cz-cli/trend.png)](https://bitdeli.com/free "Bitdeli Badge")

