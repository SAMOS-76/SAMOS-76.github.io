---
title: "House Helping Robot"
result: "A low-cost, voice-controlled mobile manipulator: say “grab the vase” and it finds the object with YOLO and a depth camera, solves its arm’s inverse kinematics and retrieves it."
date: 2022-06-01
status: shipped
featured: true
featured_order: 2
award: "Runner-up · The Big Bang Competition 2022"

disciplines: [mechanical, electronics, embedded]
tech: [Raspberry Pi 4, Arduino Nano, Python, YOLOv3-tiny, Intel RealSense, spaCy, 3D printing]

thumbnail: thumb.jpg
thumbnail_alt: "3D-printed robot arm reaching for a potted plant on a desk"
thumbnail_video: loop.mp4

hero:
  video: demo.mp4
  poster: demo-poster.jpg
  alt: "The robot arm reaching for and grabbing a vase on a desk"

tldr: >-
  A home and care-assistant robot I designed and built end to end in 2022,
  during high school: an aluminium-extrusion base, a 3D-printed arm, custom
  drive and arm electronics, and a voice → vision → inverse-kinematics pipeline
  that lets anyone ask it to fetch an object. It came runner-up in the Senior
  Engineering category of The Big Bang Competition.

links:
  repo: https://github.com/SAMOS-76/House-Helping-Robot
---

## Overview

Personal robots like Toyota's HSR can take repetitive, physical tasks off people's hands at home or in care settings. The House Helping Robot (HHR), which I built in high school, was my attempt at an accessible, affordable one, built around four aims:

- **Easy to use:** anyone can operate it without complex training.
- **Cheap and reliable:** affordable enough to run several in a care home.
- **Manoeuvrable:** a base under 45 cm wide, so it fits through standard doorways.
- **Collaborative:** built to assist carers, not replace them.

## Approach

### Mechanical

The frame is aluminium extrusion (a 20 × 20 mm base and a 20 × 80 mm centre column that carries the arm and electronics), with a low centre of mass for stability. Custom parts are 3D printed: PLA wheels with TPU tyres, geared onto the motor shaft through an 8 mm threaded rod, and a fully printed PLA arm (custom apart from James Bruton's open-source gripper).

![CAD render of the full robot: wheeled base, aluminium column and arm](cad-render.png)
![CAD section of a wheel and its internal gear drive](wheel-cad.jpg)
![Printed wheel with red TPU tyre mounted on its drive motor](wheel.jpg)
![The aluminium-extrusion base with both drive motors mounted](base-frame.jpg)

### Electronics

A Raspberry Pi 4 runs the high-level software and talks to an Arduino Nano over serial. The Nano drives two high-torque DC motors through BTS7990 motor drivers, with encoder feedback. The Pi drives the arm's six servos (two shoulder, shoulder rotation, elbow, wrist and gripper) through a PCA9685 servo driver over I²C.

![Base electronics diagram: Raspberry Pi 4 to Arduino Nano over serial, driving left and right motor drivers and motors with encoder feedback](base-electronics.png)

![Arm electronics diagram: Raspberry Pi to a PCA9685 servo driver over I2C, driving six servos](arm-electronics.png)

### Software

1. **Voice:** speech is transcribed to text, and spaCy's dependency parse picks out the object of the sentence ("the vase").
2. **Vision:** YOLOv3-tiny finds that object in the Intel RealSense colour image, and the depth frame gives its distance.
3. **Arm:** a Jacobian inverse-kinematics solver computes shoulder and elbow angles that reach the object while keeping the wrist aligned, and sends them to the arm.

<video src="detection.mp4" poster="detection-poster.jpg" muted playsinline controls preload="none" data-loop-video aria-label="Object detection test: the camera labels a vase and a keyboard with their distances"></video>

### What changed along the way

- **Remote control didn't suit the users.** I first tested remote controls, but they were a poor fit for people with limited dexterity, so the final design is voice-controlled.
- **Early speed tests showed vibration and mechanical stress** in the arm and base, so I tuned the servo and motor responses for smooth motion.

## Results

The finished robot navigated stably, handled objects reliably and responded to voice commands. I entered it in The Big Bang Competition 2022, where it came **runner-up in the Senior Engineering category**.

![The finished House Helping Robot: wheeled base, aluminium column, depth camera and 3D-printed arm](robot.jpg)

<video src="driving.mp4" poster="driving-poster.jpg" muted playsinline controls preload="none" data-loop-video aria-label="The robot driving along a hallway"></video>

## Improvements

- Add **autonomous navigation** and optimise the software's performance.
- Expand the **gripper** so it can handle a wider range of objects and tasks.
- Improve the **enclosure and aesthetics**.

**More detail:** the code and the full build write-up are [on GitHub](https://github.com/SAMOS-76/House-Helping-Robot).
