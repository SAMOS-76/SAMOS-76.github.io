---
title: "Franka VR Teleoperation at Europe Embodied"
result: "In a 48-hour hackathon I set up a Franka Panda from scratch, built Meta Quest 3 teleoperation for it in a day, and we collected over 100 demonstrations for policy training."
date: 2026-06-26
status: shipped
featured: false

disciplines: [robot-learning]
tech: [Franka Panda, Meta Quest 3, Oculus Reader, ADB, Polymetis, libfranka, ZeroRPC, PREEMPT_RT, LeRobot, HIL-SERL, Python]

thumbnail: thumb.jpg
thumbnail_alt: "Franka Panda arm reaching down towards a small white block while teammate Nathan Petrou holds a Meta Quest 3 controller beside it"
thumbnail_video: loop.mp4

hero:
  video: hero.mp4
  poster: hero-poster.jpg
  alt: "Teammate Nathan Petrou stands beside a Franka Panda holding a Meta Quest 3 controller, with the headset round their neck. As they move the controller, the arm follows, lowering its gripper onto a small white block on the table."
  caption: "Nathan teleoperating the Panda with a Quest 3 controller through my pipeline: the arm follows the hand in real time."

tldr: >-
  My first hackathon: 48 hours in Munich at Europe Embodied 2026, on the Intel
  Industrial Robotics Arm Challenge. I set up a Franka Panda from scratch and
  built a low-latency Meta Quest 3 teleoperation and data-collection pipeline in
  a day, all on one PC. Our HIL-SERL policy didn't work in time, but the pipeline did.

links:
  event:
    label: "Europe Embodied"
    url: https://europe-embodied.com/
  post:
    label: "LinkedIn post"
    url: https://www.linkedin.com/feed/update/urn:li:activity:7478721277323685888/
---

## Overview

In June 2026 I competed in the [Europe Embodied](https://europe-embodied.com/) hackathon in Munich with [Alex Zheng](https://www.linkedin.com/in/alexz3/), [Natalie Chan](https://www.linkedin.com/in/nataliefwc/) and [Nathan Petrou](https://www.linkedin.com/in/nathan-petrou-8a3b13253/). We took on the Intel Industrial Robotics Arm Challenge: 48 hours to teach a Franka Panda arm an industrial pick-and-place task.

Rather than going for something simple, we went after a Human-in-the-Loop Sample-Efficient RL (HIL-SERL) policy through LeRobot, where the robot keeps learning on real hardware with a person stepping in to correct it. That needs demonstrations and interventions, so it needs good teleoperation. That's the part I built.

## Approach

### Setting up the Panda

I set the Franka Panda up from scratch. Its real-time control interface, libfranka, expects a PREEMPT_RT real-time kernel, which usually means running robot control on its own machine. Instead, I built a PREEMPT_RT kernel from source, modified its configuration and set up the NVIDIA drivers on it, so the Franka control, teleoperation and data collection all ran together on a single PC. Kernel builds are slow, but I had the whole setup finished in a couple of hours.

### Quest 3 teleoperation

In a day I built the full teleoperation pipeline for our setup. I started from an existing Meta Quest 3 pipeline (Oculus Reader, which streams controller poses over ADB) and heavily adapted it: I interfaced it with our control stack, reworked it to run on a single machine, and hooked it into data collection. Control runs through Polymetis (real-time control over libfranka) behind a ZeroRPC interface, and the result was low-latency control of the arm straight from the Quest controller.

### Data collection

The same pipeline recorded demonstrations in LeRobot format, and we collected over 100 demonstration trajectories to train our policies.

### What broke

- **Getting the data into the right shape.** Our biggest blocker was working out the format the data and the reward classifier needed to be in for HIL-SERL.
- **Time.** We simply didn't have enough time to collect enough data for the policy.

## Results

- **The pipeline worked.** The teleoperation, data collection and real-time arm control all ran on one PC, and we collected over 100 demonstrations with it.
- **The policy didn't, yet.** We didn't get a working policy before the deadline. In this HIL-SERL rollout the arm hovers over the part without picking it up:

<video src="policy.mp4" poster="policy-poster.jpg" muted playsinline controls preload="none" data-loop-video aria-label="Portrait clip of our HIL-SERL policy running on the Franka Panda: the gripper hovers and nudges around a small white part on the table without grasping it, shown from two camera angles"></video>

We didn't win, but I'm pretty sure we had the most fun of anyone there. It was my first hackathon, my first time on a real research robot, and my first time training policies like this, and I spent the week around people from all over the world who are just as obsessed with robotics.

![The four of us grinning at the camera in front of the Franka Panda, one holding a Meta Quest 3 headset round their neck](team.jpg "The team left to right: me, Natalie Chan, Alex Zheng and Nathan Petrou")

## Improvements

- **Sort out the data and reward-classifier format up front,** so the time goes into collecting data and training HIL-SERL on the arm.
- **Open-source my Quest 3 teleoperation adaptations.**

**More detail:** I wrote about the week [on LinkedIn](https://www.linkedin.com/feed/update/urn:li:activity:7478721277323685888/).
