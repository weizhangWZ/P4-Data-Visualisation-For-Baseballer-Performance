# P4-Data-Visualisation-For-Baseballer-Performance

### Abstract
The main purpose of this graph is to shown the relationship between Baseballers' Performance and their BMI, handedness. 
- BMI is calculated by the baseballer's height and weight, using 
`BMI = (Weight in Pounds / (Height in inches x Height in inches)) x 703`.
- Handedness contained three kinds: lefthanded, righthanded and bothhanded.

### Design
I designed the plot in order to show how BMI and handedness influnece their performance of HR and AVG. 
So I chose **scatter plot** to do the job.
- BMI is reflected by the size of the points.
- Handedness showed different colors for the circles.

### Feedbacks
1. The circles for BMI 20 is too small to see.
2. Do not use the Classify BMI in normal and overweight, as it can be more specific, if the audience are coach.
3. Left_handed has a strange points from Right_handed, because there're several people have the same name that I nest them together and this causes a wrong filter.
4. Althogh there is an animation for BMI, I still need to investigate by myself.

### Improvement
- Based On Feedback #1, I used a multiplier.
```javascript
 .attr('r', function(d){
                        return (d['BMI'] - 19)*multiplier;
                      })
```
- Based On Feedback #2, I made BMI results into integer and use it to define the radius of circles.
- Based On Feedback #3, I rewritten my code and you can write the original version in old version fold. The main js code is bellow.
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
- Based On Feedback #4, I added both BMI and Handedness buttons.

### Resource
- Udacity Class
- http://chimera.labs.oreilly.com/books/1230000000345/ch09.html#_round_bands_are_all_the_range_these_days

