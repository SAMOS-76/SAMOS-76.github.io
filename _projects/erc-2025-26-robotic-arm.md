---
title: "Robotic Arm Redesign for the European Rover Challenge 2025–26"
result: "I led a team of four to redesign our rover's arm. On my V3 board and a ROS 2 / MoveIt 2 control stack, it picks up a plushie driven from a game controller."
date: 2026-05-21
status: shipped

disciplines: [electronics, embedded, ros2-slam, simulation, mechanical]
tech: [ESP32, FreeRTOS, ROS 2, MoveIt 2, ros2_control, URDF, RViz, Molex connectors, XT30, Stepper motors, Servos, 3D printing]

thumbnail: thumb.jpg
thumbnail_alt: "The redesigned rover arm reaching down to a bench and lifting a black-and-orange octopus plushie in its gripper"
thumbnail_video: loop.mp4

hero:
  video: hero.mp4
  poster: hero-poster.jpg
  alt: "The finished arm on a lab bench reaches down, grips a black-and-orange octopus plushie and lifts it high. Inserts show the arm moving in simulation and the V3 board."
  caption: "The finished arm picking up a plushie, driven with a game controller."

tldr: >-
  For the 2025–26 season I was promoted to robotic arm lead at the Imperial
  Planetary Robotics Lab and redesigned the whole arm with a team of four. I
  led the design and management, built the V3 control board and moved the
  arm's control into ROS 2 with a custom MoveIt 2 pipeline, then assembled the
  arm and prototyped parts so we could test before the aluminium arrived.

links:
  last_year:
    label: "Last year's arm electronics (2024–25)"
    url: /projects/erc-robotic-arm-electronics/
  event:
    label: "European Rover Challenge"
    url: https://roverchallenge.eu/
---

## Overview

After [last season](/projects/erc-robotic-arm-electronics/), I was promoted to robotic arm lead for the Imperial Planetary Robotics Lab (IPRL) team at the [European Rover Challenge](https://roverchallenge.eu/). With three team members I chose, we redesigned the entire arm. I set the overall design vision and managed the team, and I stayed in charge of the electronics and control.

## Approach

### The arm

My mechanical engineers designed their parts and I assembled the arm. It's driven by high-torque stepper motors, with 3 mm sheet metal in the base, machined aluminium extrusion for the joint inserts, and 3D-printed parts.

![The arm's base and shoulder on a lab bench: sheet-metal side plates, a stepper motor, a large belt pulley and a purple 3D-printed shoulder housing](shoulder-side.jpg "Base and shoulder")
![Front view of the shoulder, with the purple 3D-printed housing between the sheet-metal plates and the large belt-driven pulley beside it](shoulder-front.jpg "The shoulder from the front")

<video src="shoulder-test.mp4" poster="shoulder-test-poster.jpg" muted playsinline controls preload="none" data-loop-video aria-label="Close-up of the shoulder joint on the bench, driven by a stepper motor and belt, lifting the purple 3D-printed housing, with stepper drivers and a bench power supply behind"></video>

### Prototyping while we waited for aluminium

I rapid-prototyped 3D-printed jigs so we could keep testing while we waited for the aluminium parts. The white elbow in these photos is my printed prototype, standing in until the pink machined aluminium arrived.

![The arm with a white 3D-printed elbow joining the black upper and lower links, on a bench covered in electronics](proto-elbow-1.jpg "The printed prototype elbow")
![The arm upright on the bench with the white prototype elbow at the top, next to a laptop](proto-elbow-2.jpg "Testing with the prototype elbow")

### V3 arm board

V3 is one of the cleanest PCBs I've made. It keeps the plug-in ESP32 module from V2, so a damaged ESP32 is still a quick swap, and it keeps the ADC. What changed:

- **Molex connectors instead of JST,** so everything is easier to connect.
- **An external XT30 connector for power.**
- **More powerful, faster logic level shifters,** for quick control of the stepper motors.
- **Servo connectors** for the gripper.

![The V3 arm board: a black PCB with the IPRL logo, a plug-in ESP32 module, Molex connectors labelled for the steppers, servos, I2C and ADC, and a yellow XT30 power connector](pcb-v3.jpg "V3")

### Control

The ESP32 still runs an RTOS. The big change is higher up. I replaced our custom inverse-kinematics solver by moving the arm further into ROS 2:

- **A custom URDF of our arm,** so we could move and test it in simulation.
- **A custom MoveIt 2 pipeline** for our use case.
- **Custom ros2_control hardware interfaces** that convert MoveIt's inverse-kinematics output into our standardised serial data structure and send it to the ESP32.

Because the simulation and the robot share that pipeline, dragging the arm in simulation moves the real arm with it:

<video src="sim-drag.mp4" poster="sim-drag-poster.jpg" muted playsinline controls preload="none" data-loop-video aria-label="In the lab, I hold a laptop showing the arm in simulation while someone films on a phone. Behind us, the real arm on the bench moves as I drag its simulated twin around."></video>

## Results

The arm came together: steppers, sheet metal, aluminium and printed parts, driven by the V3 board and controlled through ROS 2. In the demo we drive it with a game controller, and it picks up a plushie from the bench (the clip at the top).

![The finished arm on a busy lab bench: black links, the pink machined aluminium elbow and a purple 3D-printed shoulder housing](final-1.jpg "The finished arm")
![The finished arm from the side, reaching forward, with the pink aluminium elbow](final-2.jpg "With the pink aluminium elbow")
![The finished arm folded, its lower link hanging down from the pink aluminium elbow, with a stepper motor and gearbox mounted at the elbow](final-4.jpg "Folded")
![The wrist from the front: two servos either side of a bevel gear in a pink aluminium housing, held by a white 3D-printed bracket](final-5.jpg "The wrist")
