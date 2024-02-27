/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

// Importing styling for the application
import "./App.scss";

// Importing necessary components and modules
import { RenderScheduleScriptsWidgetProvider } from "./RenderScheduleScriptsWidget"; // Widget provider for rendering schedule scripts
import "./RenderScheduleScripts.scss"; // Additional styling for rendering schedule scripts
import { RenderScheduleScriptsViewSetup } from "./RenderScheduleScriptsViewSetup"; // Setup for rendering schedule scripts view
import { ShowScheduleScriptsWidgetProvider } from "./ShowScheduleScriptsWidget"; // Widget provider for showing schedule scripts

// Importing necessary types and modules
import type { ScreenViewport } from "@itwin/core-frontend";
import { FitViewTool, IModelApp, StandardViewId } from "@itwin/core-frontend"; // Tools for viewing models
import { FillCentered } from "@itwin/core-react"; // Centered fill component
import { ProgressLinear } from "@itwin/itwinui-react"; // Linear progress indicator
import {
  MeasurementActionToolbar,
  MeasureTools,
  MeasureToolsUiItemsProvider,
} from "@itwin/measure-tools-react"; // Measurement tools and toolbar components
import {
  AncestorsNavigationControls,
  CopyPropertyTextContextMenuItem,
  PropertyGridManager,
  PropertyGridUiItemsProvider,
  ShowHideNullValuesSettingsMenuItem,
} from "@itwin/property-grid-react"; // Components for property grid and related controls
import {
  TreeWidget,
  TreeWidgetUiItemsProvider,
} from "@itwin/tree-widget-react"; // Tree widget and UI items provider components
import {
  useAccessToken,
  Viewer,
  ViewerContentToolsProvider,
  ViewerNavigationToolsProvider,
  ViewerPerformance,
  ViewerStatusbarItemsProvider,
} from "@itwin/web-viewer-react"; // Viewer and related providers for web-based viewing
import React, { useCallback, useEffect, useMemo, useState } from "react"; // React imports

import { Auth } from "./Auth"; // Authentication module
import { history } from "./history"; // History module for managing browser history

// Configuration for viewport options
const viewportOptions = {
  viewState: RenderScheduleScriptsViewSetup.getDefaultView, // Set default view state for rendering schedule scripts
  featureOptions: {
    defaultViewOverlay: {
      enableScheduleAnimationViewOverlay: true, // Enable animation view overlay for schedule scripts
    },
  },
};

// Main App component
const App: React.FC = () => {
  const [iModelId, setIModelId] = useState(process.env.IMJS_IMODEL_ID); // State for iModel ID
  const [iTwinId, setITwinId] = useState(process.env.IMJS_ITWIN_ID); // State for iTwin ID
  const [changesetId, setChangesetId] = useState(
    process.env.IMJS_AUTH_CLIENT_CHANGESET_ID
  ); // State for changeset ID

  const accessToken = useAccessToken(); // Access token for authentication

  const authClient = Auth.getClient(); // Authentication client

  // Function to handle user login
  const login = useCallback(async () => {
    try {
      await authClient.signInSilent(); // Try silent sign-in
    } catch {
      await authClient.signIn(); // If silent sign-in fails, perform regular sign-in
    }
  }, [authClient]);

  useEffect(() => {
    void login(); // Perform login on component mount
  }, [login]);

  // Effect to update state based on URL parameters
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has("iTwinId")) {
      setITwinId(urlParams.get("iTwinId") as string);
    }
    if (urlParams.has("iModelId")) {
      setIModelId(urlParams.get("iModelId") as string);
    }
    if (urlParams.has("changesetId")) {
      setChangesetId(urlParams.get("changesetId") as string);
    }
  }, []);

  // Effect to update URL based on state changes
  useEffect(() => {
    let url = `viewer?iTwinId=${iTwinId}`;

    if (iModelId) {
      url = `${url}&iModelId=${iModelId}`;
    }

    if (changesetId) {
      url = `${url}&changesetId=${changesetId}`;
    }
    history.push(url);
  }, [iTwinId, iModelId, changesetId]);

  // Function to configure viewport
  const viewConfiguration = useCallback((viewPort: ScreenViewport) => {
    const tileTreesLoaded = () => {
      return new Promise((resolve, reject) => {
        const start = new Date();
        const intvl = setInterval(() => {
          if (viewPort.areAllTileTreesLoaded) {
            ViewerPerformance.addMark("TilesLoaded");
            ViewerPerformance.addMeasure(
              "TileTreesLoaded",
              "ViewerStarting",
              "TilesLoaded"
            );
            clearInterval(intvl);
            resolve(true);
          }
          const now = new Date();
          if (now.getTime() - start.getTime() > 20000) {
            reject();
          }
        }, 100);
      });
    };

    tileTreesLoaded().finally(() => {
      void IModelApp.tools.run(FitViewTool.toolId, viewPort, true, false);
      viewPort.view.setStandardRotation(StandardViewId.Iso);
    });
  }, []);

  // Viewer creator options
  const viewCreatorOptions = useMemo(
    () => ({ viewportConfigurer: viewConfiguration }),
    [viewConfiguration]
  );

  // Effect to run initialization after iModel app is initialized
  const onIModelAppInit = useCallback(async () => {
    await TreeWidget.initialize();
    await PropertyGridManager.initialize();
    await MeasureTools.startup();
    MeasurementActionToolbar.setDefaultActionProvider();
  }, []);

  return (
    <div className="viewer-container">
      {!accessToken && (
        <FillCentered>
          <div className="signin-content">
            <ProgressLinear indeterminate={true} labels={["Signing in..."]} />
          </div>
        </FillCentered>
      )}
      <Viewer
        iTwinId={iTwinId ?? ""}
        iModelId={iModelId ?? ""}
        changeSetId={changesetId}
        authClient={authClient}
        viewCreatorOptions={viewCreatorOptions}
        enablePerformanceMonitors={true} // Enable performance monitors
        onIModelAppInit={onIModelAppInit}
        viewportOptions={viewportOptions}
        uiProviders={[
          new ShowScheduleScriptsWidgetProvider(), // Widget provider for showing schedule scripts
          new RenderScheduleScriptsWidgetProvider(), // Widget provider for rendering schedule scripts
          new ViewerNavigationToolsProvider(), // Provider for viewer navigation tools
          new ViewerContentToolsProvider({
            vertical: {
              measureGroup: false,
            },
          }), // Provider for viewer content tools
          new ViewerStatusbarItemsProvider(), // Provider for viewer status bar items
          new TreeWidgetUiItemsProvider(), // Provider for tree widget UI items
          new PropertyGridUiItemsProvider({
            propertyGridProps: {
              autoExpandChildCategories: true,
              ancestorsNavigationControls: (props) => (
                <AncestorsNavigationControls {...props} />
              ),
              contextMenuItems: [
                (props) => <CopyPropertyTextContextMenuItem {...props} />,
              ],
              settingsMenuItems: [
                (props) => (
                  <ShowHideNullValuesSettingsMenuItem
                    {...props}
                    persist={true}
                  />
                ),
              ],
            },
          }), // Provider for property grid UI items
          new MeasureToolsUiItemsProvider(), // Provider for measure tools UI items
        ]}
      />
    </div>
  );
};

export default App;
