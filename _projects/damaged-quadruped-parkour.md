---
title: "Parkour for Damaged Quadrupeds"
result: "Rebuilt a damage-adaptive quadruped parkour pipeline in Isaac Lab and deployed my policy on a Unitree Go2, which climbs boxes with varying damages."
date: 2026-09-01
status: in-progress

disciplines: [robot-learning, simulation]
tech: [Isaac Lab, Isaac Gym, PyTorch, PPO, DAgger, Multi-GPU training, Unitree Go2, Intel RealSense D435, NVIDIA Jetson Orin, Python]

thumbnail: thumb.jpg
thumbnail_alt: "Unitree Go2 quadruped climbing onto a low wooden box in a lab"
thumbnail_video: loop.mp4

hero:
  video: hero.mp4
  poster: hero-poster.jpg
  alt: "A Unitree Go2 with its front-left leg motor locked runs in from the right, climbs onto a low wooden box and steps off the far side, twice."
  caption: "My Isaac Lab-trained policy on the Go2 with its front-left leg motor locked, climbing a box on two separate runs."

tldr: >-
  A June–September 2026 research internship in Imperial's Adaptive & Intelligent
  Robotics Lab, on teaching a quadruped to do parkour while damaged. I rebuilt
  the whole training pipeline in Isaac Lab, restructured the damage catalogue
  so every damage actually challenges the policy, and built the sim-to-real
  pipeline to deploy on a Unitree Go2.

links:
  lab:
    label: "Adaptive & Intelligent Robotics Lab"
    url: https://www.imperial.ac.uk/adaptive-intelligent-robotics/
---

## Overview

From June to September 2026 I worked as an Undergraduate Robotics Researcher in the [Adaptive & Intelligent Robotics Lab](https://www.imperial.ac.uk/adaptive-intelligent-robotics/) at Imperial College London, supervised by Antoine Cully. I continued an existing research project: getting a quadruped to do extreme parkour, such as climbing boxes and crossing gaps, even when it's damaged, for example with a weak or locked motor or a faulty sensor.

Learning-based parkour controllers assume an intact robot, and damage-tolerant controllers mostly stay on flat or rough ground. The project aims for both in one policy generalist policy.

The original was built in Isaac Gym. My job was to reproduce the entire project in Isaac Lab, improve on it, and get it running on a real Unitree Go2.

## Approach

### The pipeline

1. **Parkour base policy.** Train a parkour policy with [Eurekaverse](https://arxiv.org/abs/2411.01775), where an LLM writes progressively harder terrains. As a by-product, this gives a lineage of terrains from easiest to hardest, which the later stages reuse as a curriculum.
2. **Damage experts.** Train expert policies on damages from a predefined damage catalogue, each starting from the base policy.
3. **Damage distillation.** Distil the experts into a single policy that has to handle every damage without being told which one it has.
4. **Depth distillation.** Distil again so the final policy does parkour from a single depth camera, instead of the privileged terrain information it has in simulation.

The base policy on an intact Go2:

<video src="intact.mp4" poster="intact-poster.jpg" muted playsinline controls preload="none" data-loop-video aria-label="An undamaged Go2 climbs onto a stack of black boxes and walks across it, then, in a second clip, climbs onto a wooden box and jumps down the other side"></video>

### Porting to Isaac Lab

Isaac Gym is NVIDIA's older simulator. I reproduced every stage of the pipeline in its successor, Isaac Lab, and learnt multi-GPU training to run it across two NVIDIA RTX PRO 6000 Blackwell GPUs.

### Reworking the damage catalogue

Once the port was working, I looked at how much each damage in the catalogue actually hurt the base policy. Many barely degraded it at all, so the experts trained on them wasted training time and took up damage space without learning any recovery. I restructured the catalogue to be harder, so that most damages now degrade the base policy and every expert has a damage to adapt to.

### Sim-to-real on the Go2

I spent a large share of the internship on the sim-to-real pipeline that takes a policy trained in simulation and runs it on the Unitree Go2: onboard an NVIDIA Jetson Orin, with depth from an Intel RealSense D435 mounted on the robot.

### What broke

- **The original project struggled to generalise across damages.** Part of the cause was damages that never challenged the base policy, which is what the catalogue rework addresses.
- **Depth distillation lost a lot of performance.** Swapping privileged terrain information for a depth camera degraded the policy. This is what I'm working on now (see Improvements).
- **Plenty of real runs failed before any worked.** A few of them:

<video src="fails.mp4" poster="fails-poster.jpg" muted playsinline controls preload="none" data-loop-video aria-label="Three failed runs on the Go2: it falls over before reaching a stack of boxes, crash-lands off the far side of the stack after climbing it, and tumbles off after climbing from a wooden box onto the stack"></video>

## Results

- **On hardware,** the Go2 climbed a box with its front-left leg motor locked (the video at the top).
- **In Isaac Lab,** with its front-left leg dead, the robot still crosses gaps and climbs mounds:

<video src="sim-damage.mp4" poster="sim-damage-poster.jpg" muted playsinline controls preload="none" data-loop-video aria-label="A simulated Go2 in Isaac Lab holding up its dead front-left leg hops across a line of raised blocks separated by gaps, then climbs a series of mounds"></video>

### What I learnt

- **Research practice:** reading papers critically, forming a scientific hypothesis, and designing experiments that test it properly.
- **Multi-GPU training**, on two RTX PRO 6000 Blackwell GPUs.
- **Sim-to-real deployment** on a real quadruped, the Unitree Go2. Hardware at this level is almost impossible for a student to get hands-on time with.

## Improvements

- **Dropping depth distillation.** I'm now working on world-model-based perception, so the policy trains on a simulated view of the depth camera from the start and no longer needs a separate depth distillation stage.
