//-----------------The network Function

//filter
var YEAR=0;
var GENDER="B"
var FILTER="GEO"
var OLD_y=1



//initialize data
function init_Net(){

        CLICKED=false;
        BubbleS=[];
        
        
        //set the parameter of the network
        diameter = 1150,
        pi = Math.PI,
        radius = diameter / 2,
        innerRadius = radius - 120;
         
        //Creates a new cluster layout with default settings to produce adendrogram
        cluster = d3.cluster()
            .size([360, innerRadius]);

        //set the function to create links 
        line = d3.radialLine()
            .curve(d3.curveBundle.beta(0.85))
            .radius(function(d) { return d.y; })
            .angle(function(d) { return d.x / 180 * Math.PI; });

        //add svg of the network
        div = d3.select("#hierarchy");
        let svg = div.append("svg")
                 .attr("width", diameter)
                 .attr("height", diameter)
                 .attr("class", "net-svg")
                 .append("g")
                 .attr("transform", "translate(" + radius + "," + radius + ")");

        //create legends
        let legendgroup1_link = svg.append("g")
                    .attr("id", "hierarchylegend1")
                    .attr("transform", "translate(-500, -400)");

        legendgroup1_arc = svg.append("g")
                    .attr("id", "hierarchylegend2")
                    .attr("transform", "translate(-500, -300)");

        let legendgroup2_link = svg.append("g")
                    .attr("id", "hierarchylegend3")
                    .attr("transform", "translate(700, 610)");

        legendgroup2_arc = svg.append("g")
                    .attr("id", "hierarchylegend4")
                    .attr("transform", "translate(700, 700)");

        let legend_N_Scale = d3.scaleOrdinal()
                    .domain(["InGoing IMS Only", "OutGoing IMS Only", "InGoing & OutGoing IMS"])
                    .range(["SkyBlue", "MediumSeaGreen", "PaleVioletRed"])

                    
        let legendOrdinal = d3.legendColor()
                    .shape("path", d3.symbol().type(d3.symbolCircle).size(42)())
                    .shapePadding(7)
                    .scale(legend_N_Scale);


        legendgroup1_link.call(legendOrdinal);
        legendgroup2_link.call(legendOrdinal);




        //set nodes and links elements
        graphgroup = svg.append("g")
                    .attr("transform", "translate(" + (diameter/4 ) + "," + (diameter/10) + ")");
        link     = graphgroup.append("g").attr("id","g_link").selectAll(".link");
        node     = graphgroup.append("g").attr("id","g_node").selectAll(".node");
        MajorArc = graphgroup.append("g").attr("id","g_marc").selectAll(".MArc");
        Arc      = graphgroup.append("g").attr("id","g_arc").selectAll(".arc");
        Circle   = graphgroup.append("g").attr("id","g_circle").selectAll(".circle");
        Info1    = graphgroup.append("g").attr("id","g_inf1").append("text").style("font-size","1rem").attr("transform", "translate(300,-580)");
        Info2    = graphgroup.append("g").attr("id","g_inf2").append("text").style("font-size","1rem").attr("transform", "translate(-800,400)");


        //Set the major area arc and area arc
        SmallArc=d3.arc()
              .innerRadius(radius-109)
              .outerRadius(radius-100)
              .startAngle(function(d){return (findAStartAngle(d.children)-0.1) * pi / 180;})
              .endAngle(function(d){return (findAEndAngle(d.children)+0.1) * pi / 180;});
        BigArc=d3.arc()
              .innerRadius(radius-120)
              .outerRadius(radius-112)
              .startAngle(function(d){return (findMAStartAngle(d.children)-0.1) * pi / 180;})
              .endAngle(function(d){return (findMAEndAngle(d.children)+0.1) * pi / 180;});
        //creading tooltip
        tip = d3.tip()
            .attr('class', 'hierarchy-tip')
            .offset([-30, 0])
            .html(function(d) {
                let point = new GeoPoint(Math.abs(d.data.lon), Math.abs(d.data.lat));
                return "<h7><strong>"+ d.data.name+"</strong></h7>"+
                    "<table>"+
                    "<tr>"+
                    "<td class='tooltipindex'>TOTAL  IMS: </td>"+
                    "<td>  "+d.data.total+"</td>"+
                    "</tr>"+
                    "</table>";
            })

         tip_B = d3.tip()
            .attr('class', 'hierarchy-tip')
            .offset([-30, 0])
            .html(function(d) {
                let point = new GeoPoint(Math.abs(d.data.lon), Math.abs(d.data.lat));
                return "<h7><strong>"+ d.data.name+"</strong></h7>"+
                    "<table>"+
                    "<tr>"+
                    "<td class='tooltipindex'>TOTAL: </td>"+
                    "<td>  "+d.value+"</td>"+
                    "</tr>"+
                    "</table>";
            })  

         tip_circle = d3.tip()
            .attr('class', 'hierarchy-tip')
            .offset([-30, 0])
            .html(function(d) {
                let point = new GeoPoint(Math.abs(d.data.lon), Math.abs(d.data.lat));
                return "<h7><strong>"+ d.data.name+"</strong></h7>"+
                    "<table>"+
                    "<tr>"+
                    "<td class='tooltipindex'>TOTAL IMS: </td>"+
                    "<td>  "+d.data.total+"</td>"+
                    "</tr>"+
                    "</table>";
            }) 
        svg.call(tip);
        svg.call(tip_B);
        svg.call(tip_circle);


        //bubles
        width_b = 800, height_B = 600, sizeDivisor = 100, nodePadding = 2;
        Bubbles_color = d3.scaleOrdinal()
                .domain(["S", "T", "B"])
                .range(["SkyBlue", "MediumSeaGreen", "PaleVioletRed"])

       simulation = d3.forceSimulation()
            .force("forceX", d3.forceX().strength(.1).x(width_b * .5))
            .force("forceY", d3.forceY().strength(.1).y(height_B * .5))
            .force("center", d3.forceCenter().x(width_b * .5).y(height_B * .5))
            .force("charge", d3.forceManyBody().strength(-15));

       
        Bubble = graphgroup.append("g").attr("id","g_bubble").selectAll(".Bubble");


        //set colors of majorArea by order: 
                MA_scale = d3.scaleOrdinal()
                 .domain(["AFRICA","ASIA","EUROPE","LATINAMERICAANDTHECARIBBEAN","NORTHERNAMERICA","OCEANIA",
                            "Moredevelopedregions","Lessdevelopedregions",
                            "High-incomeregions","Middle-incomeregions","Lower-incomeregions",
                            "Sub-SaharanAfrica","NotSub-SaharanAfrica"])
                 //"Orange","Yellow","Blue","Magenta","Green","Red"
                 .range(["Tomato","Yellow","RoyalBlue ","Orchid","IndianRed","DarkOliveGreen",
                            "#916a08","#cc6600",
                            "#916a08","#cc6600","#ffbf80",
                            "#916a08","#cc6600"])
     
}   

// Return a list of imports for the given array of nodes.
function packageIMSLink(nodes){

              map = {},imports = [];

              if(FILTER=="GEO"){
                // Compute a map from name to node.
                  nodes.forEach(function(d) {
                    map[d.data.name] = d;
                  });
                // For each import, construct a link from the source to target node.
                nodes.forEach(function(d) {
                  if (d.data.dest) d.data.dest.forEach(function(i) {
                    if ((i.name!="Other North") && (i.name!="Other South")){
                      source=map[i.name];
                      target=map[d.data.name];

                      path=source.path(target);
                      path.value=i.size;
                      imports.push(path);
                    }
                  });
                });
              }else if (FILTER=="SSA"){
                // Compute a map from name to node.
                  nodes.leaves().forEach(function(d) {
                    map[d.data.name] = d;
                  });


                nodes.children.forEach(function(d){
                        d.data.dest.forEach(function(i) {
                            if ((i.name!="Other North") && (i.name!="Other South")){
                              source=map[i.name];
                              d.data.children.forEach(function(ch){
                                 target=map[ch.name];
                                 path=source.path(target);
                                 path.value=i.size;
                                 imports.push(path);
                              });
                            }
                        });
                    });

              }else{
                // Compute a map from name to node.
                  nodes.leaves().forEach(function(d) {
                    map[d.data.name] = d;
                    //console.log(d.data.name);
                  });
               
                nodes.children.forEach(function(l1){
                    l1.children.forEach(function(d){
                       
                        d.data.dest.forEach(function(i) {
                            
                            if ((i.name!="Other North") && (i.name!="Other South")){
                              source=map[i.name];
                            
                              d.data.children.forEach(function(ch){
                                 target=map[ch.name];
                                 path=source.path(target);
                                 path.value=i.size;
                                 imports.push(path);
                              });
                            }
                        });
                    });
                });
              }
              return imports;
        }

// On click country
function clickNode (d){
            //console.log("click");
            if(CLICKED){
                tip.hide();
                link
                    .classed("link--both", false)
                    .classed("link--target", false)
                    .classed("link--source", false);
                node
                    .classed("node--both", false)
                    .classed("node--target", false)
                    .classed("node--source", false)
                    .classed("nodeClicked", false);
                    CLICKED=false;
            }
            tip.show(d);
            link.classed("hidden",true);

            d3.select(this).classed("nodeClicked",true);

            node.each(function (n) {
                    n.target = n.source = false;
                });
            link.each(function (l) {
                    if (l.target === d)
                        l.source.source = true;
                    if (l.source === d)
                        l.target.target = true;
                    
                })
            
            BubbleS=[];
            link
                .classed("link--both", function (l) {
                    if (l.target === d) {
                        isTarget=l.source.target && l.source.source;
                        if(isTarget){
                            l.source.value=l.value;
                            l.source.D_type="B";
                            if(! BubbleS.includes(l.source))
                                BubbleS.push(l.source);
                        }
                        return isTarget;
                    } else if (l.source === d) {
                        let isSource=l.target.target && l.target.source;
                        if(isSource){
                            l.target.D_type="B";
                            if(! BubbleS.includes(l.target))
                                BubbleS.push(l.target);
                        }
                        return isSource;
                    } else {
                        return false;
                    }
                })
                .classed("link--source", function (l) {
                    if (l.target === d) {
                        let isSource=l.source.source && !l.source.target;
                        if(isSource){
                            l.source.value=l.value;
                            l.source.D_type="S";
                            if(! BubbleS.includes(l.source))
                                BubbleS.push(l.source);
                        }
                        return isSource;
                    } else {
                        return false;
                    }
                })
                .classed("link--target", function (l) {
                    if (l.source === d) {
                        let isTarget=l.target.target && !l.target.source;
                        if(isTarget){
                            l.target.value=l.value;
                            l.target.D_type="T";
                            if(! BubbleS.includes(l.target))
                                BubbleS.push(l.target);
                        }
                        return isTarget;
                    } else {
                        return false;
                    }
                })
                .filter(function (l) {
                    return l.target === d || l.source === d;
                })
                .raise();
            node
                .classed("node--target", function (n) {
                    return n.target && !n.source;
                })
                .classed("node--source", function (n) {
                    return n.source && !n.target;
                })
                .classed("node--both", function (n) {
                    return n.target && n.source;
                });
            CLICKED=true;      
            drawBubules();        
        };

//On click Arc 
function clickArc (d,t,s){

            if(CLICKED){
                tip.hide();
                tip_B.hide();
                link
                    .classed("link--both", false)
                    .classed("link--target", false)
                    .classed("link--source", false);
                node
                    .classed("node--both", false)
                    .classed("node--target", false)
                    .classed("node--source", false);
                    CLICKED=false;
            }
            tip.show(d);
            link.classed("hidden",true);

            node.each(function (n) {
                    n.target = n.source = false;
             });

            link.each(function (l) {
                    if (l[t] === d)
                        l.source.source = true;
                    if (l[s] === d)
                        l.target.target = true;
                    
                });

            BubbleS=[];
            link
                .classed("link--both", function (l) {
                    if (l[t] === d) {
                        isTarget=l.source.target && l.source.source;
                        if(isTarget){
                            l.source.value=l.value;
                            l.source.D_type="B";
                            if(! BubbleS.includes(l.source))
                                BubbleS.push(l.source);
                        }
                        return isTarget;
                    } else if (l[s] === d) {
                        let isSource=l.target.target && l.target.source;
                        if(isSource){
                            l.target.D_type="B";
                            if(! BubbleS.includes(l.target))
                                BubbleS.push(l.target);
                        }
                        return isSource;
                    } else {
                        return false;
                    }
                })
                .classed("link--source", function (l) {
                    if (l[t] === d) {
                        let isSource=l.source.source && !l.source.target;
                        if(isSource){
                            l.source.value=l.value;
                            l.source.D_type="S";
                            if(! BubbleS.includes(l.source))
                                BubbleS.push(l.source);
                        }
                        return isSource;
                    } else {
                        return false;
                    }
                })
                .classed("link--target", function (l) {
                    if (l[s] === d) {
                        let isTarget=l.target.target && !l.target.source;
                        if(isTarget){
                            l.target.value=l.value;
                            l.target.D_type="T";
                            if(! BubbleS.includes(l.target))
                                BubbleS.push(l.target);
                        }
                        return isTarget;
                    } else {
                        return false;
                    }
                })
                .filter(function (l) {
                    return l.target === d || l.source === d;
                })
                .raise();
            node
                .classed("node--target", function (n) {
                    return n.target && !n.source;
                })
                .classed("node--source", function (n) {
                    return n.source && !n.target;
                })
                .classed("node--both", function (n) {
                    return n.target && n.source;
                });
            CLICKED=true;  
            drawBubules();         
        };

//Get the start point of an major arc
function findMAStartAngle(children) {

            if(FILTER=="SSA"){
                    console.log(children)
                    var min = children[0].x;
                    name=children[0].data.name;
                    children.forEach(function(i) {
                        if (i.x < min)
                           min = i.x;
                           name=i.data.name;
                    });
            }else{
                var min = children[0].children[0].x;
                name=children[0].children[0].data.name;
                children.forEach(function(d) {
                    d.children.forEach(function(i){
                      if (i.x < min)
                       min = i.x;
                       name=i.data.name;
                    })    
                });
            }
            return min;
        };

//Get the end point of an major arc
function findMAEndAngle(children) {

            if(FILTER=="SSA"){
                            console.log(children)
                            var max = children[0].x;
                            name=children[0].data.name;
                            children.forEach(function(i) {
                                if (i.x > max)
                                   max = i.x;
                                   name=i.data.name;
                            });
            }else{
                var max = children[0].children[0].x;
                name=children[0].children[0].data.name;
                children.forEach(function(d) {
                    d.children.forEach(function(i){
                      if (i.x > max)
                       max = i.x;
                       name=i.data.name;
                    })    
                });
            }
            //console.log(name);
            return max;
        };

//Get the start point of an arc
function findAStartAngle(children) {

            //console.log(children);

            var min = children[0].x;
            name=children[0].data.name;
            children.forEach(function(d) {
                if (d.x < min){
                   min = d.x;
                   name=i.data.name;  
                   } 
            });
            //console.log(name);
            return min;
        };

//Get the end point of an arc
function findAEndAngle(children) {
            var max = children[0].x;
            name=children[0].data.name;
            children.forEach(function(d) {
                if (d.x > max){
                   max = d.x;
                   name=d.data.name;
                }  
            });
            //console.log(name);
            return max;
        };       

//colorise the arcs by gender
function coloriseArcs(d){

                

            
                let id=d.data.name;
                let color=MA_scale(id.replace(/\s/g, ''));

                
                if(FILTER!="SSA"){
                    //sort the child by total IMS
                    ord_list=[];
                    d.children.forEach(function(d){
                        ord_list.push(d.data.total);
                        
                    })
                    ord_list.sort(function (a,b) {return a - b;});
                    let n=d.children.length;
                    let m_area_scale=d3.scaleLinear()
                                    .domain([-3,n-1])
                                    .range(["white", color]);
                    d.children.forEach(function(b){
                        name=b.data.name.replace(/\s/g, '');
                        d3.select("#"+name)
                            .attr("fill",m_area_scale(ord_list.indexOf(b.data.total)));
                    })
                }
                
                //change legends

                if (FILTER=="GEO"){
                        leg = d3.scaleOrdinal()
                                .domain(["AFRICA","ASIA","EUROPE","LATIN AMERICA AND THE CARIBBEAN","NORTHERN AMERICA","OCEANIA"])
                                .range(["Tomato","Yellow","RoyalBlue ","Orchid","IndianRed","DarkOliveGreen"]);}
                else if(FILTER=="DEV"){
                        leg = d3.scaleOrdinal()
                                .domain(["More developed regions","Less developed regions"])
                                .range([ "#916a08","#cc6600"]);}
                else if(FILTER=="INC")      {
                        leg = d3.scaleOrdinal()
                                .domain(["High-income regions","Middle-income regions","Lower-income regions"])
                                .range([ "#916a08","#cc6600","#ffbf80"]);}
                else{
                        leg = d3.scaleOrdinal()
                                .domain(["SSA","not SSA"])
                                .range([ "#916a08","#cc6600"]);}

                legendArc = d3.legendColor()
                    .shape("path", d3.symbol().type(d3.symbolSquare).size(42)())
                    .shapePadding(7)
                    .scale(leg);


                legendgroup2_arc.call(legendArc);


                if (FILTER=="GEO"){
                        leg = d3.scaleOrdinal()
                                .domain(["AFRICA","ASIA","EUROPE","LATIN AMERICA AND THE CARIBBEAN","NORTHERN AMERICA","OCEANIA"])
                                .range(["Tomato","Yellow","RoyalBlue ","Orchid","IndianRed","DarkOliveGreen"]);}
                else if(FILTER=="DEV"){
                        leg = d3.scaleOrdinal()
                                .domain(["More developed regions","Less developed regions"])
                                .range([ "#4d2600","#cc6600"]);}
                else if(FILTER=="INC")      {
                        leg = d3.scaleOrdinal()
                                .domain(["High-income regions","Middle-income regions","Lower-income regions"])
                                .range([ "#4d2600","#cc6600","#ffbf80"]);}
                else{
                        leg = d3.scaleOrdinal()
                                .domain(["SSA","not SSA"])
                                .range([ "#4d2600","#cc6600"]);}

                legendArc = d3.legendColor()
                    .shape("path", d3.symbol().type(d3.symbolSquare).size(42)())
                    .shapePadding(7)
                    .scale(leg);

                legendgroup1_arc.call(legendArc);
                
                return color;
        };

//Draw the bubles of source destination of selected country
function drawBubules(){


           

            d3.select("#g_bubble").selectAll(".Bubble").remove();

            BubbleS.forEach(types);

            // sort the nodes so that the bigger ones are at the back
            BubbleS = this.BubbleS.sort(function(a,b){ return b.size - a.size; });

            console.log(BubbleS);
            
            BubbleS.forEach(function(d){
                 //console.log(BubbleS);
            })
           

            simulation
                  .nodes(this.BubbleS)
                  .force("collide", d3.forceCollide().strength(.5).radius(function(d){ return d.radius + nodePadding; }).iterations(1))
                  .on("tick", function(d){
                    node
                        .attr("cx", function(d){ return d.x; })
                        .attr("cy", function(d){ return d.y; })
                  });

            var node = Bubble.data(BubbleS)
                .enter().append("circle")
                .attr("class", "Bubble")
                .attr("r", function(d) {return d.radius; })
                .attr("stroke-width", function(d) {return d.radius*0.1; })
                .attr("stroke", function(d){
                    if(FILTER=="SSA"){id=d.parent.data.name;}
                    else {id=d.parent.parent.data.name;}
                    return MA_scale(id.replace(/\s/g, ''));
                })
                .attr("stroke-opacity",0.4)
                .attr("fill", function(d) { return Bubbles_color(d.D_type); })
                .attr("cx", function(d){ return d.x; })
                .attr("cy", function(d){ return d.y; })
                .attr("transform", "translate(-400,-300)")
                .on("mouseover",tip_B.show)
                .on("mouseout",tip_B.hide)
                .call(d3.drag()
                    .on("start", dragstarted)
                    .on("drag", dragged)
                    .on("end", dragended));
                

            function dragstarted(d) {
              if (!d3.event.active) simulation.alphaTarget(.9).restart();
              d.fx = d.x;
              d.fy = d.y;
            }

            function dragged(d) {
              d.fx = d3.event.x;
              d.fy = d3.event.y;
            }

            function dragended(d) {
              if (!d3.event.active) simulation.alphaTarget(.03);
              d.fx = null;
              d.fy = null;
            }

            function types(d){
              d.value = +d.value;
              d.size = scaleBubbles(d.value);
              d.size < 3 ? d.radius = 3 : d.radius = d.size;
              return d;
            }

        };

//Draw the map with geographic filter
function drawNetGEO(){

                //Remove all
                d3.select("#g_link").selectAll(".link").remove();
                d3.select("#g_node").selectAll(".node").remove();
                d3.select("#g_marc").selectAll(".MArc").remove();
                d3.select("#g_arc").selectAll(".arc").remove();
                d3.select("#g_circle").selectAll(".circle").remove();
                d3.select("#g_bubble").selectAll(".Bubble").remove();
                tip.hide();
                tip_B.hide();
                tip_circle.hide();

                link     = d3.select("#g_link").selectAll(".link");
                node     = d3.select("#g_node").selectAll(".node");
                MajorArc = d3.select("#g_marc").selectAll(".MArc");
                Arc      = d3.select("#g_arc").selectAll(".arc");
                Circle   = d3.select("#g_circle").selectAll(".circle");

                //load data wrt to the gender
                let path="data/IMS_"+GENDER+"_DESTINATION.json"



                d3.json(path)
                  .then(function(classes) {

                      //extract data with respect to the year and the filter
                      classes=eval("classes["+YEAR+"]"+"."+eval("FILTER"));



                      //Lays out the specified root hierarchy(x and y of each node)
                      root = d3.hierarchy(classes)
                          .sum(function(d) { return d.size; });
                      cluster(root);

                      
                      
                      // extract the package of IMS relation
                      if(FILTER=="GEO"){
                        IMS_relation=packageIMSLink(root.leaves());}
                      else{
                        IMS_relation=packageIMSLink(root);}

                      //Extract total IMS 
                     if (FILTER=="SSA" || FILTER=="GEO"){

                            if(FILTER=="SSA") {
                                data_for_max= root.children;
                            }else {
                                data_for_max= root.leaves();}

                            Max_Total_IMS=d3.max(data_for_max, function(d){ return d.data.total;});
                            Max_IMS=d3.max(data_for_max, function(d){ 
                                        max=0;
                                        d.data.dest.forEach(function(c){
                                                  if (c.size>max){max=c.size;} });
                                        return max;});
                            b_min=2;b_max=200;
                     }else{
                        Max_Total_IMS=d3.max(root.children, function(d){ 
                                    d.children.forEach(function(b){
                                        return d.data.total;})
                        });

                        

                        Max_IMS=d3.max(root.children, function(d){ 
                                    max=0;
                                    d.data.dest.forEach(function(c){
                                              if (c.size>max){max=c.size;} });
                                    return max;});
                        b_min=2;b_max=10;
                    }

                  

                    //set the scale of links and Bubbles
                    scaleLink=d3.scaleLinear().range([0.3, 6]).domain([0, Max_IMS]);
                    scaleCircle = d3.scaleLinear()
                                    .domain([1, Max_Total_IMS])
                                    .range([1, 15]);
                    scaleBubbles=d3.scaleLinear()  
                                .domain([0, Max_IMS])
                                .range([b_min, b_max]);       


                       //add links based on the available data
                       link = link
                                .data(IMS_relation)
                                .enter().append("path")
                                .each(function(d) { 
                                     d.source= d[0], d.target = d[d.length - 1]; })
                                .attr("class", "link")
                                .style("stroke-width", function(d){
                                    if(FILTER=="GEO"){
                                            return  scaleLink(d.value);}
                                    else
                                           return "0.1";

                                }) 
                                .attr("d", line);
                        




                        //Add Circles to present the total
                        Circle.data(root.leaves())
                            .enter()
                            .append("circle")
                            .attr("class", "circle")
                            .attr("transform", function(d) { return "rotate(" + (d.x - 90) + ")translate(" + (d.y + 35) + ",0)" + (d.x < 180 ? "" : "rotate(180)"); })
                            .each(function(d){
                                d.r= scaleCircle(d.data.total); 
                              })
                            .attr("r",function(d){return d.r;})
                            .attr("fill","Wheat")
                            .on("mouseover",function(d){
                                tip_circle.show(d);
                            })
                            .on("mouseout",function(d){
                                tip_circle.hide();
                            });


                        //add data to nodes     
                        node = node.data(root.leaves())
                            .enter().append("text")
                            .attr("class", "node")
                            .attr("id",function(d) {let name=d.data.name.toUpperCase(); return name.replace(/\s/g, '');})
                            .attr("dy", "0.31em")
                            .attr("transform", function(d) { return "rotate(" + (d.x -90) + ")translate(" + (d.y + 52) + ",0)" + (d.x < 180 ? "" : "rotate(180)"); })
                            .attr("text-anchor", function(d) { return d.x < 180 ? "start" : "end"; })
                            .text(function(d) { return d.data.name; })
                            .on("mouseover",function(d){
                              tip_circle.show(d);
                              Info1.text("Country :"+d.data.name);
                              Info2.text("Country :"+d.data.name);})
                            .on("mouseout",function(d){
                              tip_circle.hide();
                            })
                            .on("click",clickNode);

                        if(FILTER!="SSA"){
                        //Add data to arcs
                        root.children.forEach(function(d){
                                Arc.data(d.children)
                                .enter().append("path")
                                .attr("class", "arc")
                                .attr("id",function(d) {let name=d.data.name; return name.replace(/\s/g, '');})
                                .attr("d", SmallArc)
                                .style("opacity",0.4)
                                .on("mouseover",function(d){
                                  tip_circle.show(d);
                                  Info1.text("Area :"+d.data.name);
                                  Info2.text("Area :"+d.data.name);
                                })
                                .on("mouseout",function(d){
                                  tip_circle.hide();
                                })
                                .on("click", function(d){
                                    clickArc (d,5,1);});
                                });
                        }
                        

                        //Add data to Major Arcs
                        MajorArc.data(root.children)
                                .enter().append("path")
                                .attr("class", "MArc")
                                .attr("d",BigArc)
                                .attr("fill", coloriseArcs)//coloriseArcs)
                                .style("opacity",0.4)
                                .attr("id",function(d){let id=d.data.name;return id.replace(/\s/g, '');})
                                .on("mouseover",function(d){
                                  tip_circle.show(d);})
                                .on("mouseout",function(d){
                                  tip_circle.hide();
                                  Info1.text("Major Area :"+d.data.name);
                                  Info2.text("Major Area :"+d.data.name);
                                })
                                .on("click", function(d){clickArc (d,4,2);});

                        

                        //serach bar
                        country_search=[]
                        root.leaves().forEach(function(d){
                            country_search.push(d.data.name.replace(/\s/g, ''));
                        })

                        });
        };




//--------------------------------------------------------------------------------------------change filter
function changeYear(v){

  //change YEAR
  YEAR=eval("v");

  document.getElementsByTagName("header")[parseInt(v)+1].style.backgroundColor="#B8860B";
  document.getElementsByTagName("header")[OLD_y].style.backgroundColor="Beige";
  OLD_y=parseInt(v)+1;

  //update network
   drawNetGEO();
}

function changeGender(v){     
      GENDER=eval("v");
      drawNetGEO();
      
 }


function changeFilter(v){

    //Save new value
     FILTER=eval("v");

    //update netwrk
    drawNetGEO();
}


init_Net();
drawNetGEO();

