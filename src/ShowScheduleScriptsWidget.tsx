import React, { useCallback, useEffect, useMemo, useState } from "react";
import { actions, ActionType, Column, MetaBase, Row, TableInstance, TableState } from "react-table";
import {
  StagePanelLocation,
  StagePanelSection,
  UiItemsProvider,
  Widget,
  WidgetState
} from "@itwin/appui-react";
import { getSteps, IStep } from "./RenderScheduleScriptsViewSetup";
import { Table } from "@itwin/itwinui-react";


// Define a type for each row in the table
interface TableRow extends Record<string, string | Date> {
  stepTitle: string;
  startTime: Date;
  endTime: Date;
}

// Define the component responsible for rendering the widget
const ShowScheduleScriptsWidget = () => {
  const [isAutoSelect, setIsAutoSelect] = useState<boolean>();
  // Define column definitions using useMemo to memoize it
  const columnDefinition = useMemo(() => [
    {
      Header: "Table",
      columns: [
        {
          Header: "Step Title",
          accessor: "stepTitle",
        },
        {
          Header: "Start Time",
          accessor: "startTime",
        },
        {
          Header: "End Time",
          accessor: "endTime",
        },
        
      ],
    },
  ], []);

  // Define table data using useMemo to memoize it
  const data = useMemo(() => {
    const rows: TableRow[] = [];
    const steps: IStep[] = getSteps();
    
    if (!steps)
      return rows;

    steps.forEach((rowData: any) => {
      const row: TableRow = {
        stepTitle: rowData.stepTitle,
        startTime: rowData.startTime.toLocaleString(),
        endTime: rowData.endTime.toLocaleString(),
      };
      rows.push(row);
    });

    return rows;
  }, []);

  // Define a callback function for row click event (currently commented out)
 // const onRowClick = useCallback((_event: React.MouseEvent, row: Row<TableRow>) => {
 //   const steps: IStep[] = getSteps();
 //   const elementIds: string[] = [];
 //   steps.forEach((step) => {elementIds.push(...step.elementIds);
 //   setIsAutoSelect(false);
 //   steps.visualizeViolation(row.original.elementId, false);
 //   setSelectedElement(row.original.elementId);
 //   row.toggleRowSelected(true);
 //  }, []);


  return (
    <Table<TableRow>
      data={data}
      isSortable
      isLoading={!data.length}  // Use data.length to check if data is available
      columns={columnDefinition}
      //onRowClick={onRowClick}
      style={{ height: "100%" }}
      emptyTableContent="No rules"
      density="extra-condensed" />
  );
};

// Define a class that provides the widget
export class ShowScheduleScriptsWidgetProvider implements UiItemsProvider {
    public readonly id: string = "ShowScheduleScriptsWidgetProvider";
  
    public provideWidgets(_stageId: string, _stageUsage: string, location: StagePanelLocation, _section?: StagePanelSection): ReadonlyArray<Widget> {
      const widgets: Widget[] = [];
      if (location === StagePanelLocation.Bottom) {
        widgets.push(
          {
            id: "ShowScheduleScriptWidget",
            label: "Show Schedule Script Navigator",
            defaultState: WidgetState.Open,
            content: <ShowScheduleScriptsWidget/>,
          }
        );
      }
      return widgets;
    }
}