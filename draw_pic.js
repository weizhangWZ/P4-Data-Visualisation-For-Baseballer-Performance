function draw(data) {

  /*
  D3.js setup code
  */

  "use strict";
  var margin = 75,
      width = 1000 - margin,
      height = 600 - margin;

  var radius = 1;

  var bmi = [];
  
  for(var i = 20; i < 32; i += 1) {
      if (i != 30){
        bmi.push(i);
      }
    }
  
  
  d3.select("body")
    .append("h2")
    .text("Baseballer Performance");

   
  d3.select("body")
    .append("div")
    .attr('class',"normal")
    .text("Normal");

  d3.select("body")
  .append("div")
  .attr('class',"overweight")
  .text("Overweight");

  d3.select("body")
  .append("div")
  .attr('class',"obese")
  .text("Obese");



  var svg = d3.select("body")
              .append("svg")
              .attr("width", width + margin)
              .attr("height", height + margin)
              .append('g')
              .attr('class', 'chart');


  // handedness color
  function handedness(d){
          if (d['handedness'] == "L") {
              return 'blue';
          } else if (d['handedness'] == "R") {
              return 'red';
          } else {
              return 'green';
          }
  };
  

  // XY coordinate
  var hr_extent = d3.extent(data, function(d){
      return +d['HR'];
  });

  var hr_scale = d3.scale.linear()
      .range([margin, width])
      .domain(hr_extent);

  var hr_axis = d3.svg.axis()
      .scale(hr_scale);

  d3.select("svg")
    .append('g')
    .attr('class', 'x axis')
    .attr('transform', "translate(0," + height + ")")
    .call(hr_axis)
    .append("text")
    .text("Home Run (Points)")
    .attr("font-size",12)
    .attr("x", (width+margin)/2)
    .attr("y", margin/2);

  var avg_extent = d3.extent(data, function(d){
      return d['avg'];
  });

  var avg_scale = d3.scale.linear()
      .range([height, margin])
      .domain(avg_extent);

  var avg_axis = d3.svg.axis()
      .scale(avg_scale)
      .orient("left");

  d3.select("svg")
    .append('g')
    .attr('class', 'y axis')
    .attr('transform', "translate(" + margin + ",0)")
    .call(avg_axis)
    .append("text")
    .text("Batting Average(%)")
    .attr("font-size",12)
    .attr("transform","rotate(-90)")
    .attr("x", -height/2-margin)
    .attr("y", -margin/2);

  // draw circles
  d3.select('svg')
    .selectAll("circle")
    .data(data)
    .enter()
    .append("circle");

  var cx = (data, function(d){
          return hr_scale(d['HR']);
      });

  var cy = (data, function(d){
          return avg_scale(d['avg']);
      });

  var r = (data, function(d){
          return radius * (d['BMI']-19);
      });

  var circle_color = (data, function(d){
          return handedness(d);
      });

  
  //draw avgerage avg,HR

  var avg_line = svg.append('line')
                .attr('class','average')
                .attr('x1',hr_scale(0))
                .attr('y1',avg_scale(0.243))
                .attr('x2',925)
                .attr('y2',avg_scale(0.243))
                .text('Average')
                .attr("stroke","gray")
                .attr("stroke-width",2);

  var hr_line = svg.append('line')
                .attr('class','average')
                .attr('x1',hr_scale(59))
                .attr('y1',75)
                .attr('x2',hr_scale(59))
                .attr('y2',450+75)
                .attr("stroke","gray")
                .attr("stroke-width",2);


  // draw circle
  d3.selectAll('circle')
    .attr('cx',cx)
    .attr('cy',cy)
    .attr('r', r)
    .attr('fill',circle_color);


  // hand button
  function text_color(d){
      if (d == "L") {
          return 'lightblue';
      } else if (d == "R") {
          return '#FFBFBF';
      } else {
          return 'lightgreen';
      }
  }

  function text_content(d){
      if (d == "L") {
          return 'Left Handed';
      } else if (d == "R") {
          return 'Right Handed';
      } else {
          return 'Both Handed';
      }

  }

  // bmi button
  function bmi_color(d){
      if (d < 25){
          return '#FFBFBF';
      } else if (d < 30){
          return '#FF0000';
      } else {
          return '#551C1C';
      }
  }
 
  function bmi_size(d){
      if (d < 25){
          return radius * 5;
      } else if (d < 30){
          return radius * 10;
      } else {
          return radius * 15;
      }
  }

  
  
  // buttons 
  var buttons = d3.select("body")
                  .append("div")
                  .attr("class", "hand_buttons")
                  .selectAll("div")
                  .data(["L","R","B"])
                  .enter()
                  .append("div")
                  .text(text_content)
                  .style("background",text_color)
                  .style("color","white");

  var bmi_buttons = d3.select("body")
                  .append("div")
                  .attr("class", "bmi_buttons")
                  .selectAll("div")
                  .data(bmi)
                  .enter()
                  .append("div")
                  .text(function(d){return d;})
                  .style("background", bmi_color)
                  .style("color","white");

  

  // filter handedness
  function update_bmi(bmi) {

      d3.selectAll('circle').remove();
      d3.selectAll('.calculated').remove();
      d3.selectAll('.handed').remove();

      var filtered = data.filter(function(d) {
        return d["BMI"] == bmi;
      })

      var bmi_avg = d3.sum(filtered, function(d){
        return d['avg'];
      })/filtered.length;
      var bmi_hr = d3.sum(filtered, function(d){
        return +d['HR'];
      })/filtered.length;

      var avg_line = svg.append('line')
              .attr('class','calculated')
              .attr('x1',hr_scale(0))
              .attr('y1',avg_scale(bmi_avg))
              .attr('x2',925)
              .attr('y2',avg_scale(bmi_avg))
              .text('Average')
              .attr("stroke",bmi_color(bmi))
              .attr("stroke-width",2);

      var hr_line = svg.append('line')
                    .attr('class','calculated')
                    .attr('x1',hr_scale(bmi_hr))
                    .attr('y1',75)
                    .attr('x2',hr_scale(bmi_hr))
                    .attr('y2',450+75)
                    .attr("stroke",bmi_color(bmi))
                    .attr("stroke-width",2);
   
      d3.select("h2")
        .text("Baseballer Performance By BMI " + bmi);

      var circles = d3.select('svg')
                      .selectAll('circle')
                      .data(filtered)
                      .enter()
                      .append("circle")
                      .attr('cx', cx)
                      .attr('cy', cy)
                      .attr('r', function(d){
                        return bmi_size(d['BMI']);
                      })
                      .attr('fill', function(d){
                        return bmi_color(d['BMI']);
                      });  
  }
  
 
  // matini animation
  var bmi_idx = 0;

  var bmi_interval = setInterval(function() {
    update_bmi(bmi[bmi_idx]);

    bmi_idx++;

    if(bmi_idx >= bmi.length) {
         
        clearInterval(bmi_interval);

        };
    
  }, 1200);

 
  
  // filter handedness
  function update_hand(handedness) {

      d3.selectAll('circle').remove();
      d3.selectAll('.calculated').remove();

      var filtered = data.filter(function(d) {
        return d["handedness"] == handedness;
      })

      var hand_avg = d3.sum(filtered, function(d){
        return d['avg'];
      })/filtered.length;
      var hand_hr = d3.sum(filtered, function(d){
        return +d['HR'];
      })/filtered.length;

      var avg_line = svg.append('line')
              .attr('class','handed')
              .attr('x1',hr_scale(0))
              .attr('y1',avg_scale(hand_avg))
              .attr('x2',925)
              .attr('y2',avg_scale(hand_avg))
              .text('Average')
              .attr("stroke",text_color(handedness))
              .attr("stroke-width",2);

      var hr_line = svg.append('line')
                    .attr('class','handed')
                    .attr('x1',hr_scale(hand_hr))
                    .attr('y1',75)
                    .attr('x2',hr_scale(hand_hr))
                    .attr('y2',450+75)
                    .attr("stroke",text_color(handedness))
                    .attr("stroke-width",2);

      d3.select("h2")
        .text("Baseballer Performance By " + text_content(handedness));

      var circles = d3.select('svg')
                      .selectAll('circle')
                      .data(filtered)
                      .enter()
                      .append("circle")
                      .attr('cx', cx)
                      .attr('cy', cy)
                      .attr('r', r)
                      .attr('fill',text_color(handedness));       
    }
   
     
   bmi_buttons.on("click", function(d) {
                    d3.select(".bmi_buttons")
                      .selectAll("div")
                      .transition()
                      .duration(500)
                      .style("color", "white");

                    d3.select(this)
                      .transition()
                      .duration(500)
                      .style("color", "gray");
                    update_bmi(d); 
            });

     buttons.on("click", function(d) {
                      d3.select(".hand_buttons")
                      .selectAll("div")
                      .transition()
                      .duration(500)
                      .style("color", "white");

                    d3.select(this)
                      .transition()
                      .duration(500)
                      .style("color", "gray");
          
                    update_hand(d);
                });

      
      var legend = svg.append("g")
          .attr("class", "legend")
          .attr("transform", "translate(" + (width - 300) + "," + 460 + ")")
          .selectAll("g")
          .data(["Average avg & HR overall", "Average avg & HR under category data"])
          .enter(); 

      legend.append("line")
            .attr('class','label')
            .attr('x1',0)
            .attr('y1',function(d){
                if (d == "Average avg & HR overall") {
                  return 0;
                } else {
                  return 30;
                }
              })
            .attr('x2',30)
            .attr('y2',function(d){
                if (d == "Average avg & HR overall") {
                  return 0;
                } else {
                  return 30;
                }
              })
            .attr("stroke",function(d){
                if (d == "Average avg & HR overall") {
                  return "gray";
                } else {
                  return "red";
                }
            })
            .attr("stroke-width",2)
            .attr('stroke-dasharray',function(d){
                if (d == "Average avg & HR overall") {
                  return (3,3);
                } else {
                  return (0,0);
                }
              });


      legend.append("text")
          .attr("y", function(d, i) {
              return i * 30 + 5;
          })
          .attr("x", 30)
          .text(function(d) {
              return d;
          })
          .attr("fill",'Gray');

    };