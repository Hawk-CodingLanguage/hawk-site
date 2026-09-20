# Hawk website

Static site for the [Hawk programming language](https://github.com/Hawk-CodingLanguage/hawk-core),
served with GitHub Pages.

No build step, no external dependencies: plain HTML, one stylesheet, and a small
syntax highlighter.

## Structure

```
index.html              landing page
docs/index.html         documentation hub
docs/language.html      language reference
docs/architecture.html  implementation guide
docs/cli.html           CLI reference
404.html                not-found page
assets/style.css        stylesheet
assets/highlight.js     dependency-free Hawk syntax highlighter
assets/logo.svg         logo and favicon
```

## Local preview

```sh
python3 -m http.server 8000
# then open http://localhost:8000
```

## Deployment

Every push to `main` deploys the repository root through the workflow in
`.github/workflows/pages.yml` using GitHub Pages. The site is published at:

https://hawkcodinglanguage.github.io/hawk-site/

## License

MIT. See [LICENSE](LICENSE).
