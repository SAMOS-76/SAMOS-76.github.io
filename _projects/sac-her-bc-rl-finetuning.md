---
title: "SAC + HER from Scratch, and BC → RL Finetuning"
result: "Finetuning a behaviour-cloned policy with my own SAC + HER reached 100% pick-and-place success in 1.6M env-steps, under half the 3.48M demo-seeded RL needed."
date: 2026-08-20
status: shipped
featured: true
featured_order: 1

disciplines: [robot-learning, simulation]
tech: [Python, PyTorch, SAC, HER, panda-gym, PyBullet]

thumbnail: thumb.jpg
thumbnail_alt: "Simulated Franka Panda arm picking up a green cube"
thumbnail_video: loop.mp4

hero:
  video: comparison.mp4
  poster: comparison-poster.jpg
  alt: "Pick-and-place rollouts from four policies on the same scenes"
  caption: "Same scenes, different policies: the scripted expert, SAC + HER with no demonstrations (it only pushes), demo-seeded SAC + HER, and BC → RL finetuning."

tldr: >-
  I implemented SAC + HER from scratch, then used it to compare four ways of
  teaching a simulated Franka Panda arm to pick and place a cube from sparse
  reward. Plain RL learned to push instead of lift, behaviour cloning degraded
  sharply outside its demonstrations, and finetuning the BC policy with RL
  reached 100% success at under half the environment steps of demo-seeded RL.

links:
  repo: https://github.com/SAMOS-76/SAC-Implementation-and-BC-RL-tuning
  part_1:
    label: "Part 1 on Substack: SAC + HER from scratch"
    url: https://samos76.substack.com/p/implementing-sac-her-from-scratch
  part_2:
    label: "Part 2 on Substack: RL finetuning research"
    url: https://samos76.substack.com/p/rl-finetuning-research-with-custom
---

## Overview

The task is panda-gym's `PandaPickAndPlace-v3`: a simulated Franka Panda has to pick up a cube and place it at a goal. The reward is sparse (0 if the cube is within 5 cm of the goal, −1 otherwise), so plain RL has to stumble on a complete pick-and-place by chance. That makes it a good small testbed for comparing demonstrations, RL, and combinations of the two.

In-distribution success hides *how* a policy solves the task, so every policy was also swept further and further outside the region it was trained on, on the same fixed, paired set of scenes, with a privileged scripted expert as the feasibility ceiling.

## Approach

- **SAC + HER from scratch**, written from the original papers and debugged on Gymnasium tasks (CartPole, Mountain Car, Lunar Lander) before moving to the arm.
- **Demonstrations** from a scripted, privileged-state expert: 200 successful episodes.
- **Four training strategies:** SAC + HER with no demonstrations; behaviour cloning (BC); SAC + HER with its replay buffer seeded with the demonstrations; and BC → RL finetuning, which loads the BC policy into SAC + HER and keeps training.

### What broke

- **Three weeks of unstable training came down to one line.** The temperature (alpha) loss used `log_alpha.exp()`, which scaled its gradient by alpha itself, so updates vanished when alpha was small and exploded when it was large. Optimising `log_alpha` directly fixed it.
- **Naive finetuning destroyed a 93%-success BC policy in about 8 gradient updates.** The fresh critic dragged the actor away from the demonstrated actions, and a lower learning rate only delayed the collapse. The fix was a critic warm-up on the demonstrations plus a BC anchor term in the actor loss, scaled by the critic's value estimate (`bc_weight` 0.4).

## Results

| Approach | In-distribution success | Training cost |
|---|---|---|
| SAC + HER, no demonstrations | 52% | 2.3M env-steps |
| Behaviour cloning | 95% | 3,533 demo transitions |
| SAC + HER, demo-seeded | 100% | 3.48M env-steps |
| **BC → RL finetune** | **100%** | **1.6M env-steps** |

- **Plain SAC + HER learned to push, not lift.** In 120 instrumented episodes it never raised the cube above 0.023 m (it rests at 0.020 m): 100% success on a nearly flat goal, 0% on every goal above it.
- **BC only generalises as far as its demonstrations:** 95% in distribution, but 13% at the edge of the sweep and 1% at a goal 59% above the training ceiling.
- **Demonstrations fix exploration** whether they seed the replay buffer or initialise the policy.
- **BC → RL finetuning matched demo-seeded SAC + HER at under half the environment steps**, and at the hardest goal height it won 99 of the 100 scenes BC failed.

![Line chart of success rate against object and goal distance from the table centre. The finetuned and demo-seeded policies stay near 100% up to 0.20 m and above 90% at 0.25 m; BC falls to 13% at 0.30 m; plain SAC + HER stays below 50% throughout.](ood-radius.png "Moving the object and goal further from the table centre")

![Line chart of success rate against goal height. Plain SAC + HER drops from 100% at 0.05 m to 0% above it; BC holds around 95% up to 0.25 m, then falls to 1% at 0.35 m; the finetuned and demo-seeded policies stay above 95%.](ood-height.png "Raising the goal above the table")

## Improvements

- This task may be too simple to show a real gap between BC → RL finetuning and demo-seeded RL. Next, I'd retest everything on a more complex environment to see whether that gap grows.

**More detail:** the implementation story is in [Part 1](https://samos76.substack.com/p/implementing-sac-her-from-scratch), the finetuning research is in [Part 2](https://samos76.substack.com/p/rl-finetuning-research-with-custom), and the code, with commands to reproduce every result, is [on GitHub](https://github.com/SAMOS-76/SAC-Implementation-and-BC-RL-tuning).
