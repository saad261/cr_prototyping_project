# Schedule Visualization iTwin | CR Prototyping Project

## Project Overview

This project focuses on the development of a robust scheduling visualization application utilizing the Bentley iTwin platform. Designed to address key challenges in campus management within the construction industry, the application aims to streamline project management processes and enhance decision-making through efficient 3D visualization. [cite_start]By synchronizing 3D building elements with scheduling information, it provides a clear visual representation of construction timelines and progress, enabling proactive management of project schedules and resources. [cite: 13, 14, 15, 27, 28, 40, 41, 42]

## Problem Statement

The construction industry often faces challenges that hinder project efficiency and timely completion, particularly in campus management. These include:
* [cite_start]Inability to promptly identify and address unforeseen delays in project schedules[cite: 18, 19].
* [cite_start]Lack of flexibility in traditional scheduling methods to adapt to frequent scope changes[cite: 20, 21].
* [cite_start]Ineffective resource allocation leading to delays and inefficiencies[cite: 22, 23].
* [cite_start]Lack of data accuracy and reporting mechanisms, hampering project progress assessment and informed decision-making[cite: 24, 25].

## Project Goal

The primary goal is to develop a scheduling visualization application using the iTwin platform that empowers campus management through efficient project management practices. [cite_start]It aims to provide a clear visual representation of task delays or on-time status in a 3D environment, enable real-time monitoring of project progress, and facilitate direct input of element start/finish times from the application UI. [cite: 27, 28, 29, 30, 31, 33, 34]

## Concept & Implementation

The project leverages the iTwin Platform to synchronize 3D building elements with scheduling information. [cite_start]Data is acquired from a `steps.csv` file containing details like start dates, finish dates, element IDs, and model IDs[cite: 40, 45, 56]. [cite_start]These IDs are linked to building elements and 3D models on the iTwin platform using the IModel Console[cite: 46, 47, 54]. [cite_start]The synchronized data is then visualized using the iTwin Viewer, with custom code created in Visual Studio handling the integration and visualization logic[cite: 48, 51, 55, 57, 58, 59]. [cite_start]The application is built as a React application using TypeScript. [cite: 122]

## Technologies & Components Used

* [cite_start]**Platform:** Bentley iTwin Platform [cite: 53]
* [cite_start]**Viewer:** Bentley iTwin Viewer [cite: 55]
* [cite_start]**Frontend Framework:** React [cite: 122]
* [cite_start]**Programming Language:** TypeScript [cite: 122]
* [cite_start]**Development Environment:** Visual Studio Code [cite: 57, 58]
* [cite_start]**Data Format:** CSV (for scheduling information) [cite: 45, 56]
* [cite_start]**UI Library:** React Table [cite: 129]
* [cite_start]**Modeling/Import:** Revit (for 3D models) [cite: 70]
* **Version Control:** Git

## Functionality Showcase

[cite_start]The prototype provides an interactive 3D visualization, allowing users to observe the building construction process in a dynamic environment[cite: 157, 161]. Key functionalities include:
* [cite_start]**Real-time Progress Tracking:** Monitors the completion status of individual construction tasks based on CSV-defined steps[cite: 161].
* [cite_start]**Visual Status Indicators:** On-time tasks are indicated by green coloration, while delays or deviations are highlighted in red[cite: 162].
* [cite_start]**Timeline Feature:** Presents a chronological sequence of construction activities for users to analyze and identify critical milestones[cite: 163].
* [cite_start]**User Interface:** Features a timetable, 3D model viewer, and widgets for building elements and level selection[cite: 145, 146, 147, 148].

## How to Run (Basic Setup)

To set up and replicate the project, you would generally follow these steps:

1.  **Set Up iTwin Environment:**
    * [cite_start]Visit the [iTwin Platform website](https://developer.bentley.com/products/itwinjs/) and sign up for an account. [cite: 65]
    * [cite_start]Create a new project on your iTwin dashboard. [cite: 66]
    * [cite_start]Install necessary plugins and software tools for iTwin integration. [cite: 67]

2.  **Import 3D Models:**
    * [cite_start]Obtain 3D models (e.g., from Revit or iTwin samples). [cite: 70]
    * [cite_start]Import models into the iTwin platform and assign appropriate ElementIDs and ModelIDs. [cite: 74]

3.  **Define Construction Steps:**
    * [cite_start]Prepare a `CSV` file (e.g., `steps.csv`) containing step titles, descriptions, start/finish dates, ElementIDs, ModelIDs, and new start dates. [cite: 84]
    * [cite_start]Retrieve ElementIDs and ModelIDs from the iTwin platform using the IModelConsole. [cite: 86]
    * [cite_start]Upload the CSV file to the code directory. [cite: 87]

4.  **Integrate Custom Code:**
    * [cite_start]Integrate the custom TypeScript/React code into your development environment (Visual Studio Code). [cite: 120, 122, 123]
    * [cite_start]The code parses the CSV, retrieves 3D models, and visualizes the construction process within the iTwin Viewer. [cite: 121]
    * [cite_start]Key files include `App.tsx` (main component, authentication, viewer setup), `RenderScheduleScriptsApi.ts` (viewport interaction), `RenderScheduleScriptsViewSetup.ts` (view setup, data querying), and `ShowScheduleScriptsWidget.tsx` (widget rendering with `react-table`). [cite: 124, 125, 126, 127, 128, 129, 130]

## Conclusion and Outlook

This prototype represents a significant step forward in leveraging digital technologies for construction project management, highlighting the importance of seamless integration, data accuracy, and user engagement. [cite_start]Future plans include developing a fully integrated application to eliminate manual processes, streamline data entry by allowing engineers to select elements directly from the UI, and add advanced features like resource management and cost estimation for comprehensive insights into project budgets and allocation. [cite: 172, 173, 174, 175, 176, 177, 178, 179, 180]



# Getting Started with the iTwin Viewer Create React App Template

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Environment Variables

Prior to running the app, you will need to add OIDC client configuration to the variables in the .env file:

```
# ---- Authorization Client Settings ----
IMJS_AUTH_CLIENT_CLIENT_ID=""
IMJS_AUTH_CLIENT_REDIRECT_URI=""
IMJS_AUTH_CLIENT_LOGOUT_URI=""
IMJS_AUTH_CLIENT_SCOPES =""
```

- You can generate a [test client](https://developer.bentley.com/tutorials/web-application-quick-start/#3-register-an-application) to get started.

- Scopes expected by the viewer are:

  - **Visualization**: `imodelaccess:read`
  - **iModels**: `imodels:read`
  - **Reality Data**: `realitydata:read`

- The application will use the path of the redirect URI to handle the redirection, it must simply match what is defined in your client.

- When you are ready to build a production application, [register here](https://developer.bentley.com/register/).

You should also add a valid iTwinId and iModelId for your user in the this file:

```
# ---- Test ids ----
IMJS_ITWIN_ID = ""
IMJS_IMODEL_ID = ""
```

- For the IMJS_ITWIN_ID variable, you can use the id of one of your existing iTwins. You can obtain their ids via the [iTwin REST APIs](https://developer.bentley.com/apis/itwins/operations/get-itwin/).

- For the IMJS_IMODEL_ID variable, use the id of an iModel that belongs to the iTwin that you specified in the IMJS_ITWIN_ID variable. You can obtain iModel ids via the [iModel REST APIs](https://developer.bentley.com/apis/imodels-v2/operations/get-imodel-details/).

- Alternatively, you can [generate a test iModel](https://developer.bentley.com/tutorials/web-application-quick-start/#4-create-an-imodel) to get started without an existing iModel.

- If at any time you wish to change the iModel that you are viewing, you can change the values of the iTwinId or iModelId query parameters in the url (i.e. localhost:3000?iTwinId=myNewITwinId&iModelId=myNewIModelId)

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Notes

If you are not using NPM, remove the `USING_NPM` env var from [.env](./.env)

## Next Steps

- [iTwin Viewer options](https://www.npmjs.com/package/@itwin/web-viewer-react)

- [Extending the iTwin Viewer](https://developer.bentley.com/tutorials/itwin-viewer-hello-world/)

- [Using the iTwin Platform](https://developer.bentley.com/)

- [iTwin Developer Program](https://www.youtube.com/playlist?list=PL6YCKeNfXXd_dXq4u9vtSFfsP3OTVcL8N)
