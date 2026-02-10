// on this page i want a grid with rows and columns, they must use all available space of its parent container,but must not scroll horizontally underneator over the navBar


//  __________________________________________
//  |  KPI ROW                   | detail view |
//  |____________________________|             |
//  |  CONTROLS ROW              |             |
//  |____________________________|             |
//  |       |  TIMELINE ROW      |             |
//  |_______|____________________|             |
//  |machine|                    |             |
//  |machine|      reactflow     |             |
//  |machine|                    |             |
//  |machine|                    |             |
//  |____________________________|_____________|    


// in the first row i want 4 KPI bars that show some dummy data about the current planning, like total jobs, on time, delayed, machines running, etc.
//     these KPI bars should be visually appealing and easy to read, with different colors and icons to represent each metric. they should also be responsive and adjust their size based on the screen width.
//     they should be arranged in a horizontal row, with some spacing between them, and should be centered within the available space. each KPI bar should have a title, a value, and a small description of what the metric represents.

// in the second row i want some dummy controls to zoom in and out of the planning, change the view to day week or month and to filter on machines, orders, etc. search for jobs
//     these controls should be visually appealing and easy to use, with clear icons and labels to indicate their function. they should be arranged in a horizontal row, with some spacing between them, and should be centered within the available space. each control should have a tooltip that explains its function when hovered over.

// the next rows and colums create the static headers of the grid. much like the headers of a gantt chart the first column has the names of machines, the first row has the dates
// in the first row there must be a timeline that shows the date and names of the days, and the timeline must be scrollable horizontally
// in the first column there are rows with the names of the machines
// in the second column and row there must be a react flowchart that shows the jobs and their dependencies
// in the third column there must be a detail view of the selected job, with some dummy data it mus span all rows of the grid

import { KPIRow } from "./planning-detail/KPIRow"
import { ControlsRow } from "./planning-detail/ControlsRow"

export function PlanningDetailView() {
  return (
    <div className="w-full space-y-6 p-6">
      <KPIRow />
      <ControlsRow />
    </div>
  )
}
