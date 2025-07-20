# Schedule Visualization iTwin | CR Prototyping Project

## Project Overview

This project involves the development of a scheduling visualization application utilizing the Bentley iTwin platform. It aims to address critical challenges in construction and campus management by providing a dynamic 3D visualization of construction timelines and progress. The application integrates 3D building elements with scheduling data to enable efficient project oversight and proactive decision-making. This prototype serves as a practical implementation related to research on low-cost façade metrology.

## Problem Statement

The construction industry frequently encounters issues that impede project efficiency, such as unforeseen delays, difficulties in adapting to scope changes, inefficient resource allocation, and a lack of accurate data for informed decision-making. This project seeks to mitigate these problems through enhanced visualization and data integration.

## Project Goal

The primary goal of this project is to develop a robust scheduling visualization application on the iTwin platform. This application provides clear visual representations of task statuses (on-time or delayed) within a 3D environment, facilitates real-time project progress monitoring, and allows for direct input of scheduling data through the user interface.

## Concept & Implementation

The project's core concept involves leveraging the iTwin Platform to synchronize 3D building models with scheduling information. This is achieved by acquiring scheduling data from a CSV file (e.g., `steps.csv`), which includes details like start/finish dates and element IDs. These IDs are then linked to corresponding 3D building elements on the iTwin platform. The visualization is rendered using the iTwin Viewer, with custom code written in TypeScript and React handling data integration, visualization logic, and user interaction.

## Technologies & Components Used

* **Platform:** Bentley iTwin Platform
* **Viewer:** Bentley iTwin Viewer
* **Frontend Framework:** React
* **Programming Language:** TypeScript
* **Development Environment:** Visual Studio Code
* **Data Format:** CSV (for scheduling information)
* **UI Library:** React Table
* **Modeling/Import:** Revit (for 3D models)
* **Version Control:** Git

## Functionality Showcase

The prototype offers an interactive 3D visualization experience, allowing users to observe the construction process dynamically. Key functionalities include:
* **Real-time Progress Tracking:** Monitors the completion status of individual construction tasks based on predefined steps.
* **Visual Status Indicators:** Clearly highlights on-time tasks in green and delayed tasks in red within the 3D model.
* **Timeline Feature:** Presents a chronological sequence of construction activities for analysis and identification of critical milestones.
* **User Interface:** Features a timetable, an interactive 3D model viewer, and widgets for managing building elements and selecting levels.

## Related Publication

This project's prototyping work is closely related to the following research paper:

* **Title:** Photogrammetry for Façade Metrology: A Low-Cost Approach
* **Authors:** Saad Ahmed, Tobias Grüters, Tikva Schumacher
* **Publisher:** RWTH Aachen University Publications
* **Publication Date:** 2024
* **Full Paper:** [https://publications.rwth-aachen.de/record/990627/files/990627.pdf](https://publications.rwth-aachen.de/record/990627/files/990627.pdf)

## How to Run (Basic Setup)

To set up and replicate the project, you would generally follow these steps:

1.  **Set Up iTwin Environment:**
    * Visit the [iTwin Platform website](https://developer.bentley.com/products/itwinjs/) and sign up for an account.
    * Create a new project on your iTwin dashboard.
    * Install necessary plugins and software tools for iTwin integration.

2.  **Import 3D Models:**
    * Obtain 3D models (e.g., from Revit or iTwin samples).
    * Import models into the iTwin platform and assign appropriate ElementIDs and ModelIDs.

3.  **Define Construction Steps:**
    * Prepare a `CSV` file (e.g., `steps.csv`) containing step titles, descriptions, start/finish dates, ElementIDs, ModelIDs, and new start dates.
    * Retrieve ElementIDs and ModelIDs from the iTwin platform using the IModelConsole.
    * Upload the CSV file to the code directory.

4.  **Integrate Custom Code:**
    * Integrate the custom TypeScript/React code into your development environment (Visual Studio Code).
    * The code parses the CSV, retrieves 3D models, and visualizes the construction process within the iTwin Viewer.
    * Key files include `App.tsx` (main component, authentication, viewer setup), `RenderScheduleScriptsApi.ts` (viewport interaction), `RenderScheduleScriptsViewSetup.ts` (view setup, data querying), and `ShowScheduleScriptsWidget.tsx` (widget rendering with `react-table`).

## Conclusion and Outlook

This construction management prototype, developed using the iTwin platform, represents a significant step in leveraging digital technologies for enhancing project management. While successful in achieving its defined work packages, future advancements are planned to develop a fully integrated application that streamlines data entry, includes advanced features like resource management and cost estimation, and further empowers stakeholders with comprehensive project insights.
