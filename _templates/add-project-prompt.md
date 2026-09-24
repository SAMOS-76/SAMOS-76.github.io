Add a new project to my portfolio website.

## The project (fill in)
- Project name:
- GitHub repo:
- Substack write-up(s), if any:
- Extra media (photos/videos/GIFs) and where they are, if not in the repo:
- Status: shipped / in-progress
- Award or recognition, if any:
- When I built it (year/month) and context (e.g. uni module, internship, personal):
- Anything else you should know (what I'm proudest of, what broke, what to emphasise):

## About the site
- Repo: C:\Users\soseb\OneDrive\Documents\SAMOS-76.github.io (GitHub Pages user site, live at https://samos-76.github.io). It's Jekyll with a `projects` collection.
- A project is ONE Markdown file `_projects/<slug>.md` plus ONE media folder `assets/projects/<slug>/`. The slug is lowercase-with-dashes.
- Start from `_templates/project.md`. Read the README's "Add a project" section and one existing project first (`_projects/sac-her-bc-rl-finetuning.md` is the best example) and match their style.
- Front matter: `title`, `result` (one line for the card, stating a concrete result), `date` (sets the order in the grid, newest first), `status`, optional `award`, `disciplines`, `tech`, `thumbnail`, `thumbnail_alt`, `thumbnail_video`, `hero` (`video`/`youtube`/`image` + `poster`, `alt`, optional `caption`), `tldr` (2–3 lines, no metric tiles), `links` (`repo`, `writeup`, or custom `{label, url}` entries).
- Disciplines must be ids from `_data/disciplines.yml`: electronics, embedded, mechanical, ros2-slam, robot-learning, simulation. Use as many as genuinely apply.
- The body is plain Markdown under exactly these headings, in this order, and each is optional:
  - `## Overview`: what it is and why.
  - `## Approach`: how it was built, split with `###` subheadings by layer where useful. Put a `### What broke` list here (what went wrong and how I fixed it).
  - `## Results`: what happened; tables and plots welcome.
  - `## Improvements`: what I'd do next (future work only).
- Images: just write `![descriptive alt text](file.jpg "optional caption")`, with the file in the project's media folder. An image on its own line shows full width (use for plots and diagrams). Images on consecutive lines form a 2-column grid (use for photos). Clicking opens a lightbox.
- Videos inside the body: `<video src="clip.mp4" poster="clip-poster.jpg" muted playsinline controls preload="none" data-loop-video aria-label="..."></video>`.
- Colours, fonts and layout live in `assets/css/` and `_layouts/`. Don't touch them for a new project unless I ask.

## How to write it
- Keep the page LIGHT. It should be an overview plus the key findings, then point to GitHub (and Substack, if there's a write-up) for the full detail. End the body with a "**More detail:** …" line linking them.
- Only state what the sources back up (repo README, code, my posts, what I tell you). NEVER invent or round numbers, claims or results. If something's unclear or two sources disagree, keep the wording neutral and ask me.
- Confident and concise, first person, British spelling. No buzzword lists or "passionate about".
- The card `result` line should state a concrete result, e.g. "reached 100% success in 1.6M env-steps, under half the 3.48M baseline", not a vague description.
- Every image and video needs meaningful alt text.
- If the author has flagged a plot or section as unfinished (e.g. "fix graphs"), leave it out and tell me.

## Media
- Pull media from the repo README (including github.com/user-attachments links) and my Substack posts, and look at it before choosing. Pick a card loop that shows the robot doing the thing, and a hero clip that tells the story.
- Convert with ffmpeg. It isn't installed locally, so use Docker (`linuxserver/ffmpeg` image; Docker Desktop must be running). Rules:
  - Never use GIFs on the page: convert to MP4 (H.264, no audio, `-movflags +faststart`).
  - Card loop: ≤ 2 MB, ~720p, 3–8 s.
  - Posters and thumbnails: JPG, ≤ 300 KB.
  - Photos: JPG, ≤ 1400 px long edge.
  - Diagrams and plots: keep as PNG.
  - Long videos: use `hero: { youtube: ID }` instead.
  - Keep the whole project folder to a few MB.
- Watch out: globs like `a2-*` can also match your own temporary files. Use exact filenames.

## Check before handing back
- Preview with `docker compose up` in the repo, then open http://localhost:4000/projects/<slug>/ and the home page. Confirm the card, filters, hero, images, lightbox and links all work, and that nothing scrolls sideways at phone width (390 px).
- Don't commit or push unless I ask.
- When done, tell me:
  - what you added
  - where each claim and number came from
  - anything you left out
  - any questions (dates, disagreements between sources, which clip to feature)
