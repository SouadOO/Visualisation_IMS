var data = []
var set_names = [];
var index_line

function lineChart(filter,gender,age,name_long){

    var dataset = eval(METRIC);

    var primary_key = name_long+"_"+METRIC+"_"+age+"_"+gender

    console.log(primary_key)

    console.log(dataset)

    // set the dimensions and margins of the graph
    var margin = {top: 50, right: 50, bottom: 50, left: 70}
      , width = 1000 - margin.left - margin.right // Use the window's width 
      , height = 400 - margin.top - margin.bottom; // Use the window's height

    
    // Read the Data
    if(!(set_names.includes(primary_key))){

        if (data.length>=4){
        data.pop();
        set_names.pop();
        }

        function read_Data(name_long){ //CHANGE SCALE FOR THE TP

            var datum = []

            console.log(filter)

            switch (filter){

            case "COUNTRY": 

                for (var year=0; year<7; year++){
                    for (major in Major_Areas){
                        for (area in Major_Areas[major]){
                            
                            dataset[year].M_AREAS[major]
                                [Major_Areas[major][area]].COUNTRIES
                                
                                .forEach(function(d){
                                    if(d.Name==name_long){
                                        if(age==="TOTAL"){
                                            datum.push({
                                                key     : dataset[year].YEAR,
                                                value   : (d[gender][age])
                                            })
                                        }
                                        else{
                                            datum.push({
                                                key     : dataset[year].YEAR,
                                                value   : (d[gender].AGE[age])
                                            })
                                        }
                                    }
                                })
                        }
                    }
                }break;

            case "MAJOR-AREA": 

                for (var year=0; year<7; year++){
                    for (major in Major_Areas){
                            
                        d = dataset[year].M_AREAS[major]
                            
                        if(d.Name==name_long){
                            if(age==="TOTAL"){
                                datum.push({
                                    key     : dataset[year].YEAR,
                                    value   : (d[gender][age])
                                })
                            }
                            else{
                                datum.push({
                                    key     : dataset[year].YEAR,
                                    value   : (d[gender].AGE[age])
                                })
                            }
                        }
                        
                    }
                }break;

            case "AREA": 

                for (var year=0; year<7; year++){
                    for (major in Major_Areas){

                        for (area in Major_Areas[major]){
                            
                            d = dataset[year].M_AREAS[major]
                                    [Major_Areas[major][area]]
                                                            
                            if(d.Name==name_long){
                                if(age==="TOTAL"){
                                    datum.push({
                                        key     : dataset[year].YEAR,
                                        value   : (d[gender][age])
                                    })
                                }
                                else{
                                    datum.push({
                                        key     : dataset[year].YEAR,
                                        value   : (d[gender].AGE[age])
                                    })
                                }
                            }
                        }
                    }
                }break;

            case "ALLR":
                for (var year=0; year<7; year++){

                    if(name_long == "Less developed regions"){
                        d = dataset[year].WORLD["LESS_DEV"].TOTAL
                    }

                    else if(name_long === "More developed regions"){
                        d = dataset[year].WORLD["MORE_DEV"]
                    }   
                    

                    
                    if(age==="TOTAL"){
                        datum.push({
                            key     : dataset[year].YEAR,
                            value   : (d[gender][age])
                        })
                    }
                    else{
                        datum.push({
                            key     : dataset[year].YEAR,
                            value   : (d[gender].AGE[age])
                        })
                    }
                    
                }break;

            case "ALLC":
                for (var year=0; year<7; year++){

                    if(name_long === "Least developed countries"){
                        d = dataset[year].WORLD["LESS_DEV"].LESS
                    }

                    else if(name_long === "Less developed countries"){
                        d = dataset[year].WORLD["LESS_DEV"].LEAST
                    }

                    else if(name_long === "More developed countries"){
                        d = dataset[year].WORLD["MORE_DEV"]

                    } 

                    if(age==="TOTAL"){
                        console.log("key "+dataset[year].YEAR)
                        console.log("value "+d[gender][age])
                        datum.push({
                            key     : dataset[year].YEAR,
                            value   : (d[gender][age])
                        })
                    }
                    else{
                        datum.push({
                            key     : dataset[year].YEAR,
                            value   : (d[gender].AGE[age])
                        })
                    }
                }break;

            case "AllR":

                for (var year=0; year<7; year++){
                      
                    if(name_long === "High-income countries"){
                        d = dataset[year].WORLD["HIGHT_INC"]
                        console.log(d)
                    }
                
                    else if(name_long === "Low-income countries"){
                        d = dataset[year].WORLD["LOW_INC"]
                    }
                
                    else if(name_long === "Middle-income countries"){
                        d = dataset[year].WORLD["MIDDLE_INC"]
                    }


                
                    if(age==="TOTAL"){

                        datum.push({
                            key     : dataset[year].YEAR,
                            value   : (d[gender][age])
                        })
                    }
                    else{
                        datum.push({
                            key     : dataset[year].YEAR,
                            value   : (d[gender].AGE[age])
                        })
                    } 
                }break;

            case "AllC":
                for (var year=0; year<7; year++){
                      
                    if(name_long === "High-income countries"){
                        d = dataset[year].WORLD["HIGHT_INC"]
                    }
                
                    else if(name_long === "Low-income countries"){
                        d = dataset[year].WORLD["LOW_INC"]
                    }
                
                    else if(name_long === "Lower-middle-income countries"){
                         d = dataset[year].WORLD["MIDDLE_INC"].LOWER_M
                    }

                    else if(name_long === "Upper-middle-income countries"){
                         d = dataset[year].WORLD["MIDDLE_INC"].UPPER_M
                    }

                
                    if(age==="TOTAL"){

                        datum.push({
                            key     : dataset[year].YEAR,
                            value   : (d[gender][age])
                        })
                    }
                    else{
                        datum.push({
                            key     : dataset[year].YEAR,
                            value   : (d[gender].AGE[age])
                        })
                    } 
                }break;

            case "SSA":
                for (var year=0; year<7; year++){
                    
                    d = dataset[year].WORLD["SUB_SAHARA"]

                    if(age==="TOTAL"){

                        datum.push({
                            key     : dataset[year].YEAR,
                            value   : (d[gender][age])
                        })
                    }
                    else{
                        datum.push({
                            key     : dataset[year].YEAR,
                            value   : (d[gender].AGE[age])
                        })
                    }
                }

            }

            //Multiply the values of the TP by 1,000

            if(METRIC==="TP"){
                datum.forEach(function(d){
                    d.value = Math.round(d.value * 1000);
                    console.log(d.value)
                })
            }
    
            data.unshift(datum)
            set_names.unshift(primary_key);
    
        }
        read_Data(name_long);     

    }
    
    // append the svg object to the body of the page

    d3.select("#svgLine").select("#gLine").selectAll("path").remove()
    d3.select("#svgLine").select("#gLine").selectAll(".lineLegend").remove()

    var svg = d3.select("#svgLine")
                    .attr("width", width + margin.left + margin.right)
                    .attr("height", height + margin.top + margin.bottom)

                .select("#gLine")  
                    .attr("transform",
                  "translate(" + margin.left + "," + margin.top + ")");
             
  

    // Add X axis --> it is a date format
      var xScale = d3.scaleBand()
        .domain(data[0].map(function(d) { return d.key; }))
        .range([ 0, width ])
        .padding(1); 


    // Add Y axis
      var yScale = d3.scaleLinear()
        .domain([0, d3.max(data.flat(), function(d) { 
            return d.value+1000; 
        })])
        .range([ height, 0 ]);

    // Color Scale
    var color = d3.scaleOrdinal(d3.schemeDark2);

    //Line Generator
    var line = d3.line()
        .x(function(d) { return xScale(d.key) })
        
        .y(function(d) { 
            console.log(d.value)
            return yScale(d.value) })  


    //Add the X axis
    xAxis = svg.select("#xAxis")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(xScale));

    //Add the Y axis
    yAxis = svg.select("#yAxis")
        .call(d3.axisLeft(yScale));    



    // Add the line    AS A FUNCTION

    function draw_Line(){

        for(var i=0; i<data.length; i++){
            svg.append("path")
                  .datum(data[i])
                  .attr("fill", "none")
                  .attr("stroke", color(i))
                  .attr("stroke-width", 1.5)
                  .attr("id", set_names[i].split(" ")[0])
                  .attr("d", line)
        }
    }

    draw_Line();


    //create legends
    var lineLegend = svg.selectAll(".lineLegend").data(set_names)
        .enter().append("g")
        .attr("class","lineLegend")
        .attr("transform", function (d,i) {
                return "translate(" + 750 + "," + (i*20)+")";
            });

    lineLegend.append("text").text(function (d) {return d;})
        .attr("transform", "translate(19,9)"); //align texts with boxes

    lineLegend.append("rect")
        .attr("fill", function (d, i) {return color(i); })
        .attr("width", 10).attr("height", 10);



    lineLegend.on("click", function(d){
        var legend = d3.select(this)._groups[0][0].__data__
        svg.select("#"+legend.split(" ")[0]).remove()
        set_names.splice(set_names.indexOf(legend), 1)
        data.splice(set_names.indexOf(legend), 1)
        d3.select(this).remove()
    })
    
    
    

}
