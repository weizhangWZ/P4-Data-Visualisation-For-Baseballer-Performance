# P4-Data-Visualisation-For-Baseballer-Performance

### Abstract
The main purpose of this graph is to shown the relationship between Baseballers' Performance and their BMI, handedness. 
- BMI is calculated by the baseballer's height and weight, using 
`BMI = (Weight in Pounds / (Height in inches x Height in inches)) x 703`.
and has been classified to be **normal**,**overweight**,**obese**. It can be seen that, over BMI 25, the HR and avg score is all above the average level, which means better baseballers have a big body.
- Handedness contained three kinds: lefthanded, righthanded and bothhanded. It can be seen that, left-handed baseballers have better performance than other handedness.

### Design
I designed the plot in order to show how BMI and handedness influnece their performance of HR and AVG. 
So I chose **scatter plot** to do the job. I also added baseline to help audience better understand the plot.
- BMI is reflected by the size of the points.
- Handedness showed different colors for the circles.

### Feedbacks
1. The circles for BMI 20 is too small to see. Two people conplaint about it.
2. Do not use the Classify BMI in normal and overweight, as it can be more specific, if the audience are coach. **opposite** Another person recommend me to use classification.
3. Left_handed has a strange points from Right_handed, because there're several people have the same name that I nest them together and this causes a wrong filter.
4. Althogh there is an animation for BMI, I still need to investigate by myself.
5. Animation does not do a proper job as I can not see the Contrast between different categories.
6.Layout is terrible. Some labels are overlapping.

### Improvement
- Based on Feedback #1, I gave up multiplier, and set the region size for identify the BMI classification for normal, overweight, and obese.
- Based on Feedback #2, I made a big change from the original one. I use color to identify the classification for BMI. I gave up the color from handedness while comparing the differences between different BMI baseballers, which becomes much clearer.
- Based on Feedback #3, I rewritten my code and you can run the original version in old version fold. The main js code is bellow.
```javascript
 function filter_hand(handedness) {

      d3.selectAll('circle').remove()

      var filtered = data.filter(function(d) {
        return d["handedness"] == handedness;
      })

      d3.select("h2")
        .text("Baseballer Performance By " + text_content(handedness));

      var circles = d3.select('svg')
                      .selectAll('circle')
                      .data(filtered);
                      .append("circle")
                      .attr('cx', cx)
                      .attr('cy', cy)
                      .attr('r', r)
                      .attr('fill',text_color(filtered['handedness']));
    }
```
- Based on Feedback #4, I added both BMI and Handedness buttons.
- Based on Feedback #5, I calculated the average avg and HR for each categories and during animation, a trend of getting higher HR and avg can be seen. This is much better than the last version, only circles and density of baseballers can be found.
```javascript
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
```
- Based on Feedback #6, I modified the buttons into different height and added more labels to explain the meaning of the signs I have used.


### Resource
- Udacity Class
- http://chimera.labs.oreilly.com/books/1230000000345/ch09.html#_round_bands_are_all_the_range_these_days

