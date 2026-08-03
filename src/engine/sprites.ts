export const BATMAP = `
..a......a..
.aba....aba.
abbba..abbba
abbbbaabbbba
.abbbccbbba.
..abccccba..
...acdcda...
...acccca...
....a..a....
....e..e....`;

export const BATPAL: Record<string, string> = {
  a: "#1a2f4a", b: "#3b5a8a", c: "#22e5ff", d: "#ff2ea6", e: "#5b6a86",
};

/* Frames de ALETEO para el juego (la tarjeta de proyectos usa el
   BATMAP fijo). Comparten cara y cuerpo; solo cambian las alas.
   BATMAP es la pose media, así que la secuencia de vuelo es
   arriba → medio → abajo → medio. */
export const BATMAP_UP = `
aba......aba
abba....abba
.abb....bba.
..ab....ba..
.abbbccbbba.
..abccccba..
...acdcda...
...acccca...
....a..a....
....e..e....`;

export const BATMAP_DOWN = `
............
..a......a..
.abb....bba.
abbba..abbba
.abbbccbbba.
..abccccba..
...acdcda...
...acccca...
..aba..aba..
.abae..eaba.`;

export const BAT_FLAP = [BATMAP_UP, BATMAP, BATMAP_DOWN, BATMAP];

export const SLIMEMAP = `
....abba....
..abbbbbba..
.abbcbbcbba.
.abbbbbbbba.
abbdbbbbdbba
abbbbbbbbbba
abbbbeebbbba
.abbbbbbbba.
..aabbbbaa..
....aaaa....`;

export const SLIMEPAL: Record<string, string> = {
  a: "#0f3d2a", b: "#4dff9e", c: "#071310", d: "#c8ffe4", e: "#071310",
};

export const FACEMAP = `
.........gggggg.........
.......gggggggggg.......
......gggggggggggg......
......gggggggggggg......
.....gggggggggggggg.....
.....gghhhhcchhhhgg.....
....ggghhhcccchhhggg....
....ghcchhcccchhcchg....
....ghcccccccccccchh....
....aacccaaaaaacccaa....
.....acaaaaaaaaaaca.....
.....aaaaaffffaaaaa.....
.....aaaaaffffaaaaa.....
.....aaaaaaaaaaaaaa.....
......aaaaaaaaaaaaa.....
......aaaaaaaaaaaa......
.....bbaaaaaaaaaabb.....
...ebbbbbaaaaaabbbbbe...
..bbbbbbbbeccebbbbbbbb..
.ebbbbbddbbbbbbddbbbbbe.
ebbbbbbddbbbbbbddbbbbbbe
ebbbbbbddbbbbbbddbbbbbbe
bbbbbbbddbbbbbbddbbbbbbb
ebbbbbbddbbbbbbeebbbbbbe`;

export const FACEPAL: Record<string, string> = {
  a: "#4e3a2d", b: "#26557c", c: "#d08d5e", d: "#868f98", e: "#335e81", f: "#3e291c", g: "#b5794a", h: "#2b2b31",
};

export const BANNER = String.raw`
     ██╗ ██╗  ██╗  ██████╗  ██████╗  ███╗   ███╗  █████╗  ███╗   ██╗  ██████╗   █████╗  ██████╗  ██████╗   █████╗ 
     ██║ ██║  ██║ ██╔═══██╗ ██╔══██╗ ████╗ ████║ ██╔══██╗ ████╗  ██║  ██╔══██╗ ██╔══██╗ ██╔══██╗ ██╔══██╗ ██╔══██╗
     ██║ ███████║ ██║   ██║ ██████╔╝ ██╔████╔██║ ███████║ ██╔██╗ ██║  ██████╔╝ ███████║ ██████╔╝ ██████╔╝ ███████║
██╗  ██║ ██╔══██║ ██║   ██║ ██╔══██╗ ██║╚██╔╝██║ ██╔══██║ ██║╚██╗██║  ██╔═══╝  ██╔══██║ ██╔══██╗ ██╔══██╗ ██╔══██║
╚█████╔╝ ██║  ██║ ╚██████╔╝ ██║  ██║ ██║ ╚═╝ ██║ ██║  ██║ ██║ ╚████║  ██║      ██║  ██║ ██║  ██║ ██║  ██║ ██║  ██║
 ╚════╝  ╚═╝  ╚═╝  ╚═════╝  ╚═╝  ╚═╝ ╚═╝     ╚═╝ ╚═╝  ╚═╝ ╚═╝  ╚═══╝  ╚═╝      ╚═╝  ╚═╝ ╚═╝  ╚═╝ ╚═╝  ╚═╝ ╚═╝  ╚═╝`.slice(1);

 export const SUBTITLE = "F U L L S T A C K   D E V E L O P E R";
 
export function drawMap(
  c2: CanvasRenderingContext2D,
  map: string,
  pal: Record<string, string>,
  x: number,
  y: number,
  s: number,
): void {
  const rows = map.trim().split("\n");
  for (let ry = 0; ry < rows.length; ry++) {
    for (let rx = 0; rx < rows[ry].length; rx++) {
      const col = pal[rows[ry][rx]];
      if (col) {
        c2.fillStyle = col;
        c2.fillRect(x + rx * s, y + ry * s, s + 0.2, s + 0.2);
      }
    }
  }
}