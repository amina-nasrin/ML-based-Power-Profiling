# ML-based-Power-Profiling
The repository contains code designed to profile the power consumption of a host system. Aim of the project is providing a comprehensive overview of system performance in one click. The profiling includes real-time power measurements, overall energy consumption for particular programs, runtime statistics, CPU and memory utilization, as well as cache misses and latency metrics. The aim of this project is to consolidate all performance-affecting parameters into a single interface, delivering them no longer than runtime constraints. This work facilitates the enhancement of workload design by offering comprehensive insights into performance factors.

## Power Profiling
The power profiling begins operation by collecting host specifications and matching those to the trainning set in order to calculate the real-time power consumption from the trained model based on CPU utilization.
The trained model is based on the following polynomial equation:

![image](https://github.com/amina-nasrin/ML-based-Power-Profiling/assets/25388169/c12c99cc-52f1-4830-9e33-aad9f6217c35)

# Energy Profiling
The energy consumption for a specification program is the product of runtime and amount of power consumption during that program run.

Energy = Power X Runtime

# Runtime
While it's commonly assumed that faster programs are inherently better, our research has revealed a contradiction in this intuition. Through studying how to design workloads to maximize resource utilization efficiency, we've found that prioritizing speed alone may not always lead to optimal outcomes.

![image](https://github.com/amina-nasrin/ML-based-Power-Profiling/assets/25388169/c2084fe8-231f-40f1-ae44-c0809aa0a775)

From the presented comparion, we provide support for our theory. The optimized version has slightly higher runtime than the basic version but lower power consumption.

# CPU utilization
One important aspect of workload designing is adjusting CPU utilization to ensure maximum resource utilization. This framework presents CPU utilization for a particular program run at an interval of 10sample/second. It provides insight on how the program is occupying the processors to execute the program and reveals potential scopes imporvement. 

![image](https://github.com/amina-nasrin/ML-based-Power-Profiling/assets/25388169/b46dfe3e-17f1-4777-832e-e5566c967cfa)

# GPU utilization
In order to provide over all system performance analysis, we have done GPU utilization and GPU power consumption monitoring by using nvml - NVIDIA management library. But that portion of the work is not incorporated with this project yet.

# memory utilization
System performance relies largly on memory utlization and communication. So, we have done an examination of DRAM power consumption separately. This is yet to be incorporated with this work.

# cache misses
Yet to develop.

# latency
Yet to develop.
