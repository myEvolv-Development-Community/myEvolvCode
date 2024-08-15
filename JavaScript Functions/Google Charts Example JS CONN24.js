// Wrapping this code with a check to see that a client record has been selected, otherwise you will get errors and break the formset member.
if(parentValue){  	
    
	//Find the GAD-7 History sub report in the Document Object Model
	var gadChartSubreportCaption = 'GAD-7 History';
    var gadSubreport = Form.getFormLineByCaption(gadChartSubreportCaption);
    var gadSubreportNodeSelector = `#sr-table-${gadSubreport.formLinesId}-${gadSubreport.subReportHeaderId}`;
	const gadTargetNode = $(gadSubreportNodeSelector);
    
	//Determine where to cut off x-axis.  If Member has disenrolled, use their disenrollment date.  If not, use their last GAD-7 date
	//Using getDataValue to pull the dates from custom virtual views built just for this purpose.  Outside of scope of this presentation.
	var disenrollDate = new Date(getDataValue('vv_javascript_member_disenrollment_dates', 'people_id', parentValue, 'end_date'));
	var lastGAD = new Date(getDataValue('vv_javascript_Last_GAD7', 'people_id', parentValue, 'actual_date')); 
    var trueGadDate = (disenrollDate > lastGAD) ? disenrollDate : lastGAD;
    
	
	// Setup a mutation observer - this code will watch the Document Object Model as the page loads and fire code only when it sees the sub report we will
	// be scraping data from.  If this is not present, your code may fire prematurely and throw errors or behave strangely because the sub report is not yet
	// loaded.
	const gadConfig = {childList: true, subtree: true};
    var gadChartObserver = new MutationObserver(function (mutations, me) { 
		
		//This code will execute once the GAD-7 History sub report is observed.
		//Grab the data from the sub report loaded in the Document Object Model
    	var gadDataArray = Form.getFormLineByCaption(gadChartSubreportCaption).srValue.rawDataSource; 
    	if (gadDataArray) { 
			
			//Load Google Charts - corechart is required for the line graph (see Google Charts documentation)
			google.charts.load('current', {'packages':['corechart']});
			
			//Call the custom function below, which provides the instructions for what the chart should look like and the data it should contain.
			google.charts.setOnLoadCallback(drawGadSeriesChart);
			
			//Custom Function For Creating the GAD-7 History Line Graph
			function drawGadSeriesChart(){
				
				//Create an empty array for chart data
				var gadRawData = [];
				
				//First line is like the column headers - For each event, we are providing not just the event's score, but also our intrepretation thresholds
				gadRawData.push([{type: 'date', label: 'Date'}, 'None/Minimal', 'Mild', 'Moderate', 'Severe', 'Total Score']);
				
				//Loop through the chart data to construct the additional data.  We are displaying the data in the sub report DESC, but need to have it ASC
				//for the line graph, so we will loop through the data backwards.
				for(i = gadDataArray.length - 1; i >= 0; i--){
					gadRawData.push([
						new Date(gadDataArray[i].actual_date_only), 
						gadDataArray[i].mild_range_marker, 
						gadDataArray[i].moderate_range_marker, 
						gadDataArray[i].severe_range_marker, 
						gadDataArray[i].top_range_marker, 
						gadDataArray[i].total_score
					]);
				}
				
				//Add our last data line, which pushes the right side of the x-axis to the last GAD-7 date or the Member's disenrollment date, whichever was later
				gadRawData.push([trueGadDate, 5, 5, 5, 10, null]);

				//Convert the array into a Google Chart Data Table
				var gadData = google.visualization.arrayToDataTable(gadRawData);
   
				//Style the chart in various ways
				var gadOptions = {
					height: 350,
					seriesType: 'area',
					isStacked: true,
					lineWidth: 0,
					tooltip: {trigger: 'selection'},
					colors: ['#FFFFFF', '#F6CCC7','#EE9990', '#DC3220'],
					series: {
						4: { type: 'line',
							pointsVisible: true,
							lineWidth: 4,
							visibleInLegend: false,
							color: '#005AB5'
						}
					},
					vAxis: {
						title: 'GAD-7 Total Score',
						maxValue: 21,
						minValue: 0,
						minorGridlines: {
							color: 'transparent'
						},
						
					},
					hAxis: {
						title: 'Date of GAD-7 Assessment',
						format: 'MMM yyyy',
						minorGridlines: {
							color: 'transparent'
						},
					}
				};
	
				//Tell Google Charts where to render our Combo Chart
				var gadChart = new google.visualization.ComboChart(document.getElementById('gad-7-hist'));
	
				//Render the graph with our data and options
				gadChart.draw(gadData, gadOptions);
			}
			
			// Stop observing. Otherwise, the observer will keep watching and executing this code indefinitely
			me.disconnect(); 
			return; 
    	} 
    }); 
    
    //Start Observing
    gadChartObserver.observe(gadTargetNode[0], gadConfig);
}
