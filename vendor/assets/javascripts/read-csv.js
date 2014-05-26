var surname = [];
var forename = [];
var target = [];
var initial = [];
var result = [];
var target_result = [];
var initial_result = [];
var comparison = [];
var result_number = [];
var target_number = [];
var levels_progress = {};
var levels_target = {};
var grade_array = ['W','1C','1B','1A','2C','2B','2A','3C','3B','3A','4C','4B','4A','5C','5B','5A','6C','6B','6A','7C','7B','7A','8C','8B','8A'];
var aps_array = ["1","2","3","4","5","6","7","8","9","10","11","12","13","14","15","16","17","18","19","20","21","22","23","24","25","26","27","28","29"
				,"30","31","32","33","34","35","36","37","38","39","40","41","42","43","44","45","46","47","48","49","50","51","52","53"];
var lines = [];

function convertAps(aps) {
	if(aps<6) {	return "W";	}
	else if (aps == 7 || aps == 8) {return "1C";}
	else if (aps == 9 || aps == 10) {return "1B";}
	else if (aps == 11 || aps == 12) {return "1A";}
	else if (aps == 13 || aps == 14) {return "2C";}
	else if (aps == 15 || aps == 16) {return "2B";}
	else if (aps == 17 || aps == 18) {return "2A";}
	else if (aps == 19 || aps == 20) {return "3C";}
	else if (aps == 21 || aps == 22) {return "3B";}
	else if (aps == 23 || aps == 24) {return "3A";}
	else if (aps == 25 || aps == 26) {return "4C";}
	else if (aps == 27 || aps == 28) {return "4B";}
	else if (aps == 29 || aps == 30) {return "4A";}
	else if (aps == 31 || aps == 32) {return "5C";}
	else if (aps == 33 || aps == 34) {return "5B";}
	else if (aps == 35 || aps == 36) {return "5A";}
	else if (aps == 37 || aps == 38) {return "6C";}
	else if (aps == 39 || aps == 40) {return "6B";}
	else if (aps == 41 || aps == 42) {return "6A";}
	else if (aps == 43 || aps == 44) {return "7C";}
	else if (aps == 45 || aps == 46) {return "7B";}
	else if (aps == 47 || aps == 48) {return "7A";}
	else if (aps == 49 || aps == 50) {return "8C";}
	else if (aps == 51 || aps == 52) {return "8B";}
	else if (aps == 53) {return "8a";}
}


function handleFiles(evt) {
	example = false;
	lines = [];
	// Check for the various File API support.
	var files = evt.target.files; 
	if (window.FileReader) {
		// FileReader are supported.
		getAsText(files[0]);
	} else {
		alert('FileReader are not supported in this browser.');
	}
}

function getAsText(fileToRead) {
	var reader = new FileReader();
	// Handle errors load
	reader.onload = loadHandler;
	reader.onerror = errorHandler;
	// Read file into memory as UTF-8      
	reader.readAsText(fileToRead);
}

function loadHandler(event) {
	var csv = event.target.result;
	processData(csv);             
}
	
	
	function exampleData(){
	example = true;
	lines = [];
	document.getElementById("files").value = "";
	lines[0] = ['Surname', "Forename","Target","KS1","Result"];
	lines[1] = ['Smith', "Daniel","21","20","89"];
	lines[2] = ['Knight', "Gemma","4a","1b","2c"];
	lines[3] = ['Colbert', "John","3b","1b","4c"];
	lines[4] = ['Austin', "Edward","2a","1a","3b"];
	lines[5] = ['Lynch', "Amber","3c","2b","2a"];
	lines[6] = ['Thompson', "Lynda","3a","2c","3a"];
	lines[7] = ['Dean', "Melissa","4b","2a","4a"];
	lines[8] = ['Mills', "Mark","4c","1c","5c"];
	lines[9] = ['Hudson', "David","4a","1c","4b"];
	lines[10] = ['Reeves', "Cameron","5c","1b","5b"];
	lines[11] = ['Andrews', "Kate","4a","1b","4b"];
	lines[12] = ['Robinson', "Bradley","4b","2a","4c"];
	lines[13] = ['Hinch', "Lauren","5a","2b","5b"];
	lines[14] = ['Brannan', "Joanne","5b","2b","5b"];
	lines[15] = ['Walker', "Michelle","4b","2a","4a"];
	lines[16] = ['Humphreys', "Laura","5c","2b","5b"];
	lines[17] = ['Munnings', "Louise","5b","2b","4a"];
	lines[18] = ['Storey', "Alex","3a","2c","4b"];
	lines[19] = ['Clausen', "Rachel","4b","2a","4a"];
	lines[20] = ['Sinclair', "Mike","4b","1b","3a"];
	
	
	processData();
	}
	
	
	function isInArray(value, array) {
		return array.indexOf(value) > -1;
	}
	
	var array_test = [1,2,3,4];
	
	
	function processData(csv) {
    if(example != true) {
	var allTextLines = csv.split(/\r\n|\n/);
    while (allTextLines.length) {
        lines.push(allTextLines.shift().split(','));
    }
	}
	for (var i = 1; i < lines.length; i++) {
		if(lines[i][0].length >0) {
			surname.push(lines[i][0]);
			forename.push(lines[i][1]);
			target.push(lines[i][2]);
			initial.push(lines[i][3]);
			result.push(lines[i][4]);
			if(lines[i][4] && lines[i][3]) {
				if(isInArray(lines[i][4].toUpperCase(),grade_array) == true) {
					var result_value = grade_array.indexOf(lines[i][4].toUpperCase())
					result_number.push(result_value);
				}
				else if (isInArray(lines[i][4],aps_array) == true) {
					var convert_aps = convertAps(lines[i][4])
					var result_value = grade_array.indexOf(convert_aps);
					result_number.push(result_value);
				}
				else {
					result_value = 0;
					result_number.push(result_value);
				}
				if(isInArray(lines[i][3].toUpperCase(),grade_array) == true) {
					var initial_value = grade_array.indexOf(lines[i][3].toUpperCase())
					comparison.push(initial_value);
				}
				else if (isInArray(lines[i][3],aps_array) == true) {
					var convert_aps = convertAps(lines[i][3])
					var initial_value = grade_array.indexOf(convert_aps);
					comparison.push(initial_value);
				}
				else {
					initial_value = 0;
					comparison.push(initial_value);
				}
			
				initial_result.push(result_value-initial_value);
			
			}
			
			if(lines[i][4] && lines[i][2]) {
				if(isInArray(lines[i][4].toUpperCase(),grade_array) == true) {
				var result_value = grade_array.indexOf(lines[i][4].toUpperCase())
				}
				else if (isInArray(lines[i][4],aps_array) == true) {
				var result_value = aps_array.indexOf(lines[i][4]);
				}
				else {
					result_value = 0;
				}
				if(isInArray(lines[i][2].toUpperCase(),grade_array) == true) {
				var target_value = grade_array.indexOf(lines[i][2].toUpperCase())
				target_number.push(target_value);
				}
				else if (isInArray(lines[i][2],aps_array) == true) {
				var convert_aps = convertAps(lines[i][2])
				var target_value = grade_array.indexOf(convert_aps);
				target_number.push(target_value);
				}
				else {
					target_value = 0;
					target_number.push(target_value);
				}
			target_result.push(result_value-target_value);
			
			}
			

		}
	}
	
	
	for (var i = 0; i < initial_result.length; i++) {
		if(levels_progress[initial_result[i]]){
			levels_progress[initial_result[i]]++;
		}
		else {
		levels_progress[initial_result[i]] = 1;
		}
	}
	
	for (var i = 0; i < target_result.length; i++) {
		if(levels_target[target_result[i]]){
			levels_target[target_result[i]]++;
		}
		else {
		levels_target[target_result[i]] = 1;
		}
	}
	
	drawOutput(lines);
	
	pieChart_levels();
	pieChart_target();
	
	barChart_target(lines);
	tm_1_2(lines);
	
	
}


function pieChart_levels() {
 
  var data = [];
   for (i=-50; i<51; i++) {
	data.push([i +' Levels', levels_progress[i]]);
	}
   
  var plot1 = jQuery.jqplot ('pie_chart', [data], 
    { 
		title: 'Levels of Progress',
		  seriesDefaults: {
			renderer: jQuery.jqplot.PieRenderer, 
			rendererOptions: {
			  showDataLabels: true
			}
		  }, 
      legend: { show:true, location: 'e' }
    }
  );
  $('#lpModal').on('shown.bs.modal', function(event, ui) {
      
      plot1.replot();

  
	
	function print_PieChart(){
		$('#pie_chart_img').empty();
		var imgData = $('#pie_chart').jqplotToImageStr({});
		var imgElem = $('<img/>').attr('src', imgData); 
		
		$('#pie_chart_img').append(imgElem);
		
        var divElements = document.getElementById("pie_chart_img").innerHTML;
        
        var print_window = window.open();
		
        //Reset the page's HTML with div's HTML only
        print_window.document.write( 
          "<html><head><title></title></head><body>" + 
          divElements + "</body>");

        //Print Page
        print_window.print();
		print_window.close();

    }

    $("#printPieChart").click(function(){ print_PieChart(); });
	
  });
  
}

function pieChart_target() {
  var data = [];
   for (i=-50; i<51; i++) {
	data.push([i +' Levels', levels_target[i]]);
	}
  
  var plot2 = jQuery.jqplot ('pie_chart_target', [data], 
    { 
		title: 'Comparison to Target',
      seriesDefaults: {
        renderer: jQuery.jqplot.PieRenderer, 
        rendererOptions: {
          showDataLabels: true
		  
        }
      }, 
      legend: { show:true, location: 'e' }
    }
  );
  
  $('#targetModal').on('shown.bs.modal', function(event, ui) {
      
      plot2.replot();
	 
	function print_PieChart_target(){
		$('#pie_chart_target_hidden').empty();
		var imgData = $('#pie_chart_target').jqplotToImageStr({});
		var imgElem = $('<img/>').attr('src', imgData); 
		$('#pie_chart_target_hidden').append(imgElem);
		var divElements = document.getElementById("pie_chart_target_hidden").innerHTML;
	var print_window = window.open();
		
        //Reset the page's HTML with div's HTML only
        print_window.document.write( 
          "<html><head><title></title></head><body>" + 
          divElements + "</body>");

        //Print Page
        print_window.print();
		print_window.close();
		}
		$("#printChart_target").click(function(){ print_PieChart_target(); });
  });
}





function barChart_target(lines) {
    var s1 = comparison;
	var s2 = result_number;
	var s3 = target_number;
	
    // Can specify a custom tick Array.
    // Ticks should match up one for each y value (category) in the series.
    var ticks = [];
     for (i=1; i<lines.length; i++) {
		ticks.push([lines[i][0] + '<br>'+ lines[i][1]]);
	 }
	 	 tickFormatter = function (format, val) { 
	 if(val==-1)
	 {return "No Grade";}
	 else if(val==0)
	 {return "W";}
	else if(val==1)
	 {return "1C";}
	 else if(val==2)
	 {return "1B";}
	 else if(val==3)
	 {return "1A";}
	 else if(val==4)
	 {return "2C";}
	 else if(val==5)
	 {return "2B";}
	 else if(val==6)
	 {return "2A";}
	 else if(val==7)
	 {return "3C";}
	 else if(val==8)
	 {return "3B";}
	  else if(val==9)
	 {return "3A";}
	  else if(val==10)
	 {return "4C";}
	  else if(val==11)
	 {return "4B";}
	  else if(val==12)
	 {return "4A";}
	  else if(val==13)
	 {return "5C";}
	  else if(val==14)
	 {return "5B";}
	  else if(val==15)
	 {return "5A";}
	  else if(val==16)
	 {return "6C";}
	 else if(val==17)
	 {return "6B";}
	 else if(val==18)
	 {return "6A";}
  }

    var plot1 = $.jqplot('barChart_target', [s1, s2, s3], {
		      series:[
			   {label:'Comparison'},
            {label:'Result'},
            {label:'Target'},
			  {renderer:$.jqplot.BarRenderer, xaxis:'x2axis', yaxis:'y2axis',
	rendererOptions: {
                    // Speed up the animation a little bit.
                    // This is a number of milliseconds.  
                    // Default for bar series is 3000.  
                    animation: {
                        speed: 2500
                    },
                    barWidth: 15,
                    barPadding: -15,
                    barMargin: 0,
                    highlightMouseOver: false
                }
            }, 
            {
                rendererOptions: {
                    // speed up the animation a little bit.
                    // This is a number of milliseconds.
                    // Default for a line series is 2500.
                    animation: {
                        speed: 2000
                    }
                }
            }
	
	],
        // The "seriesDefaults" option is an options object that will
        // be applied to all series in the chart.
        seriesDefaults:{
            renderer:$.jqplot.BarRenderer,
            rendererOptions: {fillToZero: true}
        },
        // Custom labels for the series are specified with the "label"
        // option on the series option.  Here a series option object
        // is specified for each series.
        
        // Show the legend and put it outside the grid, but inside the
        // plot container, shrinking the grid to accomodate the legend.
        // A value of "outside" would not shrink the grid and allow
        // the legend to overflow the container.
        legend: {
            show: true,
            placement: 'outsideGrid'
        },
        axes: {
            // Use a category axis on the x axis and use our custom ticks.
            xaxis: {
                renderer: $.jqplot.CategoryAxisRenderer,
                ticks: ticks
            },
            // Pad the y axis just a little so bars can get close to, but
            // not touch, the grid boundaries.  1.2 is the default padding.
            yaxis: {
                pad: 1.05,
            
				 tickOptions: {
		  formatter: tickFormatter
		  },
		    tickInterval : 1,
			min: 0
            },
			 y2axis: {
			   pad: 1.05,
            
				 tickOptions: {
		  formatter: tickFormatter
		  },
		    tickInterval : 1,
			min: 8
        }
    },

});
	$('#barChartModal').on('shown.bs.modal', function(event, ui) {
      
      plot1.replot();
	  
  });


}
function errorHandler(evt) {
	if(evt.target.error.name == "NotReadableError") {
		alert("Canno't read file !");
	}
}



function drawOutput(lines){
	
	document.getElementById("output").innerHTML = "";
	var table = document.createElement("table");
	table.className = 'table table-hover';
	for (var i = 0; i < lines.length; i++) {
		var row = table.insertRow(-1);
		for (var j = 0; j < lines[i].length; j++) {
			var firstNameCell = row.insertCell(-1);
			if (i>0 && j==4) {
				if(lines[i][j] && lines[i][j-2]) {
				
					if(target_result[i-1]>0) {
						firstNameCell.className = 'above_target';
					}
					if(target_result[i-1]==0) {
						firstNameCell.className = 'on_target';
					}
					if(target_result[i-1]==-1) {
						firstNameCell.className = 'one_below_target';
					}
					if(target_result[i-1]<-1) {
						firstNameCell.className = 'below_target';
					}
					if(isInArray(lines[i][j].toUpperCase(), grade_array) == false && isInArray(lines[i][j], aps_array) == false) {
						firstNameCell.className = 'incorrect_result';
					}
				}
				else {
				firstNameCell.className = 'no_color';
				}
				}
			
			firstNameCell.appendChild(document.createTextNode(lines[i][j].toUpperCase()));
		}
		var levelsProgress = row.insertCell(-1);
		if (i==0) {
			levelsProgress.appendChild(document.createTextNode('Sublevels of Progress'));
		}
		else {
			if (lines[i][4] && lines[i][3]) {
				lp = initial_result[i-1];
				levelsProgress.appendChild(document.createTextNode(lp));
			}
		}
	}
	
	document.getElementById("output").appendChild(table);
}

var arr = [];
  for (var i = 0; i < 6000; i++) {
    arr[i] = [];
	}

function tm_1_2(lines) {

for (i=1; i<lines.length-1; i++) {
		if (lines[i][3]=== undefined) {
		}
		else {
			if(isInArray(lines[i][4].toUpperCase(),grade_array) == true) {
				var b = grade_array.indexOf(lines[i][4].toUpperCase())
			}
			else if (isInArray(lines[i][4],aps_array) == true) {
				var b = aps_array.indexOf(lines[i][4]);
			}
			else {
			b = 0
			}
			if(isInArray(lines[i][3].toUpperCase(),grade_array) == true) {
				var a = grade_array.indexOf(lines[i][3].toUpperCase())
			}
			else if (isInArray(lines[i][3],aps_array) == true) {
				var a = aps_array.indexOf(lines[i][3]);
			}
			else {
			a = 0
			}
		v = (a+202)*(b+2);
		arr[v].push(lines[i][0]+" "+lines[i][1]);
		
		}
	 }

n=0;
	var below_target = [0,1,2,3,19,20,21,22,23,24,25,38,39,40,41,42,43,44,57,58,59,60,61,62,63,76,77,78,79,80,81,82,83,84,85,95,96,97,98,99,100,101,102,103,104,114,115,
	116,117,118,119,120,121,122,123,133,134,135,136,137,138,139,140,141,142,143,144,145,152,153,154,155,156,157,158,159,160,161,162,163,164,171,172,173,174,175,176,177,
	178,179,180,181,182,183];
	var one_below_target = [4,5,6,26,27,28,45,46,47,64,65,66,86,87,88,105,106,107,124,125,126,146,147,148,165,166,167,184,185,186];
	var on_target = [7,8,9,29,30,31,48,49,50,67,68,69,89,90,91,108,109,110,127,128,129,149,150,151,168,169,170,187,188,189];
	var above_target = [10,11,12,13,14,15,16,17,18,32,33,34,35,36,37,51,52,53,54,55,56,70,71,72,73,74,75,92,93,94,111,112,113,130,131,132];
	document.getElementById("tm_1_2").innerHTML = "";
	var table = document.createElement("table");
	table.className = 'tm_layout';
	table.id = 'tm_print';
	for (j=201; j<212; j++) {
	var row = table.insertRow(-1);
	for (i=1; i<21; i++) {
	var firstNameCell = row.insertCell(-1);
	if (j==201 && i ==1){
	firstNameCell.appendChild(document.createTextNode('Grade'));
	firstNameCell.className = 'tm_layout';
	}
	else if (j==201 && i!=1) {
	firstNameCell.appendChild(document.createTextNode(grade_array[i-2]));
	firstNameCell.className = 'tm_layout';
	}
	else {
	if (i==1) {
	firstNameCell.appendChild(document.createTextNode(grade_array[j-202]));
	firstNameCell.className = 'tm_layout';
	}
	else {
		if (arr[i*j].length >0) {
		var name = false;
		newButton = document.createElement('input');
        newButton.type = 'button';
        
		newButton.id = "tooltip";
        if(name == true){
		$('#tooltip').html(arr[i*j]);
		
		}
		else {
		newButton.value = arr[i*j].length + " , " + Math.round(arr[i*j].length*100/(lines.length-2))+'%' ;
		}
        
		newButton.rel = "tooltip";
		newButton.toggle = "tooltip";
		
		newButton.title = arr[i*j];
		newButton.className = "tm_button";
		  firstNameCell.appendChild(newButton);
			

		}
		if(below_target.indexOf(n)!= -1) {
		firstNameCell.className = 'below_target tm_layout';
		}
		else if(one_below_target.indexOf(n)!= -1) {
		firstNameCell.className = 'one_below_target tm_layout';
		}
		else if(on_target.indexOf(n)!= -1) {
		firstNameCell.className = 'on_target tm_layout';
		}
		else if(above_target.indexOf(n)!= -1) {
		firstNameCell.className = 'above_target tm_layout';
		}
		n++;
	}
	}
	}
	}
	
	document.getElementById("tm_1_2").appendChild(table);
	
	}
	
	function printData()
{
  //Get the HTML of div
        window.print();

}

function printTable() {

 var divElements = document.getElementById("output").innerHTML;
        //Get the HTML of whole page
        var print_window = window.open();
		
        //Reset the page's HTML with div's HTML only
        print_window.document.write( 
          "<html><head><title></title></head><body>" + 
          divElements + "</body>");

        //Print Page
        print_window.print();
		print_window.close();

}



	