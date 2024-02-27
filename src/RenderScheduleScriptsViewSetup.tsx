/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

// Import necessary modules and types from the '@itwin' libraries
import { Id64Set } from "@itwin/core-bentley";
import { ClipStyle, ClipStyleProps, ColorByName, LinePixels, QueryRowFormat, RenderMode, RenderSchedule } from "@itwin/core-common";
import { IModelApp, IModelConnection, ScreenViewport, ViewCreator3d, ViewState } from "@itwin/core-frontend";

// Define the interface for a step in the schedule
export interface IStep {
  startTime: Date;
  endTime: Date;
  elementIds: string[];
  modelId: string;
  stepTitle: string;
  stepDescription: string;
  newStartTime: Date;
}

// Initialize an empty array to hold steps
let steps: IStep[] = [];

// Export a function to get the steps
export function getSteps(): IStep[] {
  return steps;
}

// Define a class for setting up the view with the schedule script
export class RenderScheduleScriptsViewSetup {

  /** Queries for and loads the default view for an iModel.
   * @returns ViewState
  */
  public static getDefaultView = async (iModel: IModelConnection): Promise<ViewState> => {
    // Retrieve steps data from a CSV file
    const url = "/steps.csv";
    steps = await this._readAndParseCSV(url, ";");

    // Get the model ID for the first step
    const modelId = steps[0].modelId;

    // Create the default view
    const viewState = await new ViewCreator3d(iModel).createDefaultView({ cameraOn: true }, [modelId]);

    // Initialize a RenderSchedule.ScriptBuilder
    const scriptBuilder = new RenderSchedule.ScriptBuilder();
    const modelTimelineBuilder = scriptBuilder.addModelTimeline(modelId);
    const elementIds: string[] = [];
    const elementTimelineBuilders: RenderSchedule.ElementTimelineBuilder[] = [];

    // Loop through steps to add element timelines to the script builder
    steps.forEach((step) => {
      elementIds.push(...step.elementIds);
      elementTimelineBuilders.push(modelTimelineBuilder.addElementTimeline(step.elementIds));
    });

    // Query for elements that should not appear in the animation
    const query = `SELECT DISTINCT ECInstanceID FROM BisCore.Element WHERE ECInstanceID NOT IN (${elementIds})`;
    const results = iModel.createQueryReader(query, undefined, {
      rowFormat: QueryRowFormat.UseJsPropertyNames,
    });
    const excludedElements = await results.toArray();
    const excludedElementsIds: Id64Set = new Set(excludedElements.map(element => element.id));

    // Function to convert Date to time in seconds
    const convertDateToTimeInSeconds = (date: Date) => { return date.getTime() / 1000; };

    // Create render schedule script based on steps
    for (let i = 0; i < steps.length; i++) {
      elementTimelineBuilders[i].addVisibility(convertDateToTimeInSeconds(steps[0].startTime), 0); // Hide all included elements at the initial time point of the animation
      elementTimelineBuilders[i].addVisibility(convertDateToTimeInSeconds(steps[i].startTime), 0); // Hide elements at step start time
      const color = new Date(steps[i].newStartTime) > new Date(steps[i].startTime) ? { red: 255, green: 0, blue: 0 } : { red: 0, green: 255, blue: 0 }; // Change color based on condition
      elementTimelineBuilders[i].addColor(convertDateToTimeInSeconds(steps[i].startTime), color); // Set color at step start time
      elementTimelineBuilders[i].addVisibility(convertDateToTimeInSeconds(steps[i].endTime), 100); // Show elements at step end time
      elementTimelineBuilders[i].addColor(convertDateToTimeInSeconds(steps[i].endTime), undefined); // Reset color at step end time
    }

    // Finish the script and assign it to the view state
    const scriptProps = scriptBuilder.finish();
    viewState.displayStyle.settings.scheduleScriptProps = scriptProps;

    // Set clip style to emphasize clipping plane when viewing inside the model
    const props: ClipStyleProps = { produceCutGeometry: true };
    props.cutStyle = {
      viewflags: {
        renderMode: RenderMode.SmoothShade,
        visibleEdges: true,
        hiddenEdges: false,
      },
      hiddenLine: {
        visible: {
          ovrColor: true,
          color: ColorByName.white,
          pattern: LinePixels.Solid,
          width: 3,
        },
      },
    };
    viewState.displayStyle.settings.clipStyle = ClipStyle.fromJSON(props);

    // Set never drawn to exclude elements that should not appear in the animation
    IModelApp.viewManager.onViewOpen.addOnce(async (vp: ScreenViewport) => {
      vp.setNeverDrawn(excludedElementsIds);
    });

    return viewState;
  };

  // Read and parse CSV file
  private static _readAndParseCSV = async (url: string, separatingChar: string = ","): Promise<IStep[]> => {
    const text = await this._readFile(url);
    return this._parse(text, separatingChar);
  };

  /** Reads CSV file
   * @returns String of CSV data
  */
  private static _readFile =  async (url: string): Promise<string> => {
    const response = await fetch(url);
    return response.text();
  };

  /** Parses string of CSV data into array of individual step objects.
   *
   * The method used to read and parse the CSV file data in this sample is specific to this sample and is only intended
   *  for the purposes of this sample. Therefore, it is not recommended for use in a production environment as it does not
   * handle large datasets efficiently and will not work with improperly formatted data.
   * However, there are [dedicated and tested packages](https://www.google.com/search?q=csv+parser+npm) that support this
   *  feature and it is highly recommended to use a package instead.
   * @returns IStep[]
  */
  private static _parse = async (csvData: string, separatingChar: string): Promise<IStep[]> =>  {
    const lines = csvData.split("\n");
    const stepsFromFile: IStep[] = [];

    for (let i = 1; i < lines.length; i++) {
      if (lines[i] === "") continue;
      const values = lines[i].split(separatingChar);

      const step: IStep = {
        startTime: new Date(values[0]),
        endTime: new Date(values[1]),
        elementIds: values[2].split(","),
        modelId: values[3],
        stepTitle: values[4],
        newStartTime: new Date(values[5]),
        stepDescription: values[6],
      };

      stepsFromFile.push(step);
    }
    return stepsFromFile;
  };
}
