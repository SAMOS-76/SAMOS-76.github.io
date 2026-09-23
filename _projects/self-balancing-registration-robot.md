---
title: "Autonomous Self-Balancing Registration Robot"
result: "I led a team of six to build a two-wheeled balancing robot that roams a venue, finds people and identifies them by face with over 80% accuracy, marking each one on a live map."
date: 2026-06-18
status: shipped
featured: true
featured_order: 3

disciplines: [ros2-slam, simulation]
tech: [ROS 2 Humble, slam_toolbox, robot_localization, Gazebo, InsightFace, FastAPI, WebSockets, Raspberry Pi, LD19 LiDAR, Python]

thumbnail: thumb.jpg
thumbnail_alt: "Two-wheeled self-balancing robot with a camera and LiDAR driving towards a person behind a cardboard wall"
thumbnail_video: loop.mp4

hero:
  video: seeker.mp4
  poster: seeker-poster.jpg
  alt: "Split screen: the software view on the left and the robot in the arena on the right. The robot searches, approaches and identifies a person, then marks their name on the occupancy map."
  caption: "An autonomous face-seeking run. Left: my laptop (terminal, live camera with face boxes, and the map). Right: the robot. It finds me, identifies me and adds “Samuel” to the map next to an earlier match, “CL”."

tldr: >-
  An Imperial EE2 group project (2026) to take the queue out of event
  registration: a two-wheeled inverted-pendulum robot that maps a venue, seeks
  out attendees and recognises them by face. I led the team of six, owned the
  face recognition and web UI, co-developed the mapping stack in ROS 2, and
  integrated the subsystems for the demo.

links:
  repo: https://github.com/ZTHCS-Jr
  server:
    label: "Server: web UI and face recognition"
    url: https://github.com/ZTHCS-Jr/EE2-Balance-Robot-Server
  mapping:
    label: "Mapping and face seeker (ROS 2)"
    url: https://github.com/ZTHCS-Jr/EE2-Balance-Robot-LiDAR
---

## Overview

Registration queues at conferences grow with attendance. Our answer was a robot that does the registering itself: it drives around the venue, finds people, recognises who has registered and who hasn't, and puts each person on a shared map.

The robot is a two-wheeled inverted pendulum, balanced by an ESP32 controller, carrying a Raspberry Pi, a camera and an LD19 2D LiDAR. As team lead, I owned the perception pipeline and the web UI, co-developed localisation and mapping, designed how compute was split across machines, and integrated the subsystems against a fixed demo deadline.

## Approach

### System architecture

The Pi is only a sensor relay. It streams LiDAR scans and wheel and gyro data over UDP, and camera frames over a WebSocket, to a laptop base station that runs SLAM and face recognition. Velocity commands go back to the Pi and on to the ESP32, with a 0.5 s deadman that stops the motors if commands stop arriving. A FastAPI server ties it together: WebSockets carry telemetry, video, joystick control and detections between the robot, the browser and ROS.

### Face recognition

An SCRFD detector finds faces, and ArcFace turns each one into a 512-dimensional embedding. Embeddings are unit length, so cosine similarity against every enrolled person is a single matrix multiplication followed by an argmax. I chose InsightFace's heavier `buffalo_l` model over the faster `buffalo_s`, trading speed for precision to avoid false identifications. Only embeddings are stored, so no raw facial images persist.

Enrolment takes front, left and right captures. Here my teammate [Carys Leung](https://www.linkedin.com/in/carys-leung/) registers herself:

<video src="enrolment.mp4" poster="enrolment-poster.jpg" muted playsinline controls preload="none" data-loop-video aria-label="The web dashboard's enrolment panel: a teammate types her initials, captures her face from the front, left and right, and is added to the saved-people list"></video>

### Localisation and mapping

I benchmarked slam_toolbox against Cartographer in Gazebo, against ground-truth geometry, and we went with slam_toolbox. An EKF (robot_localization) fuses wheel-encoder velocity with gyro yaw rate into odometry, and slam_toolbox corrects that with LiDAR scan matching and loop closure. I integrated wheel encoders instead of double-integrating the accelerometer, so dead-reckoning drift grows linearly rather than quadratically.

<video src="mapping.mp4" poster="mapping-poster.jpg" muted playsinline controls preload="none" data-loop-video aria-label="Driving the robot by joystick from the web dashboard's camera view, then the finished occupancy map of the arena in RViz"></video>

### Autonomy

A state machine drives the face seeker: rotate to scan, wander with obstacle avoidance, approach the largest face, hold still while it tallies identity votes, then move on. Each person it greets is marked on the map, green if recognised and red if unknown, and the Pi plays a registered or not-registered greeting.

### What broke

- **explore_lite couldn't keep up.** I measured 2 s map-update latency and repeated loss of localisation, so I replaced it with a custom frontier explorer.
- **Balancing wobble smeared the map.** Scans are now dropped whenever the body pitch passes a threshold.
- **Walls appeared twice in the map.** Stricter loop-closure thresholds, a finer scan cadence and slower driving past featureless walls fixed it.
- **Absolute IMU yaw drifted.** The EKF fuses only yaw *rate* from the gyro, and forward velocity only from the wheels.
- **Sending the map as JSON bottlenecked the browser.** Parsing the occupancy-grid arrays was slow, so the server renders the grid, with name labels, to a compressed PNG instead.

## Results

- **Over 80% recognition accuracy**, at **1140 ms** from detection to embedding.
- In the demo run above, the robot searched the arena, approached me, identified me and marked "Samuel" on the live map, next to an earlier match.

**More detail:** the code and documentation for each subsystem are [on GitHub](https://github.com/ZTHCS-Jr), especially the [server](https://github.com/ZTHCS-Jr/EE2-Balance-Robot-Server) (web UI and face recognition) and the [mapping and face-seeker stack](https://github.com/ZTHCS-Jr/EE2-Balance-Robot-LiDAR).
