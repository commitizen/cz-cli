### Commitizen for contributors
When you commit with Commitizen, you'll be prompted to fill out any required commit fields at commit time. No more waiting until later for a git commit hook to run and reject your commit (though [that](https://github.com/kentcdodds/validate-commit-msg) can still be helpful). No more digging through CONTRIBUTING.md to find what the preferred format is. Get instant feedback on your commit message formatting and be prompted for required fields.

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

First, install the Commitizen conventional-changelog adapter into your project.

```
npm install cz-conventional-changelog
```

Then just add **.cz.json** to the root of your repository with the following contents:

```json
{
  "path": "node_modules/cz-conventional-changelog/"
}
```

This just tells Commitizen which adapter we actually want our contributors to use when they try to commit to this repo.

#### Congratulations your repo is Commitizen-friendly. Time to flaunt it!

Add the Commitizen-friendly badge to your README using the following markdown:
```
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)
```

Your badge will look like this:

[![Commitizen-friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)

It may also make sense to change your README.md or CONTRIBUTING.md to include or link to the Commitizen project so that your new contributors may learn more about installing and using Commitizen.

### Philosophy

#### About Commitizen
Commitizen is an open source project that helps contributors be good open source citizens. It accomplishes this by prompting them to follow commit message conventions at commit time. It also empowers project maintainers to create or use predefined commit message conventions in their repos to better communicate their expectations to potential contributors.

#### Commitizen or Commit Hooks
Both! Commitizen is not meant to be a replacement for git commit hooks. Rather, it is meant to work side-by-side with them to ensure a consistent and positive experience for your contributors. Commitizen treats the commit command as a declarative action. The contributor is declaring that they wish to contribute to your project. It is up to you as the maintainer to define what rules they should be following.

We accomplish this by letting you define which adapter you'd like to use in your project. Adapters just allow multiple projects to share the same commit message conventions. A good example of an adapter is the cz-conventional-commit adapter.

### Authors and Contributors
Jim Cummins (@JimTheDev)
