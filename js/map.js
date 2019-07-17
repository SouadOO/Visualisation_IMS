// Global var 
var projection       =null;

//data
var IMS              =null;
var TP               =null;
var IMS_TP           =null;
var IMS_DISTRIBUTION =null;
var FEMALE_IMS       =null;
var IMS_F_DESTINATION=null;
var IMS_M_DESTINATION=null;
var IMS_B_DESTINATION=null;
var IMS_RATE         =null;
var IMS_IRS          =null;
var MAP=null;

//filter
var YEAR=0;
var AGE="TOTAL"
var GENDER="F"
var METRIC="IMS"
var FILTER="GEO" // GEO,DEV,INC,SSA
var SUB_FILTER="COUNTRY" // MAJOR-AREA,AREA,COUNTRY.   MORE,LESS,LESS,LESS-LEAST. HIGH,MIDDLE,UPPER-M,UPPER-L  
var OLD_y=1
var OLD_C=null
var country_search=[]


//data STRUCTURE
var Major_Areas = {

    AFRICA: ["EASTERN", "MIDDLE", "NORTHERN", "SOUTHERN", "WESTHERN"],
    ASIA : ["CENTRAL", "EASTERN", "SOUTHERN", "SOUTH_ESTEARN", "WESTHERN"],
    EUROPE : ["NORTHERN", "EASTERN", "SOUTHERN", "WESTHERN"],
    LATIN_AMERICA : ["CARIBBEAN", "CENTRAL", "SOUTH"],
    NORTH_AMERICA : ["NORTH_AMERICA"],
    OCEANIA : ["AUST_NEW_ZE", "MELANESIA", "MICRONESIA", "POLYNESIA"]
}
var continent = ["AFRICA", "ASIA", "EUROPE", "LATIN_AMERICA", "NORTH_AMERICA", "OCEANIA"]

//Current data
C_DATA=null;
MAX=null;


//----------------------Onchange filter

function changeYear(v){

  //change YEAR
  YEAR=eval("v");

  document.getElementsByTagName("header")[parseInt(v)+1].style.backgroundColor="#B8860B";
  document.getElementsByTagName("header")[OLD_y].style.backgroundColor="Beige";
  OLD_y=parseInt(v)+1;

  //Extract data
    C_DATA=extractMetric();
    MAX=sum(d3.values(C_DATA));

  //Upload map
    UpdateMap(C_DATA);

  //update network
  // drawNetGEO();
}

function changefilterMetric(v){

  METRIC=eval("v");
  console.log(METRIC);


   if(METRIC=="FEMALE_IMS"){
        document.getElementById("F").checked = true;
        GENDER="F";
    }

    //Extract data
    C_DATA=extractMetric();
    MAX=sum(d3.values(C_DATA));

    //Upload map
    UpdateMap(C_DATA);
 }

function changeGender(v){
      
      //check metric
      if(METRIC=="FEMALE_IMS"){
              document.getElementById("F").checked = true;
              GENDER="F";
              alert("Female metric is only for female !!");
      }else{
          //Change value
          GENDER=eval("v");
          console.log(GENDER);

          //Extract data
          DATA=extractMetric();
          MAX=sum(d3.values(C_DATA));

          //Upload map
          UpdateMap(DATA);

          //update network
          //drawNetGEO();
      }
 }

function changeAge(v){

    //Save new value
     AGE=eval("v");
     console.log(AGE);

    //Extract data
      C_DATA=extractMetric();
      MAX=sum(d3.values(C_DATA));
    //Upload map
      UpdateMap(C_DATA);
}

function changeFilter(v){

    //Save new value
     FILTER=eval("v");
     console.log(FILTER);

    //change the list of option for the sub filter
    switch (v){
        case "GEO":
           document.getElementById("Div-Sub-filter").style.visibility = "visible";
           newValue=["COUNTRY","MAJOR-AREA","AREA"];
           newText=["Country","Major Area","Area"];
           SUB_FILTER="COUNTRY";
           break;
        case "DEV":
           document.getElementById("Div-Sub-filter").style.visibility = "visible";
           newValue=["ALLR","ALLC"];// TOTAL :Less region and LESS:less countries
           newText=["MORE/LESS developed region","MORE/LESS/LEAST developed contries"];
           SUB_FILTER="ALLR";
           break;
        case "INC":
           document.getElementById("Div-Sub-filter").style.visibility = "visible";
           newValue=["AllR","AllC"];
           newText=["High/Middle/Low Income regions ","Low/Upper-middle/Lower-Middle/lower Income countries"];
           SUB_FILTER="AllR";
           break;
        case "SSA":
           document.getElementById("Div-Sub-filter").style.visibility = "hidden";
           SUB_FILTER="SSA";
           newValue=[],newText=[];
           break;
    }

     //Remove all options from the select list 
        select=document.getElementById("sub_filter");
        select.innerHTML = "";

    // Insert the new ones from the array above 
    for(i=0;i<newValue.length;i++) {
        var option = document.createElement("option");
        option.text=newText[i];option.value=newValue[i];
        select.add(option);
    }

    //Extract data
     C_DATA=extractMetric();
     MAX=sum(d3.values(C_DATA));
    //Upload map
     UpdateMap(C_DATA);

    //update netwrk
    //drawNetGEO();
}

function changeSubFilter(v){

  //Save new value
  SUB_FILTER=eval("v");
  console.log(SUB_FILTER);

  //Extract data
    C_DATA=extractMetric();
    MAX=sum(d3.values(C_DATA));

  //Upload map
    UpdateMap(C_DATA);
}




//---------------------Initial drawing for the Map
function drawMap(world) {
    projection = d3.geoMercator().scale(150).translate([500, 200]);
    const path = d3.geoPath().projection(projection);

    map_tip = d3.tip()
            .attr('class', 'hierarchy-tip')
            .offset([-30, 0])
            .html(function(name,v,p) {
                let point = new GeoPoint(Math.abs(1000), Math.abs(0));
                return "<h7><strong>"+ name+"</strong></h7>"+
                    "<table>"+
                    "<tr>"+
                    "<td class='tooltipindex'>TOTAL: </td>"+
                    "<td>  "+v+"</td>"+
                    "</tr>"+
                    "<tr>"+
                    "<td class='tooltipindex'>Percentage: </td>"+
                    "<td>  "+p+"% </td>"+
                    "</tr>"+
                    "</table>";
            })   
    d3.select("#SvgMap").call(map_tip);

    d3.select("#map").selectAll("path")
      .data(world.features)
      .enter()
      .append("path")
      .attr("d", path)
      .attr("id", function(){
              name=d3.select(this)._groups[0][0].__data__.properties.name_long.toUpperCase();
              country_search.push(name);
              return name;
      })
      //.attr("class","countries")
      .on("click", function(){
            switch (SUB_FILTER){
              case "COUNTRY"   : name=d3.select(this)._groups[0][0].__data__.properties.name_long ; break;
              case "MAJOR-AREA": name=d3.select(this)._groups[0][0].__data__.properties.continent ; break;
              case "AREA"      : name=d3.select(this)._groups[0][0].__data__.properties.subregion ; break;
              case "ALLR"      : name=d3.select(this)._groups[0][0].__data__.properties.economy   ;
                                 if (name.substring(0, 1)=="L")
                                    name="Less developed regions";
                                 break;

              case "ALLC"      : name=d3.select(this)._groups[0][0].__data__.properties.economy   ;
                                 if(name.substring(0, 4)=="Less")
                                        name="Less developed countries";
                                 if (name=="More developed regions")
                                       name="More developed countries";
                                 break;
              case "AllR"      : name=d3.select(this)._groups[0][0].__data__.properties.income_grp;
                                 if ((name=="Lower-middle-income countries") || (name=="Upper-middle-income countries"))
                                        name="Middle-income countries";
                                 break;
              case "AllC"      : name=d3.select(this)._groups[0][0].__data__.properties.income_grp; break;
              case "SSA"       : name=d3.select(this)._groups[0][0].__data__.properties.region_wb
            }

            //Call Of Functions

            //Update the Infomation Side Panel
            infoPanel(SUB_FILTER, YEAR, GENDER, name)

            //Create the Line Chart
            lineChart(SUB_FILTER, GENDER, AGE, name);

            //open info bar
            var nav = document.getElementById("FilterNav");
            if(nav.style.width == "0px"){
              document.getElementById("info").click();
            }else{
              document.getElementById("info").click();
              document.getElementById("info").click();
            }

            d3.select(this).style("stroke", "#B8860B");
            d3.select(this).style("stroke-width", "2px");

            if (OLD_C) {
              OLD_C.style("stroke", "Azure");
              OLD_C.style("stroke-width", "0.1px");}


            OLD_C=d3.select(this);
            
      })
      .on("mouseover", function(d) { 


                      
            switch (SUB_FILTER){
              case "COUNTRY"   : name=d3.select(this)._groups[0][0].__data__.properties.name_long.toUpperCase() ; break;
              case "MAJOR-AREA": name=d3.select(this)._groups[0][0].__data__.properties.continent ; break;
              case "AREA"      : name=d3.select(this)._groups[0][0].__data__.properties.subregion ; break;
              case "ALLR"      : name=d3.select(this)._groups[0][0].__data__.properties.economy   ;
                                 if (name.substring(0, 1)=="L")
                                    name="Less developed regions";
                                 break;

              case "ALLC"      : name=d3.select(this)._groups[0][0].__data__.properties.economy   ;
                                 if(name.substring(0, 4)=="Less")
                                        name="Less developed countries";
                                 if (name=="More developed regions")
                                       name="More developed countries";
                                 break;
              case "AllR"      : name=d3.select(this)._groups[0][0].__data__.properties.income_grp;
                                 if ((name=="Lower-middle-income countries") || (name=="Upper-middle-income countries"))
                                        name="Middle-income countries";
                                 break;
              case "AllC"      : name=d3.select(this)._groups[0][0].__data__.properties.income_grp; break;
              case "SSA"       : name=d3.select(this)._groups[0][0].__data__.properties.region_wb
            }

            value=C_DATA[name];
            percentage=(value/MAX).toFixed(2);

            //for undifined value
            if(typeof(value)!=="number"){
              value="NA";
              percentage="NA";
            }

            
            map_tip.show(name,value,percentage);

            
            })          
      .on("mouseout", function(d) {   
            map_tip.hide();
            
        });

    //colorisation of the map with default values IMS  
    C_DATA=extractMetric(IMS);

    MAX=sum(d3.values(C_DATA));
      UpdateMap(C_DATA);

}


//-------------------Extract Data wrt to the filters:
function extractMetric(data,gender="B",year=0){
    var total={};

    data=eval(METRIC);

    switch (FILTER){
          
          case "GEO":
                switch (SUB_FILTER){
                    case "MAJOR-AREA":
                            for (major in Major_Areas){
                                for (area in Major_Areas[major]){
                                    d=data[YEAR].M_AREAS[major]
                                    if(AGE=="TOTAL"){path="d."+eval("GENDER")+".TOTAL";}
                                    else{path="d."+eval("GENDER")+".AGE."+eval("AGE");}
                                    total[d.Name]=eval(path);
                                        
                                }
                            }
                            return total;  

                    case "AREA":
                           for (major in Major_Areas){
                                for (area in Major_Areas[major]){
                                    d=data[YEAR].M_AREAS[major]
                                        [Major_Areas[major][area]];
                                    if(AGE=="TOTAL"){path="d."+eval("GENDER")+".TOTAL";}
                                    else{path="d."+eval("GENDER")+".AGE."+eval("AGE");}
                                    total[d.Name]=eval(path);
                                        
                                }
                            }
                            return total; 

                    case "COUNTRY":
                            for (major in Major_Areas){
                                for (area in Major_Areas[major]){
                                    data[YEAR].M_AREAS[major]
                                        [Major_Areas[major][area]].COUNTRIES
                                        .forEach(function(d){
                                            if(AGE=="TOTAL"){path="d."+eval("GENDER")+".TOTAL";}
                                            else{path="d."+eval("GENDER")+".AGE."+eval("AGE");}
                                            total[d.Name.toUpperCase()]=eval(path);
                                        })
                                }
                            }
                            return total;
                    }      
                break;
          case "DEV":  
                 switch (SUB_FILTER){
                    case "ALLR":
                          d=data[YEAR].WORLD.MORE_DEV
                              if(AGE=="TOTAL"){path="d."+eval("GENDER")+".TOTAL";}
                              else{path="d."+eval("GENDER")+".AGE."+eval("AGE");}
                              total[d.Name]=eval(path);
                          d=data[YEAR].WORLD.LESS_DEV.TOTAL
                              if(AGE=="TOTAL"){path="d."+eval("GENDER")+".TOTAL";}
                              else{path="d."+eval("GENDER")+".AGE."+eval("AGE");}
                              total[d.Name]=eval(path);

                          return total;
                    case "ALLC":
                          d=data[YEAR].WORLD.LESS_DEV.LESS
                              if(AGE=="TOTAL"){path="d."+eval("GENDER")+".TOTAL";}
                              else{path="d."+eval("GENDER")+".AGE."+eval("AGE");}
                              total[d.Name]=eval(path);
                          d=data[YEAR].WORLD.LESS_DEV.LEAST
                              if(AGE=="TOTAL"){path="d."+eval("GENDER")+".TOTAL";}
                              else{path="d."+eval("GENDER")+".AGE."+eval("AGE");}
                              total[d.Name]=eval(path);
                          d=data[YEAR].WORLD.MORE_DEV
                              if(AGE=="TOTAL"){path="d."+eval("GENDER")+".TOTAL";}
                              else{path="d."+eval("GENDER")+".AGE."+eval("AGE");}
                              name=d.Name;
                              if ((d.Name=="More developed regions"))
                                    name="More developed countries";
                              total[name]=eval(path);

                          return total;
                    }
                 break;
          case "INC":
                switch (SUB_FILTER){
                    case "AllR":
                          ["HIGHT_INC","MIDDLE_INC","LOW_INC"].forEach(function(db){
                              d=eval("data[YEAR].WORLD."+db);
                              if(AGE=="TOTAL"){path="d."+eval("GENDER")+".TOTAL";}
                              else{path="d."+eval("GENDER")+".AGE."+eval("AGE");}
                              total[d.Name]=eval(path);
                            });
                          return total;
                    case "AllC":
                          
                          ["HIGHT_INC","MIDDLE_INC","LOW_INC"].forEach(function(db){
                            if(db=="MIDDLE_INC"){
                              ["UPPER_M","LOWER_M"].forEach(function(b){
                                d=eval("data[YEAR].WORLD.MIDDLE_INC."+b);
                                if(AGE=="TOTAL"){path="d."+eval("GENDER")+".TOTAL";}
                                else{path="d."+eval("GENDER")+".AGE."+eval("AGE");}
                                total[d.Name]=eval(path);
                              });
                            }else{
                              d=eval("data[YEAR].WORLD."+db);
                              if(AGE=="TOTAL"){path="d."+eval("GENDER")+".TOTAL";}
                              else{path="d."+eval("GENDER")+".AGE."+eval("AGE");}
                              total[d.Name]=eval(path);
                            }});
                          return total;
                    }
                break;

          case "SSA":
                d=data[YEAR].WORLD.SUB_SAHARA
                if(AGE=="TOTAL"){path="d."+eval("GENDER")+".TOTAL";}
                else{path="d."+eval("GENDER")+".AGE."+eval("AGE");}
                total[d.Name]=eval(path);
                return total;
    }
}

//------------------------Update map with new data
function UpdateMap(data){
    
   

    //Scale
    l=d3.keys(data).length;
    x=Math.min(l,10);
    colorScale = d3.scaleSequential(d3["interpolate" + "Oranges"]).domain([0, d3.max(d3.values(data))]).nice(x);

    //Legend 
    w=600/x;
    d3.select("#map").selectAll(".legend").remove();
    legend = d3.select("#map").selectAll(".legend")
                  .data(colorScale.ticks(x).slice(1))
                  .enter().append("g")
                  .attr("class", "legend")
                  .attr("transform", function(d, i) { return "translate("+(150 + i * w)+",400)"; });
    legend.append("rect")
          .attr("width", w)
          .attr("height", 5)
          .style("fill", colorScale);  
    legend.append("text")
          .attr("x", w)
          .attr("y", -5)
          .style("class", "legend_text")
          .text(String);


    //if is AREA
    d3.select("#map")
      .selectAll("path")
      .attr("fill", function(d,i){

                  switch (FILTER){

                        case "GEO":
                                switch (SUB_FILTER){
                                        case "MAJOR-AREA":
                                            id=d3.select(this)._groups[0][0].__data__.properties.continent;
                                            //console.log(id);
                                            break
                                        case "AREA":
                                            id=d3.select(this)._groups[0][0].__data__.properties.subregion;
                                            //console.log(id);

                                            break;
                                        case "COUNTRY":
                                            var id = d3.select(this).attr("id");
                                        }
                                break;
                        case "DEV":

                                id=d3.select(this)._groups[0][0].__data__.properties.economy;

                                if(SUB_FILTER=="ALLC"){
                                  if(id.substring(0, 4)=="Less")
                                    id="Less developed countries";
                                  if (id=="More developed regions")
                                    id="More developed countries";

                                }
                                else if (SUB_FILTER=="ALLR"){
                                    if (id.substring(0, 1)=="L")
                                    id="Less developed regions";
                                }
                                //console.log(id);
                                break;
                        case "INC":
                              id=d3.select(this)._groups[0][0].__data__.properties.income_grp;
                              if(SUB_FILTER=="AllR"){
                                if ((id=="Lower-middle-income countries") || (id=="Upper-middle-income countries")){
                                  id="Middle-income countries";
                                }
                              }
                              break;
                        case "SSA":
                              id=d3.select(this)._groups[0][0].__data__.properties.region_wb;
                      }


                   if(typeof(data[id]) === "number"){
                      return colorScale(data[id]) ;}
                   else
                      return "#d9d9d9";       
    });    
    
}

function sum(data){
  t=0;
  data.forEach(function(d){
    if(typeof(d) === "number")
      t+=d;
  });
  return t
}










//----------------Load data

d3.json("data/IMS.json")
  .then(function(data){
        IMS=data;
    })

d3.json("data/custom_geo.json")
    .then(function(world){
        MAP=world;
        drawMap(world);
    })

d3.json("data/TP.json")
  .then(function(data){
        TP=data;
    })

d3.json("data/IMS_TP.json")
  .then(function(data){
        IMS_TP=data;

    })

d3.json("data/IMS_DISTRIBUTION.json")
  .then(function(data){
        IMS_DISTRIBUTION=data;
    })


d3.json("data/FEMALE_IMS.json")
  .then(function(data){
        FEMALE_IMS=data;

    })

d3.json("data/IMS_F_DESTINATION.json")
  .then(function(data){
        IMS_F_DESTINATION=data;

    })



