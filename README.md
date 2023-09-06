<img align="right" height="100" src="https://user-images.githubusercontent.com/15892272/188943551-95ba41cd-3db7-436e-bdb2-d0192711851f.png">

# PaintPond
Paint with a painter.<br>
I originally made PaintPond for this video: ✨ **[NEW Cellular Automata](https://youtu.be/WMJ1H3Ai-qs)**<br>
It was also used in this one: 🔮 **[Spellular Automata](https://youtu.be/xvlsJ3FqNYU?si=8PFznQkaGfdiOPJA)**

Try it at [paintpond.cool](https://paintpond.cool)!

## Controls
**Number keys**: Change colour!<br>
**Tab key**: Change painter!<br>
**Space bar**: Enter [screenshot mode](docs/screenshot-mode.md)!

**X key**: Undo!<br>
**C key**: Clear the screen!<br>

## Running Locally
To run locally...<br>
you need to run a local server because it uses javascript modules.<br>
(ie: you can't just open `index.html` like most of my other projects)<br>

I recommend getting [deno](https://deno.land)
and then installing `file_server` with this command:
```
deno install --allow-read --allow-net https://deno.land/std@0.142.0/http/file_server.ts
```
Then you can run this command to run a local server:
```
file_server
```

## Special Thanks
* [Magnogen](https://magnogen.net/) for giving the characters more life + movement
* [Steve Ruiz](https://www.steveruiz.me/) for making [Perfect Freehand](https://github.com/steveruizok/perfect-freehand) (which this project uses)
* [Linn Dahlgreen](https://github.com/SimplyLinn) for improving the stroke rendering, and getting it to work on iPhones
