---
# Copy this file to _projects/<slug>.md  (slug = lowercase-with-dashes, e.g. so101-policy)
# and put images/videos in assets/projects/<slug>/.  Delete anything you don't need.

title: "Project name"
result: "One line for the project card: what it does and the concrete result."
date: 2026-01-01              # sets the order in the grid (newest first)
status: shipped               # shipped | in-progress
featured: false               # true = also shown in the Featured row at the top
# award: "Runner-up · The Big Bang Competition 2022"   # optional highlight on the card (keep it short)

disciplines: [electronics]    # electronics | embedded | mechanical | ros2-slam | robot-learning | simulation
tech: [KiCad, STM32, C]

thumbnail: thumb.jpg          # card image
thumbnail_video: loop.mp4     # optional short muted loop for the card (thumbnail shows until it plays)

hero:                         # optional big media at the top: use ONE of these
  video: hero.mp4
  # youtube: VIDEO_ID
  # image: hero.jpg

tldr: >-
  Two or three lines: what you built and how it turned out.

links:                        # optional buttons at the bottom
  repo: https://github.com/SAMOS-76/...
  writeup: https://samos76.substack.com/p/...
  # custom label:
  # part_2:
  #   label: "Part 2 on Substack"
  #   url: https://samos76.substack.com/p/...
---

## Overview

What the project is and why you did it.

## Approach

How you built it, including what broke and how you fixed it.
Use ### subheadings if it spans layers (### Electronics, ### Software) or for a ### What broke list.

## Results

What happened. Images: put the file in assets/projects/<slug>/ and write

![Describe the image](board.jpg "Optional caption")

Images on consecutive lines become a grid:
![Top of the board](board-top.jpg)
![Bottom of the board](board-bottom.jpg)

## Improvements

What you'd do next.
