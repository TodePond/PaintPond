# PaintPond
Paint with a painter. This is something I made for this video: [youtu.be/WMJ1H3Ai-qs](https://youtu.be/WMJ1H3Ai-qs)

Try it at [paintpond.cool](https://paintpond.cool)!

Move the mouse to move the painter.<br>
Left-click to paint<br>
Press the 1 key for white!<br>
Press the 2 key for red!<br>
Press the 3 key for etc...

Press X to undo!<br>
Press C to clear the screen!<br>
Press tab to change characters!

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
