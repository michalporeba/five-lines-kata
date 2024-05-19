
const TILE_SIZE = 30;
const FPS = 30;
const SLEEP = 1000 / FPS;

enum RawTile {
  AIR,
  FLUX,
  UNBREAKABLE,
  PLAYER,
  STONE, FALLING_STONE,
  BOX, FALLING_BOX,
  KEY1, LOCK1,
  KEY2, LOCK2
}

class FallStrategy {
  constructor(private falling: FallingState) {}
  update(x: number, y: number) {
    this.falling = map[y + 1][x].isAir() ? new Falling() : new Resting();
    this.drop(x, y);
  }

  drop(x: number, y: number) {
    if (this.falling.isFalling()) {
      map[y + 1][x] = map[y][x];
      map[y][x] = new Air();
    }
  }
}

interface FallingState {
  isFalling(): boolean;
  isResting(): boolean;
  moveHorizontal(dx: number): void;
}

class Falling implements FallingState {
  isFalling() { return true; }
  isResting() { return false; }
  moveHorizontal(dx: number) {}
}

class Resting implements FallingState {
  isFalling() { return false; }
  isResting() { return true; }
  moveHorizontal(dx: number) {
    if (map[playery][playerx + dx + dx].isAir()
      && !map[playery + 1][playerx + dx].isAir()) {
      map[playery][playerx + dx + dx] = map[playery][playerx + dx];
      moveToTile(playerx + dx, playery);
    }
  }
}

interface Tile {
  isAir() : boolean;
  isFlux() : boolean;
  isUnbreakable() : boolean;
  isPlayer() : boolean;
  isStone() : boolean;
  isBox() : boolean;
  isKey1() : boolean;
  isLock1() : boolean;
  isKey2() : boolean;
  isLock2() : boolean;
  isBoxy() : boolean;
  isEdible() : boolean;
  isPushable() : boolean;
  isStony() : boolean;
  isFalling() : boolean;
  draw(g: CanvasRenderingContext2D, x: number, y: number) : void;
  moveHorizontal(dx: number) : void;
  moveVertical(dy: number) : void;
  drop(): void;
  rest(): void;
  update(x: number, y: number): void;
}

class Air implements Tile {
  isAir() { return true; }
  isFlux() { return false; }
  isUnbreakable() { return false; }
  isPlayer() { return false; }
  isStone() { return false; }
  isBox() { return false; }
  isKey1() { return false; }
  isLock1() { return false; }
  isKey2() { return false; }
  isLock2() { return false; }
  isBoxy() { return false; }
  isEdible() { return true; }
  isFalling() { return false; }
  isPushable() { return false; }
  isStony() { return false; }
  draw(g: CanvasRenderingContext2D, x: number, y: number) {}
  moveHorizontal(dx: number) {
    moveToTile(playerx + dx, playery);
  }
  moveVertical(dy: number) {
    moveToTile(playerx, playery + dy);
  }
  drop() {}
  rest() {}
  update(x: number, y: number) {}
}

class Flux implements Tile {
  isAir() { return false; }
  isFlux() { return true; }
  isUnbreakable() { return false; }
  isPlayer() { return false; }
  isStone() { return false; }
  isBox() { return false; }
  isKey1() { return false; }
  isLock1() { return false; }
  isKey2() { return false; }
  isLock2() { return false; }
  isBoxy() { return false; }
  isEdible() { return true; }
  isFalling() { return false; }
  isPushable() { return false; }
  isStony() { return false; }
  draw(g: CanvasRenderingContext2D, x: number, y: number) {
    g.fillStyle = "#ccffcc";
    g.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
  }
  moveHorizontal(dx: number) {
    moveToTile(playerx + dx, playery);
  }
  moveVertical(dy: number) {
    moveToTile(playerx, playery + dy);
  }
  drop() {}
  rest() {}
  update(x: number, y: number) {}
}

class Unbreakable implements Tile {
  isAir() { return false; }
  isFlux() { return false; }
  isUnbreakable() { return true; }
  isPlayer() { return false; }
  isStone() { return false; }
  isBox() { return false; }
  isKey1() { return false; }
  isLock1() { return false; }
  isKey2() { return false; }
  isLock2() { return false; }
  isBoxy() { return false; }
  isEdible() { return false; }
  isFalling() { return false; }
  isPushable() { return false; }
  isStony() { return false; }
  draw(g: CanvasRenderingContext2D, x: number, y: number) {
    g.fillStyle = "#999999";
    g.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
  }
  moveHorizontal(dx: number) {}
  moveVertical(dy: number) {}
  drop() {}
  rest() {}
  update(x: number, y: number) {}
}

class Player implements Tile {
  isAir() { return false; }
  isFlux() { return false; }
  isUnbreakable() { return false; }
  isPlayer() { return true; }
  isStone() { return false; }
  isBox() { return false; }
  isKey1() { return false; }
  isLock1() { return false; }
  isKey2() { return false; }
  isLock2() { return false; }
  isBoxy() { return false; }
  isEdible() { return false; }
  isFalling() { return false; }
  isPushable() { return false; }
  isStony() { return false; }
  draw(g: CanvasRenderingContext2D, x: number, y: number) {
    g.fillStyle = "#ff0000";
    g.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
  }
  moveHorizontal(dx: number) {}
  moveVertical(dy: number) {}
  drop() {}
  rest() {}
  update(x: number, y: number) {}
}

class Stone implements Tile {
  private fallStrategy: FallStrategy;
  constructor(private falling: FallingState) {
    this.fallStrategy = new FallStrategy(falling);
  }
  isAir() { return false; }
  isFlux() { return false; }
  isUnbreakable() { return false; }
  isPlayer() { return false; }
  isStone() { return true; }
  isBox() { return false; }
  isKey1() { return false; }
  isLock1() { return false; }
  isKey2() { return false; }
  isLock2() { return false; }
  isBoxy() { return false; }
  isEdible() { return false; }
  isFalling() { return this.falling.isFalling(); }
  isPushable() { return true; }
  isStony() { return true; }
  draw(g: CanvasRenderingContext2D, x: number, y: number) {
    g.fillStyle = "#0000cc";
    g.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
  }
  moveHorizontal(dx: number) { this.falling.moveHorizontal(dx); }
  moveVertical(dy: number) {}
  drop() { this.falling = new Falling(); }
  rest() { this.falling = new Resting(); }
  update(x: number, y: number) {
    this.fallStrategy.update(x, y);
  }
}

class Box implements Tile {
  private fallStrategy: FallStrategy;
  constructor(private falling: FallingState) {
    this.fallStrategy = new FallStrategy(falling);
  }
  isAir() { return false; }
  isFlux() { return false; }
  isUnbreakable() { return false; }
  isPlayer() { return false; }
  isStone() { return false; }
  isBox() { return true; }
  isKey1() { return false; }
  isLock1() { return false; }
  isKey2() { return false; }
  isLock2() { return false; }
  isBoxy() { return true; }
  isEdible() { return false; }
  isFalling() { return this.falling.isFalling(); }
  isPushable() { return true; }
  isStony() { return false; }
  draw(g: CanvasRenderingContext2D, x: number, y: number) {
    g.fillStyle = "#8b4513";
    g.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
  }
  moveHorizontal(dx: number) { this.falling.moveHorizontal(dx); }
  moveVertical(dy: number) {}
  drop() { this.falling = new Falling(); }
  rest() { this.falling = new Resting(); }
  update(x: number, y: number) {
    this.fallStrategy.update(x, y);
  }
}

class Key1 implements Tile {
  isAir() { return false; }
  isFlux() { return false; }
  isUnbreakable() { return false; }
  isPlayer() { return false; }
  isStone() { return false; }
  isBox() { return false; }
  isKey1() { return true; }
  isLock1() { return false; }
  isKey2() { return false; }
  isLock2() { return false; }
  isBoxy() { return false; }
  isEdible() { return false; }
  isFalling() { return false; }
  isPushable() { return false; }
  isStony() { return false; }
  draw(g: CanvasRenderingContext2D, x: number, y: number) {
    g.fillStyle = "#ffcc00";
    g.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
  }
  moveHorizontal(dx: number): void {
    removeLock1();
    moveToTile(playerx + dx, playery);
  }
  moveVertical(dy: number) {
    removeLock1();
    moveToTile(playerx, playery + dy);
  }
  drop() {}
  rest() {}
  update(x: number, y: number) {}
}

class Lock1 implements Tile {
  isAir() { return false; }
  isFlux() { return false; }
  isUnbreakable() { return false; }
  isPlayer() { return false; }
  isStone() { return false; }
  isBox() { return false; }
  isKey1() { return false; }
  isLock1() { return true; }
  isKey2() { return false; }
  isLock2() { return false; }
  isBoxy() { return false; }
  isEdible() { return false; }
  isFalling() { return false; }
  isPushable() { return false; }
  isStony() { return false; }
  draw(g: CanvasRenderingContext2D, x: number, y: number) {
    g.fillStyle = "#ffcc00";
    g.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
  }
  moveHorizontal(dx: number) {}
  moveVertical(dy: number) {}
  drop() {}
  rest() {}
  update(x: number, y: number) {}
}

class Key2 implements Tile {
  isAir() { return false; }
  isFlux() { return false; }
  isUnbreakable() { return false; }
  isPlayer() { return false; }
  isStone() { return false; }
  isBox() { return false; }
  isKey1() { return false; }
  isLock1() { return false; }
  isKey2() { return true; }
  isLock2() { return false; }
  isBoxy() { return false; }
  isEdible() { return false; }
  isFalling() { return false; }
  isPushable() { return false; }
  isStony() { return false; }
  draw(g: CanvasRenderingContext2D, x: number, y: number) {
    g.fillStyle = "#00ccff";
    g.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
  }
  moveHorizontal(dx: number): void {
    removeLock2();
    moveToTile(playerx + dx, playery);
  }
  moveVertical(dy: number) {
    removeLock2();
    moveToTile(playerx, playery + dy);
  }
  drop() {}
  rest() {}
  update(x: number, y: number) {}
}

class Lock2 implements Tile {
  isAir() { return false; }
  isFlux() { return false; }
  isUnbreakable() { return false; }
  isPlayer() { return false; }
  isStone() { return false; }
  isBox() { return false; }
  isKey1() { return false; }
  isLock1() { return false; }
  isKey2() { return false; }
  isLock2() { return true; }
  isBoxy() { return false; }
  isEdible() { return false; }
  isFalling() { return false; }
  isPushable() { return false; }
  isStony() { return false; }
  draw(g: CanvasRenderingContext2D, x: number, y: number) {
    g.fillStyle = "#00ccff";
    g.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
  }
  moveHorizontal(dx: number) {}
  moveVertical(dy: number) {}
  drop() {}
  rest() {}
  update(x: number, y: number) {}
}

function transformTile(raw: RawTile) {
  switch (raw) {
    case RawTile.AIR:
      return new Air();
    case RawTile.FLUX:
      return new Flux();
    case RawTile.UNBREAKABLE:
      return new Unbreakable();
    case RawTile.PLAYER:
      return new Player();
    case RawTile.STONE:
      return new Stone(new Resting());
    case RawTile.FALLING_STONE:
      return new Stone(new Falling());
    case RawTile.BOX:
      return new Box(new Resting());
    case RawTile.FALLING_BOX:
      return new Box(new Falling());
    case RawTile.KEY1:
      return new Key1();
    case RawTile.LOCK1:
      return new Lock1();
    case RawTile.KEY2:
      return new Key2();
    case RawTile.LOCK2:
      return new Lock2();
  }
}

function transformTails(rawMap: RawTile[][]) {
  return rawMap.map(row => row.map(transformTile));
}

interface Input {
  move(): void;
}

class Up implements Input {
  move() {
    map[playery-1][playerx].moveVertical(-1);
  }
}

class Down implements Input {
  move() {
    map[playery+1][playerx].moveVertical(1);
  }
}

class Left implements Input {
  move() {
    map[playery][playerx-1].moveHorizontal(-1);
  }
}

class Right implements Input {
  move() {
    map[playery][playerx+1].moveHorizontal(1);
  }
}

let playerx = 1;
let playery = 1;
let map: Tile[][] = transformTails([
  [2, 2, 2, 2, 2, 2, 2, 2],
  [2, 3, 0, 1, 1, 2, 0, 2],
  [2, 4, 2, 6, 1, 2, 0, 2],
  [2, 8, 4, 1, 1, 2, 0, 2],
  [2, 4, 1, 1, 1, 9, 0, 2],
  [2, 2, 2, 2, 2, 2, 2, 2],
]);

let inputs: Input[] = [];

function removeLock1() {
  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[y].length; x++) {
      if (map[y][x].isLock1()) {
        map[y][x] = new Air();
      }
    }
  }
}

function removeLock2() {
  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[y].length; x++) {
      if (map[y][x].isLock2()) {
        map[y][x] = new Air();
      }
    }
  }
}

function moveToTile(newx: number, newy: number) {
  map[playery][playerx] = new Air();
  map[newy][newx] = new Player();
  playerx = newx;
  playery = newy;
}

function moveHorizontal(dx: number) {
  if (map[playery][playerx + dx].isEdible()) {
    moveToTile(playerx + dx, playery);
  } else if ((map[playery][playerx + dx].isPushable())
    && map[playery][playerx + dx + dx].isAir()
    && !map[playery + 1][playerx + dx].isAir()) {
    map[playery][playerx + dx + dx] = map[playery][playerx + dx];
    moveToTile(playerx + dx, playery);
  } else if (map[playery][playerx + dx].isKey1()) {
    removeLock1();
    moveToTile(playerx + dx, playery);
  } else if (map[playery][playerx + dx].isKey2()) {
    removeLock2();
    moveToTile(playerx + dx, playery);
  }
}

function update() {
  handleInput();
  updateMap();
}

function handleInput() {
  while (inputs.length > 0) {
    inputs.pop().move();
  }
}

function updateTile(x: number, y: number) {
  map[y][x].update(x, y);
}

function updateMap() {
  for (let y = map.length - 1; y >= 0; y--) {
    for (let x = 0; x < map[y].length; x++) {
      updateTile(x, y);
    }
  }
}

function draw() {
  let g = createGraphics();
  drawMap(g);
  drawPlayer(g);
}

function createGraphics() : CanvasRenderingContext2D {
  let canvas = document.getElementById("GameCanvas") as HTMLCanvasElement;
  let g = canvas.getContext("2d");
  g.clearRect(0, 0, canvas.width, canvas.height);
  return g;
}

function drawMap(g: CanvasRenderingContext2D) {
  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[y].length; x++) {
      map[y][x].draw(g, x, y);
    }
  }
}

function drawPlayer(g: CanvasRenderingContext2D) {
  g.fillStyle = "#ff0000";
  g.fillRect(playerx * TILE_SIZE, playery * TILE_SIZE, TILE_SIZE, TILE_SIZE);
}

function gameLoop() {
  let before = Date.now();
  update();
  draw();
  let after = Date.now();
  let frameTime = after - before;
  let sleep = SLEEP - frameTime;
  setTimeout(() => gameLoop(), sleep);
}

window.onload = () => {
  gameLoop();
}

const LEFT_KEY = "ArrowLeft";
const UP_KEY = "ArrowUp";
const RIGHT_KEY = "ArrowRight";
const DOWN_KEY = "ArrowDown";

window.addEventListener("keydown", e => {
  if (e.key === LEFT_KEY || e.key === "a") inputs.push(new Left());
  else if (e.key === UP_KEY || e.key === "w") inputs.push(new Up());
  else if (e.key === RIGHT_KEY || e.key === "d") inputs.push(new Right());
  else if (e.key === DOWN_KEY || e.key === "s") inputs.push(new Down());
});
