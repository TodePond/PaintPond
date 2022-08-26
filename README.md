# PaintPond
Paint with a painter. This is something I made for this video: ✨ **[NEW Cellular Automata](https://youtu.be/WMJ1H3Ai-qs)**

Try it at [paintpond.cool](https://paintpond.cool)!

Move the mouse to move the painter.<br>
Left-click to paint<br>
Press the 1 key for white!<br>
Press the 2 key for red!<br>
Press the 3 key for etc...

Press X to undo!<br>
Press C to clear the screen!<br>
Press tab to change characters!<br>

Press space to pause the paint program.<br>
When paused, you can right/left click to copy the image to your clipboard.<br>
Left click copies what you see, right click copies a version with transparent background<br>
Click and drag to copy a region, just click to copy the entire canvas

## Running Locally
To run locally...<br>
you need to run a local server because it uses javascript modules.<br>
(ie: you can't just open `index.html` like most of my other projects)<br>

I recommend getting [deno](https://deno.land)
and then installing `file_server` with this command:
```
deno install --allow-read --allow-net -f https://deno.land/std@0.142.0/http/file_server.ts
```
Then you can run this command to run a local server:
```
file_server
```

## Special Thanks
* [Magnogen](https://magnogen.net/) for giving the characters more life + movement
* [Steve Ruiz](https://www.steveruiz.me/) for making [Perfect Freehand](https://github.com/steveruizok/perfect-freehand) (which this project uses)
* [Linn Dahlgreen](https://github.com/SimplyLinn) for improving the stroke rendering, and getting it to work on iPhones
