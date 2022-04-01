---
creationDate: "2022-04-01"
description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis porttitor pretium varius. Integer in pellentesque massa."
title: "Lockfiles demystified"
---

This topic may sound a bit off-trend to the fancy NTF/Web3/Metaverse people out there, but I found out that it's worth sometimes going back to basics and explaining stuff everybody understands.

## TL;DR

A lockfile is a file that keeps track of the exact versions your package manager has resolved your dependencies to, at a given time. It exists so that two subsequent `install` commands always produce the same dependency tree, regardless of intermediate dependency updates. It is needed because a `package.json` file alone is not explicit enough to enforce such determinism.

## Table of content

- [Lexicon](#lexicon)
- [Introduction](#)
- [The problem](#)
- [How does a lockfile work?](#)
- [Why is it awesome?](#)
- [Lockfiles aren't pure sunshine](#)
- [Distributed libraries](#distributed-libraries)
- [Lockfiles and Git](#)

## Lexicon

- **Package**: a bundle of source code, usually characterised by a `package.json` file at its root.
- **Dependency**: a package your package depends on. You certainly added it using the `yarn add` or `npm install` command. It's listed in your `package.json` file under the `dependencies`, `devDependencies` or `peerDependencies` key (don't know the difference? [read this](https://classic.yarnpkg.com/en/docs/dependency-types)).
- **Transitive dependency**: a package that ends up in your dependency tree because one of your dependencies depends on it. For example, react depends on `loose-envify`, so if you install `react`, `loose-envify` will end up in your `node_modules` folder as well.
- **Dependency tree**: the logical representation of all the dependencies your package depends on (both regular and transitive): the root is composed of the ones listed in your `package.json` file and each further layer represents one additional degree of transitivity.

## Distributed libraries

One important thing to mention is that package managers care for one single lockfile: the one that lie at the top level of your project. This means that if some dependency of yours is shipped with a lockfile of its own, the file will be completely ignored by Yarn or npm[^1].

Put differently, if you are building a library with the purpose of distributing it (e.g. through npm), there's no way you can tell the end user's package manager how to resolve your dependencies. It will go through the `package.json` file your package provides and follow the standard strategy (i.e. highest possible version, no duplicate). Consequently, there's a chance that two people installing your library end up with two different dependency tree, depending on latest releases and dependency sharing. If you've been following along, that's not something we should be so happy about but, this time, there's no direct solution.

First, why is that problematic? Well, if you can't predict what exact packages your dependencies will be resolved to by the consumer, you can't say with absolute certitude that your code isn't going to break when executed.

If you had unlimited computational power at your disposal, this problem would be easily solved. You'd compute all possible dependency combinations and run your test suite against each of them. But that'd be far too complex (10 packages + 10 possible resolutions = 1 billion possible combinations).

No, there's nothing you can do to absolutely prevent such a thing to happen. But thankfully, there are a lot of ways to reduce the risk it does. Here are a few ones:

- Limit the number of packages your library depends on. react, for instance, only has one dependency: loose-envify.
- Run tests on selected dependency releases only. That's what Yarn do with its own packages².
- Pick only well-maintained packages. If they have solid test suites, they'll be less likely to introduce a bug in a release.
- (Discouraged) Use stricter ranges or exact versions for describing your dependencies. Beware that the more you do that, the less able will the package manager be to optimise the tree.

> ✨ Pro tip
>
> Tools like Dependabot and Renovate can help you automate dependency updates.

[^1]: With the exception of npm's `npm-shrinkwrap.json` file (a.k.a the « publishable lockfile »). But its usage is [discouraged in most situations](https://docs.npmjs.com/cli/v7/configuring-npm/npm-shrinkwrap-json).
