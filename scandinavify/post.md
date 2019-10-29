# Language: more fun with silly scandinavian characters.

In this post we're going to have a look at how to make any language more fun by replacing random vowels with scandinavian special characters.

We'll use [preact][preact] to create a small text replacing component, which will help us generate more fun words and annoy potential coworkers with needless noise and complexity in your next email.

To get started with preact, we'll make use of the CLI:

```
npm i -g preact-cli
```

Let's create a new project with the cli, my example changes into my project folder and then creates a project:

```
cd projects
preact create default scandinavify
```

At the time of writing, preact X (10) is not released yet, but if you want you can still use it by:

```
npm install preact@next
```

[preact]: https://preactjs.com