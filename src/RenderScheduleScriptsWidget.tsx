/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/
import React, { useEffect } from "react";
import {
  StagePanelLocation,
  StagePanelSection,
  UiItemsProvider,
  useActiveViewport,
  Widget,
  WidgetState
} from "@itwin/appui-react";
import { Label, LabeledSelect, Text } from "@itwin/itwinui-react";
import RenderScheduleScriptsApi from "./RenderScheduleScriptsApi";
import { StandardViewId } from "@itwin/core-frontend";

// Define the React component for rendering the widget
export const RenderScheduleScriptsWidget = () => {
  const viewport = useActiveViewport(); // Get the active viewport
  const [activeStepsTitles, setActiveStepsTitles] = React.useState<string>(); // State for active step titles
  const [activeStepsIds, setActiveStepsIds] = React.useState<string>(); // State for active step IDs
  const [clipPlaneState, setClipPlaneState] = React.useState<string>("none"); // State for clip plane
  const [timePoint, setTimePoint] = React.useState<number>(); // State for time point
  const options = [ // Options for clip plane selection
    { value: "none", label: "Show All" },
    { value: "first", label: "First Floor Only" },
    { value: "second", label: "Hide Roof" },
  ];

  // Handler for clip plane selection change
  const handlePlaneSelectChange = (selectedPlane: string) => {
    setClipPlaneState(selectedPlane);
  };

  // Effect to set initial viewport configuration
  useEffect(() => {
    if (!viewport){
      return;
    }

    viewport.setStandardRotation(StandardViewId.Iso);
    viewport.zoomToVolume(viewport.iModel.projectExtents);

    // Listen for time point changes
    const dropListener = RenderScheduleScriptsApi.listenForTimePointChanges(viewport, (vp) => { setTimePoint(vp.timePoint); });
    return (() => dropListener());
  }, [viewport]);

  // Effect to apply clipping plane changes
  useEffect(() => {
    if (undefined === viewport) {
      return;
    }

    if (clipPlaneState === "none") {
      RenderScheduleScriptsApi.clearClips();
      return;
    }

    RenderScheduleScriptsApi.setClipPlane(viewport, clipPlaneState);
  }, [clipPlaneState, viewport]);

  // Effect to update active step titles
  useEffect(() => {
    if (viewport && timePoint) {
      setActiveStepsTitles(RenderScheduleScriptsApi.getActiveStepTitles(viewport));
    }
  }, [activeStepsTitles, timePoint, viewport]);

  // Effect to update active step IDs
  useEffect(() => {
    if (viewport && timePoint) {
      setActiveStepsIds(RenderScheduleScriptsApi.getActiveStepIds(viewport));
    }
  }, [activeStepsIds, timePoint, viewport]);

  // Render the widget UI
  return (
    <div className="sample-options">
      <div className="sample-grid">
        {/* Clip plane selection */}
        <LabeledSelect label="View:" displayStyle="inline" onChange={handlePlaneSelectChange} value={clipPlaneState} options={options} />
        {/* Display active step titles */}
        <Label displayStyle="inline" style={{marginRight: 0}}>Active Step(s):</Label>
        <Text>{activeStepsTitles}</Text>
        {/* Placeholder for step status (to be implemented) */}
        <Label displayStyle="inline" style={{marginRight: 0}}>Step Status:</Label>
        <Text>...</Text>
      </div>
    </div>
  );
};

// Define the provider class
export class RenderScheduleScriptsWidgetProvider implements UiItemsProvider {
  public readonly id: string = "RenderScheduleScriptsWidgetProvider";

  // Provide widgets based on stage location
  public provideWidgets(_stageId: string, _stageUsage: string, location: StagePanelLocation, _section?: StagePanelSection): ReadonlyArray<Widget> {
    const widgets: Widget[] = [];
    if (location === StagePanelLocation.Bottom) {
      widgets.push(
        {
          id: "RenderScheduleScriptWidget",
          label: "Render Schedule Script Navigator",
          defaultState: WidgetState.Open,
          content: <RenderScheduleScriptsWidget/>,
        }
      );
    }
    return widgets;
  }
}
