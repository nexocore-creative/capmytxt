# capmytxt

A free, open-source text capitalization tool. Paste text, pick a style, copy the result.

- **Title Case**: small words (a, an, the, and, of, in, to…) stay lowercase unless first, last, or after a colon
- **Sentence case**: capitalizes each sentence and the pronoun "I"
- **UPPERCASE** and **lowercase**

Everything runs in the browser. No server, no tracking, no build step, no dependencies. Your text is never uploaded.

## Run locally

Open `index.html` in a browser, or serve the folder:

```bash
python -m http.server 8000
```

## Test

```bash
node test.js
```

## Deploy free on GitHub Pages

1. Create a **public** GitHub repository and push this folder to the `main` branch.
2. In the repo, go to **Settings → Pages** and set **Source** to **GitHub Actions**.
3. Push to `main`. The workflow in `.github/workflows/pages.yml` runs the tests and publishes the site at `https://<your-username>.github.io/<repo>/`.
4. Optional: add a custom domain under Settings → Pages. Update the "Source on GitHub" link in `index.html` to your repo URL.

## Files

| File | Purpose |
| --- | --- |
| `caps.js` | Case-conversion logic (pure functions, usable in Node) |
| `app.js` | Page behavior: live conversion, copy, counts |
| `index.html`, `style.css` | Page and styles (light and dark) |
| `test.js` | Unit tests |

## Known limits

Title Case is rule-based, not AI. It can't know proper nouns, so write them with internal capitals or fix them by hand. Words like iPhone or NASA are preserved when the input is mixed case.

## License

MIT. See [LICENSE](LICENSE).
