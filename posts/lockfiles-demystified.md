---
creationDate: "2022-04-01"
description: "This topic may sound a bit off-trend to the fancy NTF/Web3/Metaverse people out there, but I found out that it's worth sometimes going back to basics and explaining stuff *everybody* understands."
metaDescription: "This is an attempt to explain why lockfiles (e.g. yarn.lock, package-lock.json) were invented, what their limits are and how they should be manipulated on a day-to-day basis."
title: "Lockfiles demystified"
---

This topic may sound a bit off-trend to the fancy NTF/Web3/Metaverse people out there, but I found out that it's worth sometimes going back to basics and explaining stuff \*everybody\* understands.

This is an attempt to explain why lockfiles (e.g. `yarn.lock`, `package-lock.json`) were invented, what their limits are and how they should be manipulated on a day-to-day basis. A very basic knowledge of package managers is expected. You'll find some external links along the way if you want to push your understanding a bit deeper.

## TL;DR

A lockfile is a file that keeps track of the exact versions your package manager has resolved your dependencies to, at a given time. It exists so that two subsequent `install` commands always produce the same dependency tree, regardless of intermediate dependency updates. It is needed because a `package.json` file alone is not explicit enough to enforce such determinism.

## Table of content

- [Lexicon](#lexicon)
- [Introduction](#introduction)
- [The problem](#the-problem)
- [How does a lockfile work?](#how-does-a-lockfile-work)
- [Why is it awesome?](#why-is-it-awesome)
- [Lockfiles aren't pure sunshine](#but-lockfiles-arent-pure-sunshine)
- [Distributed libraries](#distributed-libraries)
- [Lockfiles and Git](#lockfiles-and-git)
- [Conclusion](#conclusion)

## Lexicon

- **Package**: a bundle of source code, usually characterised by a `package.json` file at its root. A package that is intended to be used in other packages can also be referred to as a _library_.
- **Dependency**: a package your package depends on. You certainly added it using the `yarn add` or `npm install` command. It's listed in your `package.json` file under the `dependencies`, `devDependencies` or `peerDependencies` key (don't know the difference? [read this](https://classic.yarnpkg.com/en/docs/dependency-types)).
- **Transitive dependency**: a package that ends up in your dependency tree because one of your dependencies depends on it. For example, `react` depends on `loose-envify`, so if you install `react`, `loose-envify` will end up in your `node_modules` folder along with it.
- **Dependency tree**: the logical representation of all the packages your package depends on (both regular and transitive): the root is composed of the ones listed in your `package.json` file and each further layer represents one additional degree of transitivity.

## Introduction

There are a number of ways you can describe a dependency in a `package.json` file, each with its own meaning:

- `^17.0.0` means _« Give me any version that's compatible with `17.0.0`. »_. That's the default range and the most useful one.
- `>17.0.0` means _« Give me any version that's above `17.0.0`, no matter if it's compatible with `17.0.0` or not. »_. That's dangerous as it might introduce breaking changes.
- `17.0.0` means _« Give me exactly `17.0.0` »_. You shouldn't use this one often and instead be the loosest you can be in order to optimise dependency sharing.
- … and so on ([full list](https://classic.yarnpkg.com/en/docs/dependency-versions/)).

One of the main features of package managers like Yarn or npm is to resolve your dependencies, i.e. to convert each _descriptor_ (or set of packages, e.g. `react@^17.0.0`) you provide into a _locator_ (or unique package, e.g. `react@17.0.2`). Each package manager has its own way of doing this, but what they all do is that they look for the highest version that satisfies your requirement.

## The problem

Let's say for a second that we live in a place where lockfiles don't exist. Here, the `package.json` file is the only authority your package manager takes his orders from. Sounds exciting? Well, it shouldn't, and you'll see why.

In this `package.json` file, you specify that `react@^17.0.0` is a dependency. At the time you run the `install` command for the first time, the latest version of `react` is, say, `17.0.2`. The package manager will thus resolve `react@^17.0.0` to `react@17.0.2`, because, remember, it's looking for the highest version that satisfies your requirement.

A few weeks later, somebody joins your team. He loads the source code on his machine and runs the `install` command. But, time has passed, and the latest version of `react` is now `17.0.3`. This still satisfies the `^17.0.0` range, so the package manager will this time resolve `react@^17.0.0` to `react@17.0.3`. See the problem? You and your colleague now have different versions of `react` in your respective `node_modules` folders. And, one day, you'll probably end up saying something like:

> _« Bruh, why is this working on your machine and not mine?! No, no, this time it's too much, I quit coding. »_

Because you specify ranges and not exact versions for your dependencies, your `package.json` file can actually be resolved in a variety of different ways, depending on what the latest releases of the targeted libraries are. This is not a good thing, as it makes the results of the `install` command not predictable. Executing it twice with the same `package.json` file could produce two different `node_modules` folders.

> 🤔 Wait a second
>
> I know what you're thinking. Why not only specifying exact versions for your dependencies (e.g. `react@17.0.2`)? That way, there would be no surprise when running the `install` command twice. Well, although tempting, this reasoning is flawed because you're forgetting something: each of your dependencies has a `package.json` file of its own, in which it declares its dependencies, which your package manager is also responsible for resolving. So, even if you only specify exact versions for _your_ dependencies, you can't control the way your dependencies declare _theirs_, which may still be through ranges. No, we need something else.

## How does a lockfile work?

A lockfile is a file that keeps track of the exact versions your package manager has resolved your dependencies to. Put differently, it's a snapshot of how your `package.json` file was resolved at a given time.

Let's say that your `package.json` file looks like that:

```jsonc
{
  // ...
  "dependencies": {
    "react": "^17.0.0"
  }
}
```

After running `yarn install` (or `npm install`) for the first time, here's what you might find in the generated `yarn.lock` (or `package-lock.json`) file:

```txt
# ...

react@^17.0.0:
  version "17.0.2"
  resolved "https://registry.yarnpkg.com/react/-/react-17.0.2.tgz#d0b5cc516d29eb3eee383f75b62864cfb6800037"
  integrity sha512-gnhPt75i/dq/z3/6q/0asP78D0u592D5L1pd7M8P+dck6Fu/jJeL6iVVK23fptSUZj8Vjf++7wXA8UNclGQcbA==
  dependencies:
    loose-envify "^1.1.0"
    object-assign "^4.1.1"
```

Check out the first key/value pair. This basically means that the `react` dependency you specified as a range in your `package.json` file (`"react": "^17.0.0"`) was resolved to the `17.0.2` _exact_ version of `react`.

If you run the `install` command again, the package manager will notice that there's a lockfile lying there and skip the resolution step for already-resolved dependencies. Let's say that `react` releases version `17.0.3` in the middle of your two `install` commands, the package manager would still resolve `^17.0.0` to `17.0.2`, thanks to the lockfile.

## Why is it awesome?

Now you might be thinking:

> _« Ok, so I'm stuck forever with version `17.0.2`. What's the point? What if I actually wanted `react` to be upgraded to `17.0.3`? »_

Well, it's true that the `react` version is kind of _locked_ here. But it's not true that you're stuck with it. Actually, you can decide to upgrade at any time. And that's the key takeaway. Thanks to the lockfile, the package manager can give full power to _you_. If you don't do anything, your `node_modules` folder should not be modified. In other words, two subsequent `install` commands should always produce the same results. This is called determinism: it's when no randomness is involved in the process.

So, whether or not to upgrade to `17.0.3` is _your_ decision. And you express it using a simple command: `upgrade`.

**Taking back our last example**. Should you run `yarn upgrade react` (or `npm upgrade react`) after version `17.0.3` of `react` was released, your `yarn.lock` (or `package-lock.json`) file would be updated that way:

```
# ...

react@^17.0.0:
  version "17.0.3"
  resolved "https://registry.yarnpkg.com/react/-/react-17.0.3.tgz#d0b5cc516d30eb3eee383f75b62864cfb6800037"
  integrity sha512-dgbPt75i/dq/z3/6q/0asP78D0u592D5L1pd7M8P+dck6Fu/jJeL6iVVK23fptSUZj8Vjf++7wXA8UNclGQcbA==
  dependencies:
    loose-envify "^1.1.0"
    object-assign "^4.1.1"
```

> ✨ Pro tip
>
> Yarn comes with a very handy [upgrade-interactive](https://classic.yarnpkg.com/lang/en/docs/cli/upgrade-interactive/) command that displays all outdated packages and lets you choose which one to upgrade. Check out the [npm-check](https://www.npmjs.com/package/npm-check) package for an npm equivalent.

## But lockfiles aren't pure sunshine

Why? Because they can cause duplication.

Duplicates are defined by Yarn as _« descriptors with overlapping ranges being resolved and locked to different locators »_[^1]. They are a natural consequence of package managers' deterministic installs, but they can sometimes pile up and unnecessarily increase the size of your project.

This should not happen too frequently though, as package managers try to avoid duplication in the first place. Let's take two examples, one in which Yarn succeeds doing so and one in which it fails.

**Success example**. If `react@^17.0.0` (a dependency of a dependency) has already been resolved to `react@17.0.2`, running `yarn add react@*` will cause Yarn to reuse `react@17.0.2`, even if the latest version of `react` is `17.0.3`, thus preventing unnecessary duplication.

**Failure example**. If `react@^17.0.0` (a dependency of a dependency) has already been resolved to `react@17.0.2`, running `yarn add react@17.0.3` will cause Yarn to install `react@17.0.3` because the existing resolution doesn't satisfy the range `17.0.2`. This behaviour can lead to unwanted duplication, as now the lockfile contains two separate resolutions for the two `react` descriptors, even though they overlap.

How to take action? The `dedupe` command comes to our rescue. This command should be used with caution though, as it modifies the dependency tree, which can sometimes cause problems when packages don't strictly follow [semver recommendations](https://semver.org/spec/v2.0.0.html). Because of this, it is recommended to also review the changes manually.

> ✨ Pro tip
>
> Use the `--check` option of Yarn `v2+`'s `dedupe` command to check if the dependency tree contains any duplicate, but without applying any change yet. Make this part of your CI workflow.

## Distributed libraries

One important thing to mention is that package managers care for one single lockfile: the one that lie at the top level of your project. This means that if some dependency of yours is shipped with a lockfile of its own, the file will be completely ignored by Yarn or npm[^2].

Put differently, if you are building a library with the purpose of distributing it (e.g. through npm), there's no way you can tell the end user's package manager how to resolve your dependencies. It will go through the `package.json` file your package provides and follow the standard strategy (i.e. highest possible version, no duplicate). Consequently, there's a chance that two people installing your library end up with two different dependency tree, depending on latest releases and dependency sharing. If you've been following along, that's not something we should be so happy about but, this time, there's no direct solution.

First, why is that problematic? Well, if you can't predict what exact packages your dependencies will be resolved to by the consumer, you can't say with absolute certitude that your code isn't going to break when executed.

If you had unlimited computational power at your disposal, this problem would be easily solved. You'd compute all possible dependency combinations and run your test suite against each of them. But that'd be far too complex (10 packages + 10 possible resolutions = 1 billion possible combinations).

No, there's nothing you can do to absolutely prevent such a thing to happen. But thankfully, there are a lot of ways to reduce the risk it does. Here are a few ones:

- Limit the number of packages your library depends on. `react`, for instance, only has one dependency: `loose-envify`.
- Run tests on selected dependency releases only. That's what Yarn do with its own packages[^3].
- Pick only well-maintained packages. If they have solid test suites, they'll be less likely to introduce a bug in a release.
- (Discouraged) Use stricter ranges or exact versions for describing your dependencies. Beware that the more you do that, the less able will the package manager be to optimise the tree.

> ✨ Pro tip
>
> Tools like [Dependabot](https://github.com/dependabot/dependabot-core) and [Renovate](https://github.com/renovatebot/renovate) can help you automate dependency updates.

## Lockfiles and Git

Should lockfiles be committed to the repository? You'll find a lot of different answers to that question around the Web, but only one of them is right: **Yes, always**.

Why? Because you want anyone (e.g. a colleague) or anything (e.g. a deployment server) accessing your git repository to use the same version of `react` that you use locally, that you tested your code against. This is critical to prevent errors, as new versions-even backward-compatible ones-may break your code.

## Conclusion

As a conclusion, we can say that lockfiles are an almost perfect solution to a complex problem. You have many dependencies, those dependencies have dependencies of their own, and each dependency can be resolved in a variety of different ways: the universe of potential combinations is vast. Lockfiles bring determinism to the party, which enables you to maintain sovereignty over your codebase. In order for you code to keep working as time goes, they lock everything, while kindly handing the control panel to you.

[^1]: [https://yarnpkg.com/cli/dedupe](https://yarnpkg.com/cli/dedupe)
[^2]: With the exception of npm's `npm-shrinkwrap.json` file (a.k.a the « publishable lockfile »). But its usage is [discouraged in most situations](https://docs.npmjs.com/cli/v7/configuring-npm/npm-shrinkwrap-json).
[^3]: Check out [their workflows](https://github.com/yarnpkg/berry/tree/master/.github/workflows).
