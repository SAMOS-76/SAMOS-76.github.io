---
title: "Robotic Arm Electronics for the European Rover Challenge 2024–25"
result: "I designed two control boards for our rover's 5-DoF arm. V2 ran the arm at the competition in Poland, where we came 16th overall and first of the UK teams."
date: 2025-08-31
status: shipped

disciplines: [electronics, embedded]
tech: [ESP32-S3, FreeRTOS, I2C, I2C multiplexer, Magnetic encoders, DM332T stepper drivers, MOSFET level shifting, ADC]

thumbnail: thumb.jpg
thumbnail_alt: "Close-up of the rover arm's belt-driven shoulder, elbow joint and wrist moving on a lab bench"
thumbnail_video: loop.mp4

hero:
  video: hero.mp4
  poster: hero-poster.jpg
  alt: "The 5-DoF rover arm on a lab bench, its aluminium links, belt drives and 3D-printed wrist moving through its joints, with stepper motors and loose wiring at the base"
  caption: "An early bench test of the arm in the lab, March 2025."

tldr: >-
  For the 2024–25 European Rover Challenge I was on the Imperial Planetary
  Robotics Lab's robotic arm team, in charge of the arm's electronics and
  firmware. I designed its control board twice: a fully embedded V1 with the
  bare ESP32-S3 chip, then a simpler V2 around a plug-in module that ran the
  arm at the competition in Poland, where we came 16th and first of the UK teams.

links:
  event:
    label: "European Rover Challenge"
    url: https://roverchallenge.eu/
---

## Overview

The [European Rover Challenge](https://roverchallenge.eu/) (ERC) is an international competition for student-built Mars rovers. For the 2024–25 season I was on the robotic arm team of the Imperial Planetary Robotics Lab (IPRL), in charge of the electronics and firmware for the rover's 5-DoF arm.

I designed the board that controls the arm. It reads the joints' magnetic encoders and limit switches, drives the stepper motors through DM332T drivers, reads an analogue pH probe that the arm had to carry for one of the tasks, and talks to the rest of the rover over serial.

## Approach

### What the board had to do

- **Read the magnetic encoders over I2C.** They all have the same I2C address, so they go through an I2C multiplexer.
- **Drive the stepper motors.** The DM332T drivers need 5 V logic, but the ESP32-S3 runs at 3.3 V, so the control signals need level shifting.
- **Read the limit switches and the pH probe,** the probe through an ADC on the board.

### V1: the bare ESP32-S3 chip

V1 put the ESP32-S3 chip itself on the board, so I designed all the circuitry the bare chip needs to run. It was very difficult to design and to assemble, and I learnt a lot from it.

![Assembled V1 arm board: a green PCB with the ESP32-S3 chip, USB-C port, boot and reset buttons, and rows of connectors labelled for the stepper, wrist, servo, encoder and limit-switch inputs](pcb-v1.jpg "V1, assembled")
![The back of the bare V1 board held in a hand, with 'Arm Board' and 'Samuel Osebeyo' printed on the silkscreen](pcb-v1-back.jpg "V1, bare")

### V2: a plug-in ESP32-S3 module

V2 replaced the chip with an ESP32-S3 dev module that plugs into header pins, and replaced V1's level-shifter IC with my own MOSFET level-shifting circuits. This is the board we took to the competition.

![PCB render of the V2 arm board: a header footprint for the plug-in ESP32-S3 module in the middle, with connectors round the edges labelled for the stepper motors, DC motor, encoders, limit switches, servos and pH sensor](pcb-v2.png "V2, as a render")

*Somehow, over the course of the year, I didn't take a single photo of V2 :(*

### Firmware

The ESP32-S3 runs FreeRTOS, with the work split into separate tasks (encoder, motor control, serial and others), each running at its own frequency and priority so the timing stays accurate.

I also designed the serial header used across the whole rover, so communication throughout the rover followed one standard.

### What broke

- **A short I never found.** V1 had a short under its ESD protection IC that I couldn't locate.
- **A level shifter too weak for the drivers.** The level-shifter IC on V1 couldn't drive enough current into the DM332T stepper drivers. V2's custom MOSFET circuits fixed it.
- **A fried board.** Because V2's ESP32-S3 is a plug-in module, we swapped the module instead of replacing the whole PCB.

## Results

V2 worked, and it ran the arm at the ERC in Poland at the end of August 2025. We came 16th overall and first of the UK teams.

<video src="drive.mp4" poster="drive-poster.jpg" muted playsinline controls preload="none" data-loop-video aria-label="Our rover, Bobcat, driving across the rocky Mars-yard terrain at the competition, with tents and spectators behind"></video>

![The arm at the competition with the pH probe mounted beside its gripper, parked on gravel in front of blue tents](arm-ph-probe.jpg "The arm carrying the pH probe")
![The rover on a bench in our pit, covered in wiring, with teammates in IPRL shirts working on it and one on a laptop](pit.jpg "Work in the pit")
![Front view of the rover in the pit, the arm folded at the front with its gripper hanging down and the Bobcat name plate behind](rover-front.jpg "Bobcat, arm folded")
![The team in matching IPRL shirts standing round the rover on the dusty competition ground under the trees](team.jpg "The team round the rover")
