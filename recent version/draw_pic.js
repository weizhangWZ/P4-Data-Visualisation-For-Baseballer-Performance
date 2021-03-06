function draw(data) {

  /*
  D3.js setup code
  */

  "use strict";
  var margin = 75,
      width = 1400 - margin,
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


  var svg = d3.select("body")
      .append("svg")
      .attr("width", width + margin)
      .attr("height", height + margin)
      .append('g')
      .attr('class', 'chart');

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
          return 'red';
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
                  .style("background","orange")
                  .style("color","white");



  // filter handedness
  function update_bmi(bmi) {

      d3.selectAll('circle').remove()
      
      var filtered = data.filter(function(d) {
        return d["BMI"] == bmi;
      })
   
      d3.select("h2")
        .text("Baseballer Performance By BMI " + bmi);
      
      var multiplier = 2;

      var circles = d3.select('svg')
                      .selectAll('circle')
                      .data(filtered)
                      .enter()
                      .append("circle")
                      .attr('cx', cx)
                      .attr('cy', cy)
                      .attr('r', function(d){
                        return (d['BMI'] - 19)*multiplier;
                      })
                      .attr('fill', function(d){
                        return text_color(d['handedness']);
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

      d3.selectAll('circle').remove()

      var filtered = data.filter(function(d) {
        return d["handedness"] == handedness;
      })

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
                      .style("color", "purple");
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
                      .style("color", "purple");
          
                    update_hand(d);
                });

      /*
      var legend = svg.append("g")
          .attr("class", "legend")
          .attr("transform", "translate(" + (width - 100) + "," + 20 + ")")
          .selectAll("g")
          .data(["Left_handed", "Right_handed","Both_handed"])
          .enter().append("g"); 

      legend.append("circle")
          .attr("cy", function(d, i) {
              return i * 30;
          })
          .attr("r", radius * 5)
          .attr("fill", text_color);

      legend.append("text")
          .attr("y", function(d, i) {
              return i * 30 + 5;
          })
          .attr("x", radius * 5)
          .text(function(d) {
              return d;
          })
          .attr("fill",text_color);
      */

    };