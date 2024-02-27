/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

// Import necessary modules and types from the '@itwin' libraries
import { IModelApp, ScreenViewport, ViewClipClearTool, ViewClipTool, Viewport } from "@itwin/core-frontend";
import { ClipPlane, ClipPrimitive, ClipVector, ConvexClipPlaneSet, Point3d, Vector3d } from "@itwin/core-geometry";
import { getSteps, IStep } from "./RenderScheduleScriptsViewSetup";

// Define a class containing methods related to rendering schedule scripts
export default class RenderScheduleScriptsApi {

  // Method to get the titles of active steps in the viewport
  public static getActiveStepTitles(vp: Viewport) {
    const steps: IStep[] = getSteps(); // Get the steps
    const date = new Date(RenderScheduleScriptsApi.getTimePoint(vp) * 1000); // Get the current time point

    let activeStepTitles = "";

    // Iterate through steps to find active steps based on time point
    steps.forEach((step) => {
      if (date >= step.startTime && date <= step.endTime) {
        activeStepTitles = activeStepTitles.concat(activeStepTitles === "" ? `${step.stepTitle}` : `, ${step.stepTitle}`);
      }
    });

    return activeStepTitles;
  }

  // Method to get the IDs of active steps in the viewport
  public static getActiveStepIds(vp: Viewport) {
    const steps: IStep[] = getSteps(); // Get the steps
    const date = new Date(RenderScheduleScriptsApi.getTimePoint(vp) * 1000); // Get the current time point

    let activeStepIds = "";

    // Iterate through steps to find active steps based on time point
    steps.forEach((step) => {
      if (date >= step.startTime && date <= step.endTime) {
        activeStepIds = activeStepIds.concat(activeStepIds === "" ? `${step.startTime}` : `, ${step.startTime}`);
      }
    });

    return activeStepIds;
  }

  // Method to get the end times of active steps in the viewport
  public static getActiveStepEndTime(vp: Viewport) {
    const steps: IStep[] = getSteps(); // Get the steps
    const date = new Date(RenderScheduleScriptsApi.getTimePoint(vp) * 1000); // Get the current time point

    let activeStepEndTime = "";

    // Iterate through steps to find active steps based on time point
    steps.forEach((step) => {
      if (date >= step.startTime && date <= step.endTime) {
        activeStepEndTime = activeStepEndTime.concat(activeStepEndTime === "" ? `${step.endTime}` : `, ${step.endTime}`);
      }
    });

    return activeStepEndTime;
  }

  // Method to get the time point in the viewport
  public static getTimePoint(vp: Viewport) {
    if(vp.timePoint === undefined){vp.timePoint = 0;} // Ensure that time point is defined
    return vp.timePoint;
  }

  // Method to listen for time point changes in the viewport
  public static listenForTimePointChanges(viewport: Viewport, listenerFunc: (vp: Viewport) => void) {
    return viewport.onDisplayStyleChanged.addListener((vp) => listenerFunc(vp));
  }

  /** The purpose of the clipping plane in this sample is to enhance the view of the animated model
   *  as it may be difficult to view steps that occur on the interior of the model.
   * @see https://www.itwinjs.org/sandboxes/iTwinPlatform/View%20Clipping
   * */
  // Method to set the clipping plane in the viewport
  public static setClipPlane(vp: ScreenViewport, clipPlane: string) {
    const normal = new Vector3d(-0, -0, -1);
    const clipPlanes: Record<string, ClipPlane | undefined> = {
      "first": ClipPlane.createNormalAndPoint(normal, new Point3d(6.0134, 6.7548, 2.7)),
      "second": ClipPlane.createNormalAndPoint(normal, new Point3d(6.0134, 6.7548, 5.6287)),
    }

    const planeSet = ConvexClipPlaneSet.createEmpty();
    planeSet.addPlaneToConvexSet(clipPlanes[clipPlane]);
    return this.setViewClipFromClipPlaneSet(vp, planeSet);
  }

  // Method to set the view clip from the clip plane set in the viewport
  public static setViewClipFromClipPlaneSet(vp: ScreenViewport, planeSet: ConvexClipPlaneSet) {
    const prim = ClipPrimitive.createCapture(planeSet, false);
    const clip = ClipVector.createEmpty();
    clip.appendReference(prim);
    ViewClipTool.enableClipVolume(vp);
    vp.view.setViewClip(clip);
    vp.setupFromView();
    return true;
  }

  // Method to clear clips in the viewport
  public static clearClips() {
    void IModelApp.tools.run(ViewClipClearTool.toolId);
  }

}
