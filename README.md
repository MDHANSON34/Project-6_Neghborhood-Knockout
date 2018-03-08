# Project-6_Neghborhood-Knockout

View the map here>>  mdhanson34.github.io





Goal: Optimize index.html to achieve a score of >90 on PageSpeedInsights

#### Part 1: Optimize PageSpeed Insights score for index.html

Optimizations made to index.html:

1)Resize and Compression of images
2)Inline CSS style
3)Used Minify techniques

#### Part 2: Optimize Frames per Second in pizza.html

Goal: To optimize views/js/main.js until views/pizza.html frames per second rate is 60 fps or higher.

Optimizations made to views/js/main.js:

1)536-546
    Refined the number of pizzas rendered on the page to be set equal to a percentage of the page size rather than a default 200
2)451-461
    -Pulled out unnecessary calculations in the For loop
    -Set up PizzaElements as a variable to modify by class name ("randomPizzaContainer")
    -Pulled out the dx and newwidth variables from for loop to avoid unnecessary recalculations
3)507-514
    -set up "items" as a variable and call by class name
    -remove variable "scrollTop" from loop to avoid unnecessary duplication in loop
