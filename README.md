# ML-based-Power-Profiling
The repository contains code designed to profile the power consumption of a host system. Aim of the project is providing a comprehensive overview of system performance in one click. The profiling includes real-time power measurements, overall energy consumption for particular programs, runtime statistics, CPU and memory utilization, as well as cache misses and latency metrics. The aim of this project is to consolidate all performance-affecting parameters into a single interface, delivering them no longer than runtime constraints. This work facilitates the enhancement of workload design by offering comprehensive insights into performance factors.

# Power Profiling
The power profiling begins operation by collecting host specifications and matching those to the trainning set in order to calculate the real-time power consumption from the trained model based on CPU utilization.
The trained model is based on the following polynomial equation:

              ![image](https://github.com/amina-nasrin/ML-based-Power-Profiling/assets/25388169/c12c99cc-52f1-4830-9e33-aad9f6217c35)
