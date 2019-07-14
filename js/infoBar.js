
//INFO SIDE PANEL

var world_economy = ["HIGHT_INC", "LOW_INC", "MIDDLE_INC",
						"MORE_DEV", "LESS_DEV"]

function infoPanel(filter,year,gender,name){

    var info = {}   
    
    //Info Panel : Information about a country

    console.log(name)

    switch (filter){

    	case "COUNTRY": for (major in Major_Areas){
			                for (area in Major_Areas[major]){
			                    IMS[year].M_AREAS[major]
			                        [Major_Areas[major][area]].COUNTRIES
			                        .forEach(function(d){
			                            if(d.Name==name){
			                                info["Name"] = d.Name
			                                info["Total MS"] = d[gender].TOTAL
			                                info["MS Age"] = d[gender].AGE  
			                            }
			                        })
			                    TP[year].M_AREAS[major]
			                        [Major_Areas[major][area]].COUNTRIES
			                        .forEach(function(d){
			                            if(d.Name==name){
			                                info["Total Population"] = Math.round(d[gender].TOTAL*1000)
			                            }
			                        })
			                }
			            }
			            //Flag for the info panel
			            d3.select("#flag_Country")
			                .attr("src","flags/Flag of "+ name +".png")
			            break;

	    case "MAJOR-AREA": for (major in Major_Areas){
	    						d = IMS[year].M_AREAS[major]
	                            if(d.Name==name){
	                                info["Name"] = d.Name
	                                info["Total MS"] = d[gender].TOTAL
	                                info["MS Age"] = d[gender].AGE  
	                            }
			                    d = TP[year].M_AREAS[major]
	                            if(d.Name==name){
	                                info["Total Population"] = Math.round(d[gender].TOTAL*1000)
	                            }
	                            //Empty the flag from the panel
					            d3.select("#flag_Country")
					                .attr("src","flags/Flag of Earth.png")
				                }break;

        case "AREA": for (major in Major_Areas){
    					for (area in Major_Areas[major]){
		                    
		                    d = IMS[year].M_AREAS[major]
		                        	[Major_Areas[major][area]]

                            if(d.Name==name){
                                info["Name"] = d.Name
                                info["Total MS"] = d[gender].TOTAL
                                info["MS Age"] = d[gender].AGE  
                            }
		                    d = TP[year].M_AREAS[major]
		                    		[Major_Areas[major][area]]
                            if(d.Name==name){
                                info["Total Population"] = Math.round(d[gender].TOTAL*1000)
                            }
                            //Empty the flag from the panel
				            d3.select("#flag_Country")
				                .attr("src","flags/Flag of Earth.png")
			            }
			        }break;

	    case "ALLR": for (economy in world_economy){
        				
	                    d_ims = IMS[year].WORLD[world_economy[economy]]
	                    d_tp = TP[year].WORLD[world_economy[economy]]

	                    if(world_economy[economy] == "LESS_DEV"){
	                    	d_ims = IMS[year].WORLD[world_economy[economy]].TOTAL
	                    	d_tp = TP[year].WORLD[world_economy[economy]].TOTAL
	                    }

                        if(d_ims.Name==name){
                            info["Name"] = d_ims.Name
                            info["Total MS"] = d_ims[gender].TOTAL
                            info["MS Age"] = d_ims[gender].AGE  
                        }
	                    
                        if(d_tp.Name==name){
                            info["Total Population"] = Math.round(d_tp[gender].TOTAL*1000)
                        }
                        //Empty the flag from the panel
			            d3.select("#flag_Country")
			                .attr("src","flags/Flag of Earth.png")
			            
			        }break;

        case "ALLC": for (economy in world_economy){

	                    if(world_economy[economy] === "LESS_DEV"){

	                    	if(name === IMS[year].WORLD[world_economy[economy]].LESS.Name){
	                    		d_ims = IMS[year].WORLD[world_economy[economy]].LESS
	                    		d_tp = TP[year].WORLD[world_economy[economy]].LESS

	                    		info["Name"] = "Least developed countries"
	                            info["Total MS"] = d_ims[gender].TOTAL
	                            info["MS Age"] = d_ims[gender].AGE
	                            info["Total Population"] = Math.round(d_tp[gender].TOTAL*1000)
	                    	}

	                    	else if(name === "Less developed countries"){
	                    		console.log(world_economy[economy])
	                    		d_ims = IMS[year].WORLD[world_economy[economy]].LEAST
	                    		d_tp = TP[year].WORLD[world_economy[economy]].LEAST

	                    		info["Name"] = "Less developed countries"
	                            info["Total MS"] = d_ims[gender].TOTAL
	                            info["MS Age"] = d_ims[gender].AGE
	                            info["Total Population"] = Math.round(d_tp[gender].TOTAL*1000)
		                    }
	                    	
	                    }

	                    else if(world_economy[economy] === "MORE_DEV"){
	                    	console.log(world_economy[economy])

	                    		d_ims = IMS[year].WORLD[world_economy[economy]]
	                    		d_tp = TP[year].WORLD[world_economy[economy]]

	                    		info["Name"] = "More developed countries"
	                            info["Total MS"] = d_ims[gender].TOTAL
	                            info["MS Age"] = d_ims[gender].AGE
	                            info["Total Population"] = Math.round(d_tp[gender].TOTAL*1000)
	                    }

	                    

                        //Empty the flag from the panel
			            d3.select("#flag_Country")
			                .attr("src","flags/Flag of Earth.png")
			            
			        }break;

        case "AllR": for (economy in world_economy){

        				console.log(name)

        				if(world_economy[economy] === "HIGHT_INC"){
        					if(name === IMS[year].WORLD[world_economy[economy]].Name){
        						
        						d_ims = IMS[year].WORLD[world_economy[economy]]
		                    	d_tp = TP[year].WORLD[world_economy[economy]]

		                    	info["Name"] = name 
	                            info["Total MS"] = d_ims[gender].TOTAL
	                            info["MS Age"] = Math.round(d_ims[gender].AGE*1000)
	                            info["Total Population"] = Math.round(d_tp[gender].TOTAL*1000)
	                        }
	        			}

        				else if(world_economy[economy] === "LOW_INC"){
        					if(name === IMS[year].WORLD[world_economy[economy]].Name){
        						
        						d_ims = IMS[year].WORLD[world_economy[economy]]
		                    	d_tp = TP[year].WORLD[world_economy[economy]]

		                    	info["Name"] = name 
	                            info["Total MS"] = d_ims[gender].TOTAL
	                            info["MS Age"] = Math.round(d_ims[gender].AGE*1000)
	                            info["Total Population"] = Math.round(d_tp[gender].TOTAL*1000)
	                        }
        				}

        				else if(world_economy[economy] === "MIDDLE_INC"){
        					if(name === IMS[year].WORLD[world_economy[economy]].Name){
        						
        						d_ims = IMS[year].WORLD[world_economy[economy]]
		                    	d_tp = TP[year].WORLD[world_economy[economy]]

		                    	info["Name"] = name 
	                            info["Total MS"] = d_ims[gender].TOTAL
	                            info["MS Age"] = Math.round(d_ims[gender].AGE*1000)
	                            info["Total Population"] = Math.round(d_tp[gender].TOTAL*1000)
	                        }
        				}
        				//Empty the flag from the panel
			            d3.select("#flag_Country")
			                .attr("src","flags/Flag of Earth.png")

        			}break;

        case "AllC": for (economy in world_economy){

        				console.log(name)

        				if(world_economy[economy] === "HIGHT_INC"){
        					if(name === IMS[year].WORLD[world_economy[economy]].Name){
        						
        						d_ims = IMS[year].WORLD[world_economy[economy]]
		                    	d_tp = TP[year].WORLD[world_economy[economy]]

		                    	info["Name"] = name 
	                            info["Total MS"] = d_ims[gender].TOTAL
	                            info["MS Age"] = Math.round(d_ims[gender].AGE*1000)
	                            info["Total Population"] = Math.round(d_tp[gender].TOTAL*1000)
	                        }
	        			}

        				else if(world_economy[economy] === "LOW_INC"){
        					if(name === IMS[year].WORLD[world_economy[economy]].Name){
        						
        						d_ims = IMS[year].WORLD[world_economy[economy]]
		                    	d_tp = TP[year].WORLD[world_economy[economy]]

		                    	info["Name"] = name 
	                            info["Total MS"] = d_ims[gender].TOTAL
	                            info["MS Age"] = Math.round(d_ims[gender].AGE*1000)
	                            info["Total Population"] = Math.round(d_tp[gender].TOTAL*1000)
	                        }
        				}

        				else if(world_economy[economy] === "MIDDLE_INC"){
        					if(name === IMS[year].WORLD[world_economy[economy]].LOWER_M.Name){
        						
        						d_ims = IMS[year].WORLD[world_economy[economy]].LOWER_M
		                    	d_tp = TP[year].WORLD[world_economy[economy]].LOWER_M

		                    	info["Name"] = name 
	                            info["Total MS"] = d_ims[gender].TOTAL
	                            info["MS Age"] = Math.round(d_ims[gender].AGE*1000)
	                            info["Total Population"] = Math.round(d_tp[gender].TOTAL*1000)
	                        }
	                        else if(name === IMS[year].WORLD[world_economy[economy]].UPPER_M.Name){
        						
        						d_ims = IMS[year].WORLD[world_economy[economy]].UPPER_M
		                    	d_tp = TP[year].WORLD[world_economy[economy]].UPPER_M

		                    	info["Name"] = name 
	                            info["Total MS"] = d_ims[gender].TOTAL
	                            info["MS Age"] = Math.round(d_ims[gender].AGE*1000)
	                            info["Total Population"] = Math.round(d_tp[gender].TOTAL*1000)
	                        }
        				}

        				//Empty the flag from the panel
			            d3.select("#flag_Country")
			                .attr("src","flags/Flag of Earth.png")

        			}break;

        case "SSA":  
        			console.log(name)

					d_ims = IMS[year].WORLD["SUB_SAHARA"]
                	d_tp = TP[year].WORLD["SUB_SAHARA"]

                	info["Name"] = name 
                    info["Total MS"] = d_ims[gender].TOTAL
                    info["MS Age"] = Math.round(d_ims[gender].AGE*1000)
                    info["Total Population"] = Math.round(d_tp[gender].TOTAL*1000)

                    //Empty the flag from the panel
			            d3.select("#flag_Country")
			                .attr("src","flags/Flag of Earth.png")
        			break;

    }



            //COUNTRY NAME
            d3.select("#country_name")
                .text(function(){
                    return info["Name"]
                })

            d3.select("#TP")
                .text(function(){
                    return info["Total Population"]
                })

            d3.select("#MS")
                .text(function(){
                    return info["Total MS"]
                })

             // set the dimensions and margins of the graph
		    var width = 200
		        height = 150
		        margin = 0

		     // The radius of the pieplot is half the width or half the height (smallest one). I substract a bit of margin.
    		var radius = Math.min(width, height) / 3 - margin

            //append the svg object to the div called 'my_dataviz'
            var svg = d3.select("#pieAge")
                .attr("viewBox", [0, 0, width, height])
                .attr("width", 200)
                .attr("height", 210)
                .attr("text-anchor", "middle")
                .style("font", "9px sans-serif")

            var pieAge  = svg.append("g")
                .attr("transform", "translate(90,50)");

            d3.select("#pieAge").selectAll("path").remove()
            d3.select("#pieAge").selectAll("text").remove()

            // // Create dummy data
            var data = info["MS Age"]

            color = d3.scaleOrdinal()
                .range(["#03C03C", "#734F96", "#6495ED", "#FF6961", "#008000", "#B57EDC", "#CE1620", "#FFA812"
                        , "#93C572", "#321414", "#800000", "#CC5500", "#8F00FF", "#36454F", "#F4C2C2", "#7B3F00"])

            // Compute the position of each group on the pie:
            var pie = d3.pie()
                .padAngle(0.005)
                .sort(null)
                .value(function(d) {return d.value; })
            
            var data_ready = pie(d3.entries(data))

             arc = d3.arc()
                .innerRadius(radius * 0.6)
                .outerRadius(radius - 6);
            

            // Build the pie chart: Basically, each part of the pie is a path that we build using the arc function.

            pieAge.selectAll("path")
            .data(data_ready).enter().append('path')
            .attr('d', arc )
              .attr('fill', function(d,i){ return(color(i) )})
              .attr("stroke", "white")
              .style("stroke-width", "0px")
              .style("opacity", 0.8)

          //create legends

          	AGE_legend=["0-4","5-9","10-14","15-19","20-24","25-29","30-34","35-39","40-44","45-49","50-54","55-59","60-64","65-69","70-74","75+"];
            var pieAgeLegend = pieAge.selectAll(".pieAgeLegend").data(AGE_legend)
                .enter().append("g")
                .attr("class","pieAgeLegend")
                .attr("transform", function (d,i) {
                        return "translate(" + 0.35*width + "," + (i*12.5-(height/2))+")";
                    });



            pieAgeLegend.append("text").text(function (d) {return d;})
                .style("font-size", "6px")
                .attr("fill", "LightGrey")
                .attr("transform", "translate(30,7)"); //align texts with boxes

            pieAgeLegend.append("rect")
                .attr("fill", function (d, i) {return color(i); })
                .attr("width", 10).attr("height", 10);


          //PIE CHART FOR PERCENTAGE ON IMS FROM TP

          //append the svg object to the div called 'my_dataviz'
            var svg = d3.select("#pieTP")
                .attr("viewBox", [0, 0, width, height])
                // .attr("width", width)
                // .attr("height", height)
                .attr("text-anchor", "middle")
                .style("font", "9px sans-serif")

            var pieTP  = svg.append("g")
                .attr("transform", "translate(" + width/3 + "," + height / 2 + ")");


            d3.select("#pieTP").selectAll("path").remove()
            d3.select("#pieTP").selectAll("text").remove()

            // // Create data
            var data = [info["Total Population"], info["Total MS"]]

            console.log(data)

            //var color = d3.scaleOrdinal(d3.schemeDark2);
            var color = d3.scaleOrdinal().range(["DimGray","Bisque"]);

            // Compute the position of each group on the pie:
            var pie = d3.pie()
                .padAngle(0.005)
                .sort(null)
                .value(function(d) {return d.value; })
            
            var data_ready = pie(d3.entries(data))

             arc = d3.arc()
                .innerRadius(radius * 0.6)
                .outerRadius(radius - 6);
            

            // Build the pie chart: Basically, each part of the pie is a path that we build using the arc function.
            

            pieTP.selectAll("path")
            .data(data_ready).enter().append('path')
            .attr('d', arc )
              .attr('fill', function(d,i){ return(color(i)) })
              .attr("stroke", "white")
              .style("stroke-width", "0px")
              .style("opacity", 0.7)

      //create legends

        label = ["Total Population", "Total MS"]

        var pieTPLegend = pieTP.selectAll(".pieTPLegend").data(label)
            .enter().append("g")
            .attr("class","lineLegend")
            .attr("transform", function (d,i) {
                    return "translate(" + 0.35*width + "," + (i*12.5-(height/2))+")";
                });

        pieTPLegend.append("text").text(function (d) {return d;})
            .style("font-size", "6px")
            .attr("fill", "LightGrey")
            .attr("transform", "translate(31,7)"); //align texts with boxes

        pieTPLegend.append("rect")
            .attr("fill", function (d, i) {return color(i); })
            .attr("width", 8).attr("height", 8);

}
