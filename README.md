# samos-76.github.io

My robotics portfolio. It's a Jekyll site built and hosted by GitHub Pages. Each project is **one Markdown file plus a media folder**.

- [Preview locally](#preview-locally)
- [Add a project](#add-a-project)
- [Edit the rest of the copy](#edit-the-rest-of-the-copy)
- [Colours and fonts](#colours-and-fonts)
- [Writing tab (Substack)](#writing-tab-substack)
- [Deploy to GitHub Pages](#deploy-to-github-pages)
- [Before launch](#before-launch)
- [Where things live](#where-things-live)

---

## Preview locally

**Option A: Docker (nothing else to install).** Start Docker Desktop, then run this in the repo folder:

```sh
docker compose up
```

Open http://localhost:4000. The page reloads when you save a file. `Ctrl+C` stops it. The first run takes a few minutes while the gems install; after that it starts in seconds.

> Edits to `_config.yml` need a restart: `Ctrl+C`, then `docker compose up` again.

**Option B: native Ruby.** Install Ruby+Devkit 3.3 from <https://rubyinstaller.org> (tick "run ridk install"), then:

```sh
bundle install
bundle exec jekyll serve --livereload
```

---

## Add a project

A project is **one Markdown file**, `_projects/<slug>.md`, plus **a media folder**, `assets/projects/<slug>/`. The slug (lowercase-with-dashes) becomes the URL: `/projects/<slug>/`.

> **Using an AI assistant?** Paste `_templates/add-project-prompt.md` into a new chat, fill in the top section, and it will build the page following these rules.

1. Copy `_templates/project.md` to `_projects/so101-policy.md` (for example).
2. Create `assets/projects/so101-policy/` and put the thumbnail, clips and images in it.
3. Fill in the short block at the top (between the `---` lines): card details and a TL;DR.
4. Write the page in plain Markdown under four headings: **Overview**, **Approach**, **Results**, **Improvements**. Leave out any heading you don't need.
5. Preview, then commit and push.

### Example

```markdown
---
title: "SO-101 pick-and-place policy"
result: "One sentence for the card, with the concrete result."
date: 2026-09-01
status: in-progress          # shipped | in-progress
featured: true               # also show it in the Featured row

disciplines: [robot-learning, simulation]
tech: [PyTorch, Isaac Lab, LeRobot]

thumbnail: poster.jpg
thumbnail_video: loop.mp4    # optional

hero:
  video: hero.mp4            # or  youtube: VIDEO_ID   or  image: hero.jpg

tldr: >-
  Two or three lines on what it is and how it turned out.

links:
  repo: https://github.com/SAMOS-76/...
  writeup: https://samos76.substack.com/p/...
---

## Overview

What the project is and why.

## Approach

### Simulation
...

### Learning
...

## Results

![Success rate over training](success-rate.png "Optional caption")

![Arm grasping](grasp-1.jpg)
![Arm placing](grasp-2.jpg)

## Improvements

What I'd change or do next.
```

**Images:** write just the file name (e.g. `board.jpg`). It's looked up in the project's media folder automatically. An image on its own line shows full width, which suits plots. Images on consecutive lines form a grid, which suits photos. Clicking any image opens it large. Text in quotes after the file name becomes a caption. Always describe the image in the `[...]` part, because that's what screen readers read out.

**Tables, bold, lists, links and code** all work as normal Markdown.

### Tagging disciplines

`disciplines:` takes one or more of these ids. A project with several ids shows up under each of those filter chips.

| id | Chip label |
|---|---|
| `electronics` | Electronics & PCB |
| `embedded` | Embedded & Control |
| `mechanical` | Mechanical & CAD |
| `ros2-slam` | ROS2 & SLAM |
| `robot-learning` | Robot Learning |
| `simulation` | Simulation |

To add or rename a category, edit `_data/disciplines.yml` (the order there is the chip order). Chips with no projects are hidden automatically.

### Front-matter gotchas

- If a value contains `: ` (colon-space), wrap it in quotes: `result: "Motor A: 2x torque"`.
- Indent with spaces, never tabs.
- `featured_order: 1` / `2` sets the order in the Featured row if you feature more than one.

### Media guidelines

GitHub rejects files over 100 MB and warns above 50 MB. Keep files small so pages load fast on phones.

| Use | Format | Target |
|---|---|---|
| Card loop (`thumbnail_video`) | MP4 (H.264), no audio, 3–8 s | ≤ 2 MB, 720p or less |
| Poster / thumbnail | JPG (or WebP) | ~1600×1000, ≤ 300 KB |
| Gallery photos | JPG | ≤ 2000 px long edge, ≤ 500 KB |
| Share image (`og_image`) | JPG/PNG | 1200×630 |
| Long videos | **YouTube**: `hero: { youtube: VIDEO_ID }` | |

Convert a phone clip into a card loop and poster (with [ffmpeg](https://ffmpeg.org) installed, or via Docker):

```sh
ffmpeg -i clip.mov -t 6 -vf "scale=-2:720,fps=24" -an -c:v libx264 -crf 28 -preset slow -pix_fmt yuv420p -movflags +faststart loop.mp4
ffmpeg -ss 1 -i loop.mp4 -frames:v 1 -q:v 3 poster.jpg
```

Use MP4, not GIF: a 5 MB GIF is usually a 300 KB MP4. Card loops play only while on screen, repeat three times and then stop (hovering replays them), and never autoplay for visitors who have reduced motion turned on.

---

## Edit the rest of the copy

| What | Where |
|---|---|
| Greeting and title line at the top | `_config.yml`, under `author:` |
| About paragraph (under the title line) | `index.md` |
| GitHub / LinkedIn / Substack / CV links, email | `_config.yml`, under `links:` and `author.email` (set a link to `""` to hide it) |
| CV | Replace `assets/cv/Samuel_Amos_Osebeyo_CV.pdf`. Keep the same file name, or update `links.cv` in `_config.yml` to match the new one |
| Share image | `assets/img/og-default.png` (see below) |
| Favicon | `assets/img/favicon.svg` (+ `favicon-32.png`, `apple-touch-icon.png`) |

### The share image

When someone pastes your site link into LinkedIn, Slack, WhatsApp and so on, those apps show a preview card with an image, title and description. `assets/img/og-default.png` is that image for the home page and the Writing tab. It's a 1200×630 card with your name, title line and focus areas. Project pages use the project's thumbnail instead (if it's a JPG or PNG), so a shared project link previews with its own picture. To replace it, drop in any 1200×630 PNG or JPG with the same file name.

---

## Colours and fonts

The site uses the **Oak & Sage** palette (warm off-white, sand cards, light-oak lines, sage green accents, one terracotta "pop" for In Progress) with **Fraunces** headings and **Inter** body text.

All colours, fonts, sizes and spacing live in **`assets/css/tokens.css`**. `main.css` only uses those variables, so you can change a colour or font in one place without touching any layout. If you change a text colour, check it still has enough contrast (≥ 4.5:1) with a tool like <https://webaim.org/resources/contrastchecker/>.

---

## Writing tab (Substack)

`/writing/` lists Substack posts as cards (cover, date, title, subtitle) that open on Substack, with a Subscribe button underneath.

- **Automatic:** `links.substack` in `_config.yml` is set to `https://samos76.substack.com`. The **Sync Substack posts** GitHub Action (`.github/workflows/substack-sync.yml`) reads your feed daily, updates `_data/substack.json` and rebuilds the site. To run it immediately: GitHub → **Actions** → *Sync Substack posts* → **Run workflow**.
- **Manual:** edit `_data/substack.json`, or run `python scripts/substack_sync.py` locally.
- GitHub pauses scheduled workflows after 60 days without repo activity. If posts stop appearing, re-enable the workflow on the Actions tab.

---

## Deploy to GitHub Pages

This repo is `SAMOS-76/SAMOS-76.github.io`, so it publishes at **https://samos-76.github.io**.

1. Commit and push to `main`.
2. On GitHub, go to **Settings → Pages → Build and deployment → Source: "Deploy from a branch"**, **Branch: `main` / `/ (root)`**, and save.
3. Wait about a minute (progress shows on the **Actions** tab), then open the site.

After that, every push to `main` redeploys automatically.

**Custom domain (later):** add a file named `CNAME` containing just your domain (e.g. `samuel.dev`), point your DNS at GitHub Pages ([docs](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site)), and update `url:` in `_config.yml`.

**Check the LinkedIn preview:** after deploying, paste a URL into <https://www.linkedin.com/post-inspector/>. That also refreshes LinkedIn's cache.

---

## Before launch

- [x] Replace the placeholder projects: delete `_projects/placeholder-*.md` and `assets/projects/placeholder-*/`
- [ ] Replace the CV PDF
- [ ] Replace `assets/img/og-default.png` if you want a custom share image
- [ ] Test on a phone, and test a link preview in LinkedIn's Post Inspector

---

## Where things live

```
_config.yml              site settings, your details, links
index.md                 About paragraph (home page)
writing.html             /writing/ page
404.html                 not-found page
_projects/               one .md per project          ← you edit these
_templates/project.md    copy-paste template for new projects
_data/disciplines.yml    filter chips
_data/substack.json      Substack posts (auto-synced)
_layouts/                page templates (home, project, page, default)
_includes/               pieces: cards, media, gallery, head/SEO, icons…
assets/css/tokens.css    ALL colours, fonts, spacing
assets/css/main.css      layout (uses tokens only)
assets/js/               filter, video, lightbox
assets/projects/<slug>/  each project's media
assets/img/              favicon, share image
assets/cv/               CV PDF
scripts/substack_sync.py feed → _data/substack.json
```
