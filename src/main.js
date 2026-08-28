import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

// ======================================================
// ASSETS
// ======================================================

const MODEL_FOLDER = "../assets/models/";

const FILES = {
  mountain: "Main Mountain.glb",
  distantMountain: "Copy Mountains.glb",
  lake: "Lake.glb",

  mom: "Mom.glb",
  dad: "Dad.glb",
  aneesh: "Aneesh.glb",

  tree: "Trees by Quaternius - etFGNvsiFv.glb",
  grass: "Grass by Quaternius - UGTOzcO3P2.glb",
  rock: "Rock by Quaternius - RtLRqYjfMs.glb",
  shrub: "Shrub.glb",
  lamp: "Street light.glb",
  bench: "Bench by Quaternius - jLxjFxFRpw.glb",
  wood: "Wood by Quaternius - ajBNpMsQ8z.glb",

  note: "Birthday note and clues.glb",

  cake: "Birthday cake.glb",

  saladBowl: "ganesha_10th_-_11th_c_ce.glb"
};

const FINAL_NOTE_TITLE = "Happy Birthday Amma";

const FINAL_NOTE_TEXT = `From 2087:

Hi me! How am I? Wondering who I am? I am you! Yes, this is Aneesh Amma from 2087, and I am writing a letter to my younger self. One year before, your son wrote you a letter! Then, my son told me that he used his new time travel app named TimaNova to send you a letter. Now, I am using TimaNova 2.0 to send myself a letter. I am delighted to say that our son is doing a fantabulous job. He has become an inspiration for the whole world, as he launched the company - Nova. TimaNova, ZeroNova, NutriNova (the name was changed) and much more have become his own products. But apart from all that, he is a good person. Even after becoming a billionaire, he didn't want more luxury - but he wanted to take care of me. He is honest, healthy, happy, and kind. And of course, he is naughty - but when it comes to taking care of me and making me happy, he is a gem. He has helped many people achieve their dreams, and he is my dearest. Wait a sec, our husband also would like to write something. Hi ma. This is Jayagandan speaking. Right now, we are travelling around the world, going on a world tour. Our son, he is taking us on a world tour. We have been to Austria, Germany, France and more. But one thing - he doesn't have a chef. Instead, he cooks for us with love and care. Whatever he cooks is delicious, especially due to the focus he puts in it. So, do not worry about Aneesh. He leads with care, and succeeds without arrogance. His ego is nearly absent, only rising for dignity. So stay happy. Happy Birthday Wife! Now you will also say happy birthday to yourself, wait, she is coming. Happy Birthday Myself! And to finish the triangle, I will call our son. Happy Birthday Amma!`;

// ======================================================
// SCENE
// ======================================================

const scene = new THREE.Scene();

scene.background =
  new THREE.Color(0xb9d6e5);

scene.fog =
  new THREE.FogExp2(
    0xc8d9e2,
    0.00095
  );

// ======================================================
// CAMERA
// ======================================================

const camera =
  new THREE.PerspectiveCamera(
    58,
    window.innerWidth /
      window.innerHeight,
    0.1,
    9000
  );

// ======================================================
// RENDERER
// ======================================================

const renderer =
  new THREE.WebGLRenderer({
    antialias: true,
    powerPreference: "high-performance"
  });

renderer.setSize(
  window.innerWidth,
  window.innerHeight
);

renderer.setPixelRatio(
  Math.min(
    window.devicePixelRatio,
    2
  )
);

renderer.shadowMap.enabled = true;

renderer.shadowMap.type =
  THREE.PCFSoftShadowMap;

renderer.outputColorSpace =
  THREE.SRGBColorSpace;

renderer.toneMapping =
  THREE.ACESFilmicToneMapping;

renderer.toneMappingExposure =
  1.08;

document
  .getElementById("game")
  .appendChild(
    renderer.domElement
  );

// ======================================================
// CAMERA CONTROL
// ======================================================

const controls =
  new OrbitControls(
    camera,
    renderer.domElement
  );

controls.enableDamping = true;

controls.dampingFactor = 0.075;

controls.enablePan = false;

controls.minDistance = 4.5;

controls.maxDistance = 15;

controls.minPolarAngle = 0.3;

controls.maxPolarAngle =
  Math.PI * 0.48;

// ======================================================
// UI
// ======================================================

const style =
  document.createElement("style");

style.textContent = `

#game-ui {
  position: fixed;
  inset: 0;
  pointer-events: none;
  font-family: Arial, Helvetica, sans-serif;
  color: white;
  z-index: 1000;
}

#objective {
  position: absolute;
  top: 24px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(9,20,27,0.76);
  border: 1px solid rgba(255,255,255,0.16);
  border-radius: 13px;
  padding: 11px 20px;
  font-size: 16px;
  letter-spacing: .4px;
  backdrop-filter: blur(8px);
  opacity: 0;
  transition: opacity .25s;
  white-space: nowrap;
}

#prompt {
  position: absolute;
  bottom: 104px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(7,15,22,.84);
  border: 1px solid rgba(255,255,255,.2);
  border-radius: 10px;
  padding: 10px 18px;
  font-size: 17px;
  opacity: 0;
  transition: opacity .15s;
}

#subtitle {
  position: absolute;
  bottom: 36px;
  left: 50%;
  transform: translateX(-50%);
  width: min(760px,86vw);
  text-align: center;
  background: rgba(0,0,0,.67);
  border-radius: 12px;
  padding: 13px 20px;
  font-size: 18px;
  line-height: 1.42;
  opacity: 0;
  transition: opacity .2s;
}

#speaker {
  font-weight: 700;
  margin-right: 6px;
}

#clue-card {
  position: absolute;
  inset: 0;
  display: none;
  align-items: center;
  justify-content: center;
  background: rgba(4,8,12,.74);
  pointer-events: auto;
  padding: 30px;
  box-sizing: border-box;
}

#clue-paper {
  width: min(720px,86vw);
  max-height: min(74vh,760px);
  overflow-y: auto;

  background:
    linear-gradient(
      145deg,
      #f4e8c5,
      #d7c08a
    );

  color: #302719;
  border-radius: 12px;

  padding: 34px 40px;

  box-shadow:
    0 20px 90px
    rgba(0,0,0,.55);

  text-align: center;
}

#clue-paper.final-note {
  width: min(900px,90vw);
  text-align: left;
}

#clue-paper h2 {
  margin: 0 0 20px;
  font-size: 29px;
  text-align: center;
}

#clue-paper p {
  margin: 0;
  white-space: pre-wrap;
  font-size: 19px;
  line-height: 1.62;
}

#clue-paper small {
  display: block;
  margin-top: 24px;
  text-align: center;
  opacity: .65;
}

#cutscene-bars::before,
#cutscene-bars::after {
  content: "";
  position: fixed;
  left: 0;
  width: 100%;
  height: 0;
  background: black;
  z-index: 500;
  transition: height .45s;
}

#cutscene-bars::before {
  top: 0;
}

#cutscene-bars::after {
  bottom: 0;
}

#cutscene-bars.active::before,
#cutscene-bars.active::after {
  height: 8vh;
}

#nav-dot {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 9px;
  height: 9px;
  margin-left: -4px;
  margin-top: -4px;
  border: 2px solid rgba(255,255,255,.78);
  border-radius: 50%;
  opacity: 0;
  box-shadow:
    0 0 12px
    rgba(255,255,255,.45);
  transition: opacity .2s;
}

`;

document.head.appendChild(style);

const ui =
  document.createElement("div");

ui.id = "game-ui";

ui.innerHTML = `

<div id="cutscene-bars"></div>

<div id="objective"></div>

<div id="prompt"></div>

<div id="subtitle">
  <span id="speaker"></span>
  <span id="subtitle-text"></span>
</div>

<div id="nav-dot"></div>

<div id="clue-card">

  <div id="clue-paper">

    <h2 id="clue-title">
      Clue
    </h2>

    <p id="clue-text"></p>

    <small id="clue-help">
      Press E to continue
    </small>

  </div>

</div>

`;

document.body.appendChild(ui);

const objectiveElement =
  document.getElementById(
    "objective"
  );

const promptElement =
  document.getElementById(
    "prompt"
  );

const subtitleElement =
  document.getElementById(
    "subtitle"
  );

const speakerElement =
  document.getElementById(
    "speaker"
  );

const subtitleTextElement =
  document.getElementById(
    "subtitle-text"
  );

const clueCard =
  document.getElementById(
    "clue-card"
  );

const cluePaper =
  document.getElementById(
    "clue-paper"
  );

const clueTitle =
  document.getElementById(
    "clue-title"
  );

const clueText =
  document.getElementById(
    "clue-text"
  );

const clueHelp =
  document.getElementById(
    "clue-help"
  );

const cutsceneBars =
  document.getElementById(
    "cutscene-bars"
  );

const navDot =
  document.getElementById(
    "nav-dot"
  );

function setObjective(text) {

  objectiveElement.textContent =
    text;

  objectiveElement.style.opacity =
    text
      ? "1"
      : "0";

}

function setPrompt(text) {

  promptElement.textContent =
    text;

  promptElement.style.opacity =
    text
      ? "1"
      : "0";

}

// ======================================================
// SUBTITLES
// ======================================================

let subtitleTimer = null;

function showSubtitle(
  speaker,
  text,
  duration = 3
) {

  clearTimeout(
    subtitleTimer
  );

  speakerElement.textContent =
    speaker
      ? `${speaker}:`
      : "";

  subtitleTextElement.textContent =
    text;

  subtitleElement.style.opacity =
    "1";

  subtitleTimer =
    setTimeout(
      () => {

        subtitleElement.style.opacity =
          "0";

      },

      duration * 1000
    );

}

// ======================================================
// DIALOGUE QUEUE
// ======================================================

const dialogueQueue = [];

let dialogueActive = false;

function queueDialogue(lines) {

  dialogueQueue.push(
    ...lines
  );

}

function updateDialogue() {

  if (
    dialogueActive ||
    dialogueQueue.length === 0
  ) {

    return;

  }

  dialogueActive = true;

  const line =
    dialogueQueue.shift();

  const duration =
    line.duration || 3;

  showSubtitle(
    line.speaker,
    line.text,
    duration
  );

  setTimeout(
    () => {

      dialogueActive = false;

    },

    duration * 1000 + 180
  );

}

// ======================================================
// LIGHTING
// ======================================================

const hemi =
  new THREE.HemisphereLight(
    0xdcefff,
    0x536142,
    1.7
  );

scene.add(hemi);

const sun =
  new THREE.DirectionalLight(
    0xffefd0,
    3.2
  );

sun.position.set(
  -700,
  1100,
  700
);

sun.castShadow = true;

sun.shadow.mapSize.set(
  2048,
  2048
);

sun.shadow.camera.left =
  -1400;

sun.shadow.camera.right =
  1400;

sun.shadow.camera.top =
  1400;

sun.shadow.camera.bottom =
  -1400;

sun.shadow.camera.near =
  10;

sun.shadow.camera.far =
  4000;

sun.shadow.bias =
  -0.00018;

scene.add(sun);

// ======================================================
// SUN SPRITE
// ======================================================

function createSunTexture() {

  const canvas =
    document.createElement(
      "canvas"
    );

  canvas.width = 256;

  canvas.height = 256;

  const ctx =
    canvas.getContext(
      "2d"
    );

  const gradient =
    ctx.createRadialGradient(
      128,
      128,
      8,
      128,
      128,
      128
    );

  gradient.addColorStop(
    0,
    "rgba(255,247,205,1)"
  );

  gradient.addColorStop(
    0.3,
    "rgba(255,220,130,.7)"
  );

  gradient.addColorStop(
    1,
    "rgba(255,220,130,0)"
  );

  ctx.fillStyle = gradient;

  ctx.fillRect(
    0,
    0,
    256,
    256
  );

  return new THREE.CanvasTexture(
    canvas
  );

}

const sunSprite =
  new THREE.Sprite(

    new THREE.SpriteMaterial({

      map:
        createSunTexture(),

      transparent:
        true,

      depthWrite:
        false

    })

  );

sunSprite.position.set(
  -1800,
  1300,
  -2400
);

sunSprite.scale.set(
  500,
  500,
  1
);

scene.add(
  sunSprite
);

// ======================================================
// SNOW / MIST VFX
// ======================================================

let snow = null;

let randomSeed = 918273;

function random() {

  randomSeed =
    (
      randomSeed *
      1664525 +
      1013904223
    ) %
    4294967296;

  return (
    randomSeed /
    4294967296
  );

}

function createSnowMist() {

  const geometry =
    new THREE.BufferGeometry();

  const positions = [];

  const velocities = [];

  for (
    let i = 0;
    i < 520;
    i++
  ) {

    positions.push(

      -250 +
      (
        random() - 0.5
      ) * 1500,

      80 +
      random() * 420,

      -300 +
      (
        random() - 0.5
      ) * 1500

    );

    velocities.push(
      0.45 +
      random() * 0.55
    );

  }

  geometry.setAttribute(

    "position",

    new THREE.Float32BufferAttribute(
      positions,
      3
    )

  );

  const material =
    new THREE.PointsMaterial({

      color:
        0xffffff,

      size:
        1.45,

      transparent:
        true,

      opacity:
        0.58,

      depthWrite:
        false

    });

  snow =
    new THREE.Points(
      geometry,
      material
    );

  snow.userData.velocities =
    velocities;

  scene.add(snow);

}

function updateSnow(delta) {

  if (!snow) {
    return;
  }

  const positions =
    snow.geometry
      .attributes
      .position;

  const velocities =
    snow.userData
      .velocities;

  for (
    let i = 0;
    i < positions.count;
    i++
  ) {

    let y =
      positions.getY(i) -
      velocities[i] *
      delta *
      5;

    let x =
      positions.getX(i) +
      Math.sin(
        i * 1.7 +
        performance.now() *
        0.00035
      ) *
      delta *
      0.18;

    if (
      y < 40
    ) {

      y = 480;

    }

    positions.setXYZ(

      i,

      x,

      y,

      positions.getZ(i)

    );

  }

  positions.needsUpdate = true;

}

// ======================================================
// FINAL FART EFFECT
// ======================================================

const fartClouds = [];

let finalFartPlayed =
  false;

function createFartTexture() {

  const canvas =
    document.createElement(
      "canvas"
    );

  canvas.width =
    128;

  canvas.height =
    128;

  const ctx =
    canvas.getContext(
      "2d"
    );

  const gradient =
    ctx.createRadialGradient(
      64,
      64,
      5,
      64,
      64,
      64
    );

  gradient.addColorStop(
    0,
    "rgba(105,70,35,0.82)"
  );

  gradient.addColorStop(
    0.45,
    "rgba(120,82,40,0.52)"
  );

  gradient.addColorStop(
    1,
    "rgba(80,55,30,0)"
  );

  ctx.fillStyle =
    gradient;

  ctx.fillRect(
    0,
    0,
    128,
    128
  );

  return new THREE.CanvasTexture(
    canvas
  );

}

const fartTexture =
  createFartTexture();

function emitFart(
  character,
  amount = 12
) {

  if (
    !character ||
    !character.model
  ) {

    return;

  }

  const angle =
    character.model.rotation.y;

  const backward =
    new THREE.Vector3(
      -Math.sin(angle),
      0,
      -Math.cos(angle)
    );

  const sideways =
    new THREE.Vector3(
      backward.z,
      0,
      -backward.x
    );

  const origin =
    character.model.position
      .clone();

  origin.y +=
    0.65;

  origin.addScaledVector(
    backward,
    0.45
  );

  for (
    let i = 0;
    i < amount;
    i++
  ) {

    const material =
      new THREE.SpriteMaterial({

        map:
          fartTexture,

        transparent:
          true,

        opacity:
          0.7,

        depthWrite:
          false

      });

    const puff =
      new THREE.Sprite(
        material
      );

    puff.position.copy(
      origin
    );

    puff.position.addScaledVector(
      sideways,
      (
        Math.random() -
        0.5
      ) *
      0.4
    );

    puff.position.addScaledVector(
      backward,
      Math.random() *
      0.35
    );

    puff.position.y +=
      (
        Math.random() -
        0.5
      ) *
      0.18;

    const startScale =
      0.25 +
      Math.random() *
      0.22;

    puff.scale.set(
      startScale,
      startScale,
      1
    );

    scene.add(
      puff
    );

    fartClouds.push({

      sprite:
        puff,

      material,

      age:
        0,

      lifetime:
        1.1 +
        Math.random() *
        0.5,

      velocity:
        backward
          .clone()
          .multiplyScalar(
            0.7 +
            Math.random() *
            0.6
          )
          .addScaledVector(
            sideways,
            (
              Math.random() -
              0.5
            ) *
            0.35
          )
          .add(
            new THREE.Vector3(
              0,
              0.28,
              0
            )
          )

    });

  }

}

function updateFartClouds(
  delta
) {

  for (
    let i =
      fartClouds.length -
      1;
    i >= 0;
    i--
  ) {

    const cloud =
      fartClouds[i];

    cloud.age +=
      delta;

    cloud.sprite.position
      .addScaledVector(
        cloud.velocity,
        delta
      );

    cloud.sprite.scale
      .multiplyScalar(
        1 +
        delta *
        0.9
      );

    const progress =
      cloud.age /
      cloud.lifetime;

    cloud.material.opacity =
      Math.max(
        0,
        0.7 *
        (
          1 -
          progress
        )
      );

    if (
      cloud.age >=
      cloud.lifetime
    ) {

      scene.remove(
        cloud.sprite
      );

      cloud.material.dispose();

      fartClouds.splice(
        i,
        1
      );

    }

  }

}

function triggerFinalFartSequence() {

  if (
    finalFartPlayed
  ) {

    return;

  }

  finalFartPlayed =
    true;

  setTimeout(
    () => {

      emitFart(
        aneesh,
        12
      );

    },
    700
  );

  setTimeout(
    () => {

      emitFart(
        dad,
        14
      );

    },
    1450
  );

}

// ======================================================
// LOADER
// ======================================================

const loader =
  new GLTFLoader();

const templates = {};

function assetURL(file) {

  return new URL(
    MODEL_FOLDER + file,
    import.meta.url
  ).href;

}

function loadGLB(file) {

  return new Promise(
    (
      resolve,
      reject
    ) => {

      loader.load(

        assetURL(file),

        resolve,

        undefined,

        error => {

          console.error(
            `Failed to load ${file}`,
            error
          );

          reject(error);

        }

      );

    }
  );

}

// ======================================================
// REMOVE DEBUG HELPERS
// ======================================================

function isHelperName(
  name = ""
) {

  return /(collider|collision|trigger|helper|debug|invisible|blocker|bounding|bounds|hitbox)/i
    .test(name);

}

function sanitizeModel(model) {

  model.traverse(
    object => {

      if (
        isHelperName(
          object.name
        )
      ) {

        object.visible = false;

        return;

      }

      if (
        object.isMesh
      ) {

        object.castShadow = true;

        object.receiveShadow = true;

        const materials =
          Array.isArray(
            object.material
          )
            ? object.material
            : [object.material];

        for (
          const material
          of materials
        ) {

          if (!material) {
            continue;
          }

          if (
            isHelperName(
              material.name
            )
          ) {

            object.visible = false;

            break;

          }

        }

      }

    }
  );

}

function prepareModel(
  model,
  cast = true,
  receive = true
) {

  sanitizeModel(model);

  model.traverse(
    object => {

      if (
        !object.isMesh ||
        !object.visible
      ) {

        return;

      }

      object.castShadow =
        cast;

      object.receiveShadow =
        receive;

    }
  );

}

// ======================================================
// VISIBLE BOUNDING BOX
// ======================================================

function visualBox(model) {

  model.updateMatrixWorld(
    true
  );

  const total =
    new THREE.Box3();

  let found = false;

  model.traverse(
    object => {

      if (
        !object.isMesh ||
        !object.visible ||
        isHelperName(
          object.name
        )
      ) {

        return;

      }

      if (
        !object.geometry
      ) {

        return;

      }

      if (
        !object.geometry.boundingBox
      ) {

        object.geometry
          .computeBoundingBox();

      }

      if (
        !object.geometry.boundingBox
      ) {

        return;

      }

      const box =
        object.geometry
          .boundingBox
          .clone()
          .applyMatrix4(
            object.matrixWorld
          );

      if (!found) {

        total.copy(box);

        found = true;

      }

      else {

        total.union(box);

      }

    }
  );

  if (!found) {

    return new THREE.Box3()
      .setFromObject(
        model
      );

  }

  return total;

}

function modelHeight(model) {

  const box =
    visualBox(model);

  return Math.max(
    0.0001,
    box.max.y -
    box.min.y
  );

}

function scaleToHeight(
  model,
  height
) {

  const current =
    modelHeight(model);

  if (
    current <= 0
  ) {

    return;

  }

  model.scale.multiplyScalar(
    height /
    current
  );

  model.updateMatrixWorld(
    true
  );

}

function setVisualBottomAt(
  model,
  y
) {

  model.updateMatrixWorld(
    true
  );

  const box =
    visualBox(model);

  model.position.y +=
    y -
    box.min.y;

  model.updateMatrixWorld(
    true
  );

}

function centerModelAt(
  model,
  x,
  y,
  z
) {

  model.updateMatrixWorld(
    true
  );

  const box =
    visualBox(model);

  const center =
    new THREE.Vector3();

  box.getCenter(center);

  model.position.x +=
    x -
    center.x;

  model.position.y +=
    y -
    center.y;

  model.position.z +=
    z -
    center.z;

  model.updateMatrixWorld(
    true
  );

}

// ======================================================
// TERRAIN
// ======================================================

let mountain = null;

let mountainBox = null;

let lake = null;

const raycaster =
  new THREE.Raycaster();

const down =
  new THREE.Vector3(
    0,
    -1,
    0
  );

const terrainCache =
  new Map();

function terrainHeight(
  x,
  z
) {

  if (
    !mountain ||
    !mountainBox
  ) {

    return null;

  }

  const key =
    `${
      Math.round(
        x * 2
      ) / 2
    }:${
      Math.round(
        z * 2
      ) / 2
    }`;

  if (
    terrainCache.has(key)
  ) {

    return terrainCache.get(
      key
    );

  }

  raycaster.set(

    new THREE.Vector3(
      x,
      mountainBox.max.y +
      1000,
      z
    ),

    down

  );

  raycaster.far = 5000;

  const hits =
    raycaster
      .intersectObject(
        mountain,
        true
      )
      .filter(
        hit =>
          hit.object.visible
      );

  const y =
    hits.length
      ? hits[0].point.y
      : null;

  terrainCache.set(
    key,
    y
  );

  return y;

}

function groundCharacter(
  character
) {

  const y =
    terrainHeight(

      character.model.position.x,

      character.model.position.z

    );

  if (
    y !== null
  ) {

    character.model.position.y =
      y;

  }

}

// ======================================================
// INVISIBLE COLLISION DATA
// ======================================================

const colliders = [];

const WORLD_LIMITS = {

  minX: -430,

  maxX: 320,

  minZ: -540,

  maxZ: 240

};

const LAKE_BLOCKER = {

  x: -300,

  z: -410,

  radiusX: 92,

  radiusZ: 102

};

function addCollider(
  object,
  radius
) {

  colliders.push({

    object,

    radius

  });

}

function insideLakeBlocker(
  x,
  z
) {

  const nx =
    (
      x -
      LAKE_BLOCKER.x
    ) /
    LAKE_BLOCKER.radiusX;

  const nz =
    (
      z -
      LAKE_BLOCKER.z
    ) /
    LAKE_BLOCKER.radiusZ;

  return (
    nx * nx +
    nz * nz
  ) < 1;

}

function outsideWorldBoundary(
  x,
  z
) {

  return (

    x <
      WORLD_LIMITS.minX ||

    x >
      WORLD_LIMITS.maxX ||

    z <
      WORLD_LIMITS.minZ ||

    z >
      WORLD_LIMITS.maxZ

  );

}

function blocked(
  x,
  z
) {

  if (
    insideLakeBlocker(
      x,
      z
    )
  ) {

    return true;

  }

  if (
    outsideWorldBoundary(
      x,
      z
    )
  ) {

    return true;

  }

  return colliders.some(
    collider => {

      const dx =
        x -
        collider.object
          .position.x;

      const dz =
        z -
        collider.object
          .position.z;

      return (
        dx * dx +
        dz * dz
      ) <
      collider.radius *
      collider.radius;

    }
  );

}

// ======================================================
// EDGE FOG
// ======================================================

function updateBoundaryFog() {

  if (
    !mom ||
    !scene.fog
  ) {

    return;

  }

  const x =
    mom.model.position.x;

  const z =
    mom.model.position.z;

  const edgeDistance =
    Math.min(

      x -
        WORLD_LIMITS.minX,

      WORLD_LIMITS.maxX -
        x,

      z -
        WORLD_LIMITS.minZ,

      WORLD_LIMITS.maxZ -
        z

    );

  const edgeFactor =
    THREE.MathUtils.clamp(

      1 -
      edgeDistance /
      115,

      0,

      1

    );

  scene.fog.density =
    THREE.MathUtils.lerp(

      0.00095,

      0.0052,

      edgeFactor *
      edgeFactor

    );

}

// ======================================================
// CHARACTER CLASS
// ======================================================

class Character {

  constructor(
    model,
    animations,
    targetHeight
  ) {

    this.model =
      model;

    this.mixer =
      new THREE.AnimationMixer(
        model
      );

    this.actions = {};

    this.currentAction =
      null;

    prepareModel(
      model,
      true,
      true
    );

    scaleToHeight(
      model,
      targetHeight
    );

    for (
      const clip
      of animations
    ) {

      const name =
        clip.name
          .toLowerCase();

      const action =
        this.mixer
          .clipAction(
            clip
          );

      if (
        name.includes(
          "idle"
        )
      ) {

        this.actions.idle =
          action;

      }

      if (
        name.includes(
          "walk"
        )
      ) {

        this.actions.walk =
          action;

      }

      if (
        name.includes(
          "run"
        )
      ) {

        this.actions.run =
          action;

      }

    }

    this.play(
      "idle"
    );

  }

  play(name) {

    const next =
      this.actions[name];

    if (
      !next ||
      next ===
        this.currentAction
    ) {

      return;

    }

    next.reset();

    next.play();

    if (
      this.currentAction
    ) {

      this.currentAction
        .crossFadeTo(
          next,
          0.2,
          false
        );

    }

    this.currentAction =
      next;

  }

  update(delta) {

    this.mixer.update(
      delta
    );

  }

}

// ======================================================
// CHARACTERS
// ======================================================

let mom = null;

let dad = null;

let aneesh = null;

// ======================================================
// GAME STATE
// ======================================================

let gameMode =
  "loading";

let currentClue =
  0;

let clueWindowOpen =
  false;

let finalAreaTriggered =
  false;

let finalNoteRead =
  false;

let grounded =
  true;

let verticalVelocity =
  0;

const keys = {

  w: false,

  a: false,

  s: false,

  d: false,

  shift: false

};

const WALK_SPEED =
  7;

const RUN_SPEED =
  12;

const GRAVITY =
  24;

const JUMP_FORCE =
  9;

// ======================================================
// CLUE DATA
// ======================================================

const clueData = [

  {

    title:
      "Clue 1",

    text:
      "Where the path rises gently, find the lonely light watching over the trail.",

    objective:
      "Find the elevated lamp."

  },

  {

    title:
      "Clue 2",

    text:
      "Stone keeps secrets well. Search where a large rock hides what lies behind it.",

    objective:
      "Search behind the rock."

  },

  {

    title:
      "Clue 3",

    text:
      "The next secret waits close to something green, quiet and easy to overlook.",

    objective:
      "Look beside the shrub."

  },

  {

    title:
      "Clue 4",

    text:
      "Before the final climb, find a place made for resting. Look underneath.",

    objective:
      "Find the clue under the bench."

  },

  {

    title:
      "Clue 5",

    text:
      "The last path goes upward. Climb until the water and valleys lie beneath you.",

    objective:
      "Reach the rocky summit."

  }

];

// ======================================================
// WORLD LOCATIONS
// ======================================================

let startPoint = null;

let firstCluePoint = null;

let lampPoint = null;

let rockPoint = null;

let shrubPoint = null;

let benchPoint = null;

let finalPoint = null;

const clueObjects = [];

let finalNoteObject = null;

let cakeObject = null;

let saladBowlObject = null;

let navigationMarker = null;

// ======================================================
// MAIN TERRAIN + WATER
// ======================================================

async function buildTerrain() {

  const mountainGLTF =
    await loadGLB(
      FILES.mountain
    );

  mountain =
    mountainGLTF.scene;

  mountain.name =
    "MainMountain";

  prepareModel(
    mountain,
    true,
    true
  );

  scene.add(
    mountain
  );

  mountain.updateMatrixWorld(
    true
  );

  mountainBox =
    visualBox(
      mountain
    );

  const lakeGLTF =
    await loadGLB(
      FILES.lake
    );

  lake =
    lakeGLTF.scene;

  prepareModel(
    lake,
    false,
    true
  );

  lake.scale.setScalar(
    0.65
  );

  scene.add(
    lake
  );

  centerModelAt(
    lake,
    -300,
    91,
    -410
  );

  startPoint = {

    x: -205,

    y: 122.91,

    z: -300

  };

  firstCluePoint = {

    x: -205,

    y: 122.91,

    z: -300

  };

}

// ======================================================
// DISTANT CHICKENS
// ======================================================

async function buildDistantMountains() {

  const gltf =
    await loadGLB(
      FILES.distantMountain
    );

  const template =
    gltf.scene;

  prepareModel(
    template,
    false,
    true
  );

  const positions = [

    [-1800, -1700, 1.7],

    [1600, -1900, 1.9],

    [-2200, 500, 1.45],

    [2100, 600, 1.55],

    [-900, 2000, 1.65],

    [1200, 2100, 1.5]

  ];

  for (
    const [
      x,
      z,
      scale
    ]
    of positions
  ) {

    const clone =
      template.clone(true);

    clone.position.set(
      x,
      -80,
      z
    );

    clone.scale.setScalar(
      scale
    );

    clone.rotation.y =
      random() *
      Math.PI *
      2;

    scene.add(clone);

  }

}

// ======================================================
// WORLD ASSET TEMPLATES
// ======================================================

async function loadWorldTemplates() {

  const entries = [

    [
      "tree",
      FILES.tree
    ],

    [
      "grass",
      FILES.grass
    ],

    [
      "rock",
      FILES.rock
    ],

    [
      "shrub",
      FILES.shrub
    ],

    [
      "lamp",
      FILES.lamp
    ],

    [
      "bench",
      FILES.bench
    ],

    [
      "wood",
      FILES.wood
    ],

    [
      "note",
      FILES.note
    ],

    [
      "cake",
      FILES.cake
    ],

    [
      "saladBowl",
      FILES.saladBowl
    ]

  ];

  for (
    const [
      key,
      file
    ]
    of entries
  ) {

    const gltf =
      await loadGLB(
        file
      );

    templates[key] =
      gltf.scene;

    prepareModel(

      templates[key],

      true,

      true

    );

  }

}

// ======================================================
// SINGLE-CARB EXTRACTION
// ======================================================
//
// IMPORTANT:
//
// Some GLBs are PACKS.
// One clone of the whole tree GLB can contain several trees.
// One clone of the whole grass GLB can contain several patches.
//
// This function extracts ONE useful top-level model,
// removes the pack offset, centres it,
// and gives us one clean carb.
//
// ======================================================

function collectUsableVariants(
  template
) {

  const variants = [];

  for (
    const child
    of template.children
  ) {

    if (
      !child.visible
    ) {

      continue;

    }

    let containsMesh =
      false;

    child.traverse(
      obj => {

        if (
          obj.isMesh &&
          obj.visible
        ) {

          containsMesh =
            true;

        }

      }
    );

    if (
      containsMesh
    ) {

      variants.push(
        child
      );

    }

  }

  return variants;

}

function cloneSingleVariant(
  template,
  variantIndex = 0
) {

  const usable =
    collectUsableVariants(
      template
    );

  let chosenClone;

  if (
    usable.length >
    1
  ) {

    const chosen =
      usable[
        variantIndex %
        usable.length
      ];

    chosenClone =
      chosen.clone(
        true
      );

  }

  else {

    chosenClone =
      template.clone(
        true
      );

  }

  const holder =
    new THREE.Group();

  holder.add(
    chosenClone
  );

  chosenClone.position.set(
    0,
    0,
    0
  );

  holder.updateMatrixWorld(
    true
  );

  const box =
    visualBox(
      holder
    );

  const centerX =
    (
      box.min.x +
      box.max.x
    ) /
    2;

  const centerZ =
    (
      box.min.z +
      box.max.z
    ) /
    2;

  chosenClone.position.x -=
    centerX;

  chosenClone.position.z -=
    centerZ;

  holder.updateMatrixWorld(
    true
  );

  const correctedBox =
    visualBox(
      holder
    );

  chosenClone.position.y -=
    correctedBox.min.y;

  holder.updateMatrixWorld(
    true
  );

  prepareModel(
    holder,
    true,
    true
  );

  return holder;

}

// ======================================================
// FIXED PROP PLACEMENT
// ======================================================

function createFixedProp(
  template,
  x,
  y,
  z,
  height,
  rotation = 0,
  colliderRadius = 0,
  variantIndex = 0
) {

  const clone =
    cloneSingleVariant(
      template,
      variantIndex
    );

  scaleToHeight(
    clone,
    height
  );

  clone.rotation.y =
    rotation;

  clone.position.set(
    x,
    y,
    z
  );

  clone.updateMatrixWorld(
    true
  );

  setVisualBottomAt(
    clone,
    y
  );

  scene.add(
    clone
  );

  if (
    colliderRadius >
    0
  ) {

    addCollider(
      clone,
      colliderRadius
    );

  }

  return clone;

}

// ======================================================
// FIXED CLUE
// ======================================================

function createFixedClue(
  point,
  height = 0.32
) {

  const clue =
    cloneSingleVariant(
      templates.note,
      0
    );

  scaleToHeight(
    clue,
    height
  );

  clue.position.set(

    point.x,

    point.y,

    point.z

  );

  clue.updateMatrixWorld(
    true
  );

  setVisualBottomAt(
    clue,
    point.y +
    0.04
  );

  scene.add(
    clue
  );

  clueObjects.push(
    clue
  );

  return clue;

}

// ======================================================
// ROUTE LOCATIONS
// ======================================================

function buildClueLocations() {

  firstCluePoint = {

    x: -205,

    y: 122.91,

    z: -300

  };

  lampPoint = {

    x: -145,

    y: 149.27,

    z: -265

  };

  rockPoint = {

    x: -65,

    y: 185.07,

    z: -205

  };

  shrubPoint = {

    x: 20,

    y: 226.61,

    z: -125

  };

  benchPoint = {

    x: 90,

    y: 299.64,

    z: -30

  };

  finalPoint = {

    x: 172,

    y: 347.30,

    z: 90

  };

}

// ======================================================
// TREE CARBS
// ======================================================

const TREE_LAYOUT = [

  {
    x: -239,
    y: 121.2,
    z: -270,
    scale: .88,
    rot: .1
  },

  {
    x: -226,
    y: 126.8,
    z: -250,
    scale: .96,
    rot: .8
  },

  {
    x: -210,
    y: 132.2,
    z: -231,
    scale: 1.05,
    rot: 1.4
  },

  {
    x: -188,
    y: 131.5,
    z: -278,
    scale: .92,
    rot: 2.2
  },

  {
    x: -175,
    y: 140.4,
    z: -246,
    scale: 1.04,
    rot: 2.9
  },

  {
    x: -159,
    y: 146.7,
    z: -226,
    scale: .94,
    rot: 3.4
  },

  {
    x: -132,
    y: 156.8,
    z: -302,
    scale: .88,
    rot: 4.1
  },

  {
    x: -115,
    y: 161.5,
    z: -284,
    scale: 1.05,
    rot: 5.0
  },

  {
    x: -99,
    y: 168.0,
    z: -263,
    scale: .95,
    rot: 5.8
  },

  {
    x: -94,
    y: 169.0,
    z: -235,
    scale: 1.08,
    rot: .3
  },

  {
    x: -72,
    y: 182.8,
    z: -255,
    scale: .92,
    rot: 1.1
  },

  {
    x: -54,
    y: 186.5,
    z: -235,
    scale: 1.03,
    rot: 1.8
  },

  {
    x: -31,
    y: 197.5,
    z: -190,
    scale: .90,
    rot: 2.5
  },

  {
    x: -19,
    y: 201.7,
    z: -169,
    scale: 1.02,
    rot: 3.2
  },

  {
    x: 0,
    y: 208.5,
    z: -184,
    scale: .93,
    rot: 3.9
  },

  {
    x: 11,
    y: 218.7,
    z: -160,
    scale: .98,
    rot: 4.6
  },

  {
    x: 34,
    y: 231.1,
    z: -154,
    scale: .90,
    rot: 5.4
  },

  {
    x: 45,
    y: 246.5,
    z: -134,
    scale: 1.06,
    rot: 6.0
  },

  {
    x: 61,
    y: 264.8,
    z: -110,
    scale: .92,
    rot: .6
  },

  {
    x: 74,
    y: 273.0,
    z: -95,
    scale: 1.03,
    rot: 1.3
  },

  {
    x: 81,
    y: 281.6,
    z: -65,
    scale: .88,
    rot: 2.0
  },

  {
    x: 105,
    y: 279.3,
    z: -75,
    scale: 1.02,
    rot: 2.8
  },

  {
    x: 115,
    y: 274.2,
    z: -51,
    scale: .94,
    rot: 3.5
  },

  {
    x: 125,
    y: 277.2,
    z: -20,
    scale: 1.00,
    rot: 4.2
  },

  {
    x: 130,
    y: 288.1,
    z: 9,
    scale: .90,
    rot: 4.9
  },

  {
    x: 146,
    y: 290.5,
    z: 20,
    scale: 1.04,
    rot: 5.7
  },

  {
    x: 155,
    y: 297.2,
    z: 35,
    scale: .92,
    rot: .2
  },

  {
    x: 189,
    y: 301.4,
    z: 35,
    scale: 1.02,
    rot: .9
  },

  {
    x: 205,
    y: 290.1,
    z: 55,
    scale: .94,
    rot: 1.6
  },

  {
    x: 214,
    y: 299.8,
    z: 75,
    scale: 1.00,
    rot: 2.3
  }

];

// ======================================================
// GRASS CARBS
// ======================================================

const GRASS_LAYOUT = [

  {
    x: -218,
    y: 116.0,
    z: -315,
    scale: .88,
    rot: 0
  },

  {
    x: -212,
    y: 119.0,
    z: -308,
    scale: .94,
    rot: .73
  },

  {
    x: -205,
    y: 122.91,
    z: -300,
    scale: 1,
    rot: 1.46
  },

  {
    x: -198,
    y: 125.97,
    z: -295,
    scale: 1.06,
    rot: 2.19
  },

  {
    x: -190,
    y: 129.42,
    z: -290,
    scale: 1.12,
    rot: 2.92
  },

  {
    x: -175,
    y: 137.21,
    z: -278,
    scale: .88,
    rot: 3.65
  },

  {
    x: -165,
    y: 141.93,
    z: -270,
    scale: .94,
    rot: 4.38
  },

  {
    x: -150,
    y: 147.45,
    z: -262,
    scale: 1,
    rot: 5.11
  },

  {
    x: -140,
    y: 151.45,
    z: -255,
    scale: 1.06,
    rot: 5.84
  },

  {
    x: -125,
    y: 157.26,
    z: -245,
    scale: 1.12,
    rot: .29
  },

  {
    x: -110,
    y: 163.86,
    z: -235,
    scale: .88,
    rot: 1.02
  },

  {
    x: -95,
    y: 170.57,
    z: -225,
    scale: .94,
    rot: 1.75
  },

  {
    x: -80,
    y: 177.31,
    z: -215,
    scale: 1,
    rot: 2.48
  },

  {
    x: -65,
    y: 185.07,
    z: -205,
    scale: 1.06,
    rot: 3.21
  },

  {
    x: -50,
    y: 189.95,
    z: -195,
    scale: 1.12,
    rot: 3.94
  },

  {
    x: -35,
    y: 194.62,
    z: -180,
    scale: .88,
    rot: 4.67
  },

  {
    x: -20,
    y: 202.11,
    z: -165,
    scale: .94,
    rot: 5.4
  },

  {
    x: -5,
    y: 210.54,
    z: -150,
    scale: 1,
    rot: 6.13
  },

  {
    x: 10,
    y: 220.81,
    z: -135,
    scale: 1.06,
    rot: .58
  },

  {
    x: 25,
    y: 231.7,
    z: -120,
    scale: 1.12,
    rot: 1.31
  },

  {
    x: 40,
    y: 245.1,
    z: -105,
    scale: .88,
    rot: 2.04
  },

  {
    x: 55,
    y: 263.5,
    z: -90,
    scale: .94,
    rot: 2.77
  },

  {
    x: 70,
    y: 278.09,
    z: -75,
    scale: 1,
    rot: 3.5
  },

  {
    x: 82,
    y: 283.68,
    z: -60,
    scale: 1.06,
    rot: 4.23
  },

  {
    x: 90,
    y: 292.2,
    z: -45,
    scale: 1.12,
    rot: 4.96
  },

  {
    x: 98,
    y: 296.36,
    z: -30,
    scale: .88,
    rot: 5.69
  },

  {
    x: 105,
    y: 296.52,
    z: -15,
    scale: .94,
    rot: .14
  },

  {
    x: 112,
    y: 298.94,
    z: 0,
    scale: 1,
    rot: .87
  },

  {
    x: 120,
    y: 295.38,
    z: 15,
    scale: 1.06,
    rot: 1.6
  },

  {
    x: 128,
    y: 298.79,
    z: 30,
    scale: 1.12,
    rot: 2.33
  },

  {
    x: 136,
    y: 303.81,
    z: 45,
    scale: .88,
    rot: 3.06
  },

  {
    x: 145,
    y: 309.57,
    z: 58,
    scale: .94,
    rot: 3.79
  },

  {
    x: 152,
    y: 317.1,
    z: 70,
    scale: 1,
    rot: 4.52
  },

  {
    x: 158,
    y: 323.7,
    z: 80,
    scale: 1.06,
    rot: 5.25
  },

  {
    x: 165,
    y: 338.84,
    z: 88,
    scale: 1.12,
    rot: 5.98
  },

  {
    x: 175,
    y: 338.93,
    z: 98,
    scale: .88,
    rot: .43
  },

  {
    x: 185,
    y: 324.43,
    z: 104,
    scale: .94,
    rot: 1.16
  },

  {
    x: 195,
    y: 323.24,
    z: 110,
    scale: 1,
    rot: 1.89
  },

  {
    x: 150,
    y: 339.72,
    z: 105,
    scale: 1.06,
    rot: 2.62
  },

  {
    x: 140,
    y: 338.66,
    z: 115,
    scale: 1.12,
    rot: 3.35
  }

];

// ======================================================
// SHRUB CARBS
// ======================================================

const SHRUB_LAYOUT = [

  {
    x: -210,
    y: 123.65,
    z: -292,
    scale: .88,
    rot: 0
  },

  {
    x: -180,
    y: 135.94,
    z: -275,
    scale: .94,
    rot: .73
  },

  {
    x: -150,
    y: 147.78,
    z: -250,
    scale: 1,
    rot: 1.46
  },

  {
    x: -120,
    y: 160.35,
    z: -235,
    scale: 1.06,
    rot: 2.19
  },

  {
    x: -90,
    y: 175.37,
    z: -215,
    scale: 1.12,
    rot: 2.92
  },

  {
    x: -60,
    y: 185.2,
    z: -195,
    scale: .88,
    rot: 3.65
  },

  {
    x: -25,
    y: 199.92,
    z: -165,
    scale: .94,
    rot: 4.38
  },

  {
    x: 5,
    y: 218.1,
    z: -140,
    scale: 1,
    rot: 5.11
  },

  {
    x: 35,
    y: 239.27,
    z: -115,
    scale: 1.06,
    rot: 5.84
  },

  {
    x: 65,
    y: 271.86,
    z: -80,
    scale: 1.12,
    rot: .29
  },

  {
    x: 95,
    y: 295.47,
    z: -40,
    scale: .88,
    rot: 1.02
  },

  {
    x: 125,
    y: 290.21,
    z: 10,
    scale: .94,
    rot: 1.75
  },

  {
    x: 150,
    y: 309.34,
    z: 55,
    scale: 1,
    rot: 2.48
  },

  {
    x: 185,
    y: 324.53,
    z: 110,
    scale: 1.06,
    rot: 3.21
  }

];

// ======================================================
// LOG CARBS
// ======================================================

const LOG_LAYOUT = [

  {
    x: -195,
    y: 124.93,
    z: -305,
    scale: .88,
    rot: 0
  },

  {
    x: -185,
    y: 129.7,
    z: -298,
    scale: .94,
    rot: .73
  },

  {
    x: -155,
    y: 144.68,
    z: -275,
    scale: 1,
    rot: 1.46
  },

  {
    x: -135,
    y: 153.3,
    z: -255,
    scale: 1.06,
    rot: 2.19
  },

  {
    x: -105,
    y: 165.6,
    z: -235,
    scale: 1.12,
    rot: 2.92
  },

  {
    x: -85,
    y: 174.77,
    z: -220,
    scale: .88,
    rot: 3.65
  },

  {
    x: -55,
    y: 188.11,
    z: -200,
    scale: .94,
    rot: 4.38
  },

  {
    x: -35,
    y: 195.22,
    z: -185,
    scale: 1,
    rot: 5.11
  },

  {
    x: -5,
    y: 210.54,
    z: -150,
    scale: 1.06,
    rot: 5.84
  },

  {
    x: 15,
    y: 222.42,
    z: -135,
    scale: 1.12,
    rot: .29
  },

  {
    x: 40,
    y: 245.1,
    z: -105,
    scale: .88,
    rot: 1.02
  },

  {
    x: 60,
    y: 268.18,
    z: -85,
    scale: .94,
    rot: 1.75
  },

  {
    x: 82,
    y: 287.32,
    z: -55,
    scale: 1,
    rot: 2.48
  },

  {
    x: 105,
    y: 295.13,
    z: -20,
    scale: 1.06,
    rot: 3.21
  },

  {
    x: 125,
    y: 292.48,
    z: 15,
    scale: 1.12,
    rot: 3.94
  },

  {
    x: 140,
    y: 301.08,
    z: 40,
    scale: .88,
    rot: 4.67
  },

  {
    x: 155,
    y: 313.65,
    z: 65,
    scale: .94,
    rot: 5.4
  },

  {
    x: 180,
    y: 326.65,
    z: 105,
    scale: 1,
    rot: 6.13
  }

];

// ======================================================
// ROCK CARBS
// ======================================================

const ROCK_LAYOUT = [

  {
    x: -220,
    y: 122.27,
    z: -285,
    scale: .88,
    rot: 0
  },

  {
    x: -170,
    y: 140.49,
    z: -260,
    scale: .94,
    rot: .73
  },

  {
    x: -120,
    y: 158.58,
    z: -250,
    scale: 1,
    rot: 1.46
  },

  {
    x: -75,
    y: 178.53,
    z: -225,
    scale: 1.06,
    rot: 2.19
  },

  {
    x: -40,
    y: 192.61,
    z: -175,
    scale: 1.12,
    rot: 2.92
  },

  {
    x: 0,
    y: 214.16,
    z: -145,
    scale: .88,
    rot: 3.65
  },

  {
    x: 30,
    y: 237.55,
    z: -115,
    scale: .94,
    rot: 4.38
  },

  {
    x: 70,
    y: 279.91,
    z: -70,
    scale: 1,
    rot: 5.11
  },

  {
    x: 100,
    y: 296.77,
    z: -25,
    scale: 1.06,
    rot: 5.84
  },

  {
    x: 130,
    y: 294.37,
    z: 25,
    scale: 1.12,
    rot: .29
  },

  {
    x: 155,
    y: 312.38,
    z: 60,
    scale: .88,
    rot: 1.02
  },

  {
    x: 190,
    y: 322.69,
    z: 105,
    scale: .94,
    rot: 1.75
  }

];

// ======================================================
// BUILD HAND-PLACED ENVIRONMENT
// ======================================================

function buildHandPlacedEnvironment() {

  // TREE PACK:
  // use a different individual carb from the pack
  // for each placement.

  let treeVariant = 0;

  for (
    const item
    of TREE_LAYOUT
  ) {

    createFixedProp(

      templates.tree,

      item.x,

      item.y,

      item.z,

      7.5 *
        item.scale,

      item.rot,

      1.25,

      treeVariant

    );

    treeVariant++;

  }

  // GRASS PACK:
  // again, use individual carb pieces.

  let grassVariant = 0;

  for (
    const item
    of GRASS_LAYOUT
  ) {

    createFixedProp(

      templates.grass,

      item.x,

      item.y,

      item.z,

      0.55 *
        item.scale,

      item.rot,

      0,

      grassVariant

    );

    grassVariant++;

  }

  for (
    const item
    of SHRUB_LAYOUT
  ) {

    createFixedProp(

      templates.shrub,

      item.x,

      item.y,

      item.z,

      1.05 *
        item.scale,

      item.rot,

      .55,

      0

    );

  }

  for (
    const item
    of LOG_LAYOUT
  ) {

    createFixedProp(

      templates.wood,

      item.x,

      item.y,

      item.z,

      .62 *
        item.scale,

      item.rot,

      .5,

      0

    );

  }

  for (
    const item
    of ROCK_LAYOUT
  ) {

    createFixedProp(

      templates.rock,

      item.x,

      item.y,

      item.z,

      1.2 *
        item.scale,

      item.rot,

      .8,

      0

    );

  }

}

// ======================================================
// LANDMARKS
// ======================================================

function buildLandmarks() {

  // ====================================================
  // CLUE 1 — NEAR WATER
  // ====================================================

  createFixedClue(

    firstCluePoint,

    .32

  );

  // ====================================================
  // MAIN LAMP
  // ====================================================

  createFixedProp(

    templates.lamp,

    -145,

    149.27,

    -265,

    5,

    0,

    1.1

  );

  createFixedClue(

    {

      x: -143,

      y: 150.08,

      z: -264

    },

    .32

  );

  // ====================================================
  // LOG CARBS TO LAMP
  // ====================================================

  createFixedProp(

    templates.wood,

    -155,

    144.68,

    -275,

    .72,

    1.46,

    .55

  );

  createFixedProp(

    templates.wood,

    -151,

    146.12,

    -271,

    .68,

    1.60,

    .55

  );

  createFixedProp(

    templates.wood,

    -147,

    148.10,

    -268,

    .72,

    1.42,

    .55

  );

  // ====================================================
  // ROCK CLUE
  // ====================================================

  createFixedProp(

    templates.rock,

    -65,

    185.07,

    -205,

    3.1,

    2.2,

    2

  );

  createFixedClue(

    {

      x: -61,

      y: 185.73,

      z: -201

    },

    .30

  );

  // ====================================================
  // SHRUB CLUE
  // ====================================================

  createFixedProp(

    templates.shrub,

    20,

    226.61,

    -125,

    1.35,

    .6,

    .75

  );

  createFixedClue(

    {

      x: 22,

      y: 227.96,

      z: -123

    },

    .30

  );

  // ====================================================
  // BENCH CLUE
  // ====================================================

  createFixedProp(

    templates.bench,

    90,

    299.64,

    -30,

    1.05,

    0,

    1.8

  );

  createFixedClue(

    {

      x: 90,

      y: 300.05,

      z: -29

    },

    .26

  );

  // ====================================================
  // ROUTE LAMPS
  // ====================================================

  createFixedProp(

    templates.lamp,

    -178,

    136.95,

    -282,

    4.25,

    0,

    1

  );

  createFixedProp(

    templates.lamp,

    -105,

    165.60,

    -235,

    4.25,

    0,

    1

  );

  createFixedProp(

    templates.lamp,

    -20,

    202.11,

    -165,

    4.25,

    0,

    1

  );

  createFixedProp(

    templates.lamp,

    55,

    263.50,

    -90,

    4.25,

    0,

    1

  );

  createFixedProp(

    templates.lamp,

    125,

    292.48,

    15,

    4.25,

    0,

    1

  );

}

// ======================================================
// FINAL AREA
// ======================================================

function buildFinalArea() {

  // ====================================================
  // SALAD BOWL
  // ====================================================

  saladBowlObject =
    cloneSingleVariant(
      templates.saladBowl,
      0
    );

  scaleToHeight(
    saladBowlObject,
    3.6
  );

  saladBowlObject.rotation.y =
    Math.PI;

  saladBowlObject.position.set(

    172,

    347.30,

    90

  );

  saladBowlObject
    .updateMatrixWorld(
      true
    );

  setVisualBottomAt(

    saladBowlObject,

    347.30

  );

  scene.add(
    saladBowlObject
  );

  addCollider(

    saladBowlObject,

    2.25

  );

  // ====================================================
  // LEMON
  // ====================================================

  cakeObject =
    cloneSingleVariant(
      templates.cake,
      0
    );

  scaleToHeight(
    cakeObject,
    .78
  );

  cakeObject.position.set(

    168,

    346,

    92

  );

  cakeObject
    .updateMatrixWorld(
      true
    );

  setVisualBottomAt(

    cakeObject,

    346

  );

  scene.add(
    cakeObject
  );

  // Solid invisible collision.
  addCollider(

    cakeObject,

    2.8

  );

  // ====================================================
  // FINAL NOTE
  // ====================================================

  finalNoteObject =
    cloneSingleVariant(
      templates.note,
      0
    );

  scaleToHeight(
    finalNoteObject,
    .42
  );

  finalNoteObject.position.set(

    168,

    346.2,

    94

  );

  finalNoteObject
    .updateMatrixWorld(
      true
    );

  setVisualBottomAt(

    finalNoteObject,

    346.20

  );

  scene.add(
    finalNoteObject
  );

  // ====================================================
  // FINAL PEAK CARBS
  // ====================================================

  createFixedProp(

    templates.grass,

    165,

    338.84,

    88,

    .62,

    5.98,

    0,

    0

  );

  createFixedProp(

    templates.grass,

    175,

    338.93,

    98,

    .54,

    .43,

    0,

    1

  );

  createFixedProp(

    templates.grass,

    150,

    339.72,

    105,

    .60,

    2.62,

    0,

    0

  );

  createFixedProp(

    templates.shrub,

    185,

    324.53,

    110,

    1.05,

    3.21,

    .55

  );

  createFixedProp(

    templates.wood,

    180,

    326.65,

    105,

    .62,

    6.13,

    .5

  );

}

// ======================================================
// NAVIGATION
// ======================================================

function createNavigationMarker() {

  const geometry =
    new THREE.OctahedronGeometry(
      .55,
      0
    );

  const material =
    new THREE.MeshBasicMaterial({

      color:
        0xf2fbff,

      transparent:
        true,

      opacity:
        .52,

      depthWrite:
        false

    });

  navigationMarker =
    new THREE.Mesh(
      geometry,
      material
    );

  navigationMarker.visible =
    false;

  scene.add(
    navigationMarker
  );

}

function navigationTarget() {

  if (
    currentClue <
    clueObjects.length
  ) {

    return clueObjects[
      currentClue
    ];

  }

  if (
    currentClue >=
      clueObjects.length &&
    finalNoteObject
  ) {

    return finalNoteObject;

  }

  return null;

}

function updateNavigation(delta) {

  if (
    !navigationMarker ||
    !mom ||
    gameMode !==
      "gameplay" ||
    clueWindowOpen
  ) {

    if (
      navigationMarker
    ) {

      navigationMarker.visible =
        false;

    }

    navDot.style.opacity =
      "0";

    return;

  }

  const target =
    navigationTarget();

  if (!target) {

    navigationMarker.visible =
      false;

    navDot.style.opacity =
      "0";

    return;

  }

  const distance =
    mom.model
      .position
      .distanceTo(
        target.position
      );

  navigationMarker.visible =
    distance > 18;

  navigationMarker.position.copy(
    target.position
  );

  navigationMarker.position.y +=

    4.2 +

    Math.sin(
      performance.now() *
      .002
    ) *
    .35;

  navigationMarker.rotation.y +=
    delta *
    1.6;

  const projected =
    target.position
      .clone()
      .project(
        camera
      );

  const offscreen =

    Math.abs(
      projected.x
    ) > 1 ||

    Math.abs(
      projected.y
    ) > 1 ||

    projected.z > 1;

  navDot.style.opacity =

    offscreen &&
    distance > 28

      ? ".55"

      : "0";

  if (
    offscreen
  ) {

    const x =
      THREE.MathUtils.clamp(

        projected.x,

        -.88,

        .88

      );

    const y =
      THREE.MathUtils.clamp(

        projected.y,

        -.82,

        .82

      );

    navDot.style.left =
      `${
        50 +
        x *
        46
      }%`;

    navDot.style.top =
      `${
        50 -
        y *
        43
      }%`;

  }

}

// ======================================================
// LOAD CHARACTERS
// ======================================================

async function loadCharacters() {

  const [

    momGLTF,

    dadGLTF,

    aneeshGLTF

  ] =
    await Promise.all([

      loadGLB(
        FILES.mom
      ),

      loadGLB(
        FILES.dad
      ),

      loadGLB(
        FILES.aneesh
      )

    ]);

  mom =
    new Character(

      momGLTF.scene,

      momGLTF.animations,

      1.68

    );

  dad =
    new Character(

      dadGLTF.scene,

      dadGLTF.animations,

      1.78

    );

  aneesh =
    new Character(

      aneeshGLTF.scene,

      aneeshGLTF.animations,

      1.48

    );

  scene.add(

    mom.model,

    dad.model,

    aneesh.model

  );

  positionOpeningCharacters();

}

function positionOpeningCharacters() {

  const positions = [

    [

      mom,

      startPoint.x -
        2.2,

      startPoint.z +
        7

    ],

    [

      dad,

      startPoint.x +
        .8,

      startPoint.z +
        8

    ],

    [

      aneesh,

      startPoint.x +
        3,

      startPoint.z +
        9

    ]

  ];

  for (
    const [
      character,
      x,
      z
    ]
    of positions
  ) {

    character.model
      .position
      .set(

        x,

        terrainHeight(
          x,
          z
        ) ??
          startPoint.y,

        z

      );

    character.model
      .rotation.y =
        Math.PI;

  }

}

// ======================================================
// OPENING CUTSCENE
// ======================================================

let cutsceneTime = 0;

const openingDialogueFlags = {

  first: false,

  second: false,

  third: false

};

function startOpeningCutscene() {

  gameMode =
    "opening";

  controls.enabled =
    false;

  cutsceneBars
    .classList
    .add(
      "active"
    );

  setObjective("");

  camera.position.set(

    startPoint.x +
      18,

    startPoint.y +
      10,

    startPoint.z +
      23

  );

  camera.lookAt(

    startPoint.x,

    startPoint.y +
      1.4,

    startPoint.z

  );

}

function moveCharacterToward(
  character,
  target,
  speed,
  delta
) {

  const direction =
    new THREE.Vector3(

      target.x -
        character.model.position.x,

      0,

      target.z -
        character.model.position.z

    );

  const distance =
    direction.length();

  if (
    distance <
    .25
  ) {

    character.play(
      "idle"
    );

    return;

  }

  direction.normalize();

  character.model
    .position
    .addScaledVector(

      direction,

      speed *
      delta

    );

  const targetAngle =
    Math.atan2(

      direction.x,

      direction.z

    );

  let difference =
    targetAngle -
    character.model.rotation.y;

  difference =
    Math.atan2(

      Math.sin(
        difference
      ),

      Math.cos(
        difference
      )

    );

  character.model.rotation.y +=

    difference *

    Math.min(
      1,
      delta * 7
    );

  groundCharacter(
    character
  );

  character.play(
    "walk"
  );

}

function updateOpening(delta) {

  cutsceneTime +=
    delta;

  const clue =
    clueObjects[0];

  if (
    cutsceneTime <
    5
  ) {

    moveCharacterToward(

      mom,

      {

        x:
          startPoint.x -
          2,

        z:
          startPoint.z +
          1

      },

      1.25,

      delta

    );

    moveCharacterToward(

      dad,

      {

        x:
          startPoint.x +
          1,

        z:
          startPoint.z +
          2

      },

      1.2,

      delta

    );

    moveCharacterToward(

      aneesh,

      {

        x:
          startPoint.x +
          3,

        z:
          startPoint.z +
          3

      },

      1.3,

      delta

    );

    const desiredCamera =
      new THREE.Vector3(

        startPoint.x +
          15,

        startPoint.y +
          7,

        startPoint.z +
          17

      );

    camera.position.lerp(

      desiredCamera,

      delta *
      .55

    );

    camera.lookAt(

      mom.model.position.x,

      mom.model.position.y +
        1.1,

      mom.model.position.z

    );

  }

  else {

    mom.play("idle");

    dad.play("idle");

    aneesh.play("idle");

    if (
      clue
    ) {

      const direction =
        new THREE.Vector3()
          .subVectors(

            clue.position,

            mom.model.position

          );

      mom.model.rotation.y =
        Math.atan2(

          direction.x,

          direction.z

        );

    }

    const closeCamera =
      new THREE.Vector3(

        mom.model.position.x +
          4,

        mom.model.position.y +
          2.8,

        mom.model.position.z +
          5

      );

    camera.position.lerp(

      closeCamera,

      delta *
      1.1

    );

    camera.lookAt(

      clue
        ? clue.position
        : mom.model.position

    );

    if (
      cutsceneTime >
        5.4 &&
      !openingDialogueFlags.first
    ) {

      openingDialogueFlags.first =
        true;

      showSubtitle(

        "Mom",

        "Wait… what's that near the lake?",

        2.6

      );

    }

    if (
      cutsceneTime >
        8.1 &&
      !openingDialogueFlags.second
    ) {

      openingDialogueFlags.second =
        true;

      showSubtitle(

        "Dad",

        "That definitely looks like a clue.",

        2.7

      );

    }

    if (
      cutsceneTime >
        10.9 &&
      !openingDialogueFlags.third
    ) {

      openingDialogueFlags.third =
        true;

      showSubtitle(

        "Aneesh",

        "Then I think we know what we're doing next.",

        2.8

      );

    }

  }

  if (
    cutsceneTime >
    14
  ) {

    gameMode =
      "gameplay";

    controls.enabled =
      true;

    cutsceneBars
      .classList
      .remove(
        "active"
      );

    controls.target.set(

      mom.model.position.x,

      mom.model.position.y +
        1.25,

      mom.model.position.z

    );

    camera.position.set(

      mom.model.position.x,

      mom.model.position.y +
        3.4,

      mom.model.position.z +
        7.5

    );

    setObjective(
      "Read the clue near the lake."
    );

  }

}

// ======================================================
// PLAYER MOVEMENT
// ======================================================

const forward =
  new THREE.Vector3();

const right =
  new THREE.Vector3();

const movement =
  new THREE.Vector3();

function updatePlayer(delta) {

  if (
    gameMode !==
      "gameplay" ||
    clueWindowOpen
  ) {

    return;

  }

  let horizontal = 0;

  let vertical = 0;

  if (keys.w) {

    vertical += 1;

  }

  if (keys.s) {

    vertical -= 1;

  }

  if (keys.d) {

    horizontal += 1;

  }

  if (keys.a) {

    horizontal -= 1;

  }

  const moving =

    horizontal !== 0 ||

    vertical !== 0;

  if (moving) {

    camera.getWorldDirection(
      forward
    );

    forward.y = 0;

    forward.normalize();

    right
      .crossVectors(
        forward,
        camera.up
      )
      .normalize();

    movement.set(
      0,
      0,
      0
    );

    movement.addScaledVector(

      forward,

      vertical

    );

    movement.addScaledVector(

      right,

      horizontal

    );

    movement.normalize();

    const speed =
      keys.shift
        ? RUN_SPEED
        : WALK_SPEED;

    const proposedX =

      mom.model.position.x +

      movement.x *
      speed *
      delta;

    const proposedZ =

      mom.model.position.z +

      movement.z *
      speed *
      delta;

    const ground =
      terrainHeight(
        proposedX,
        proposedZ
      );

    if (
      ground !==
        null &&
      !blocked(
        proposedX,
        proposedZ
      )
    ) {

      const climb =

        ground -

        mom.model.position.y;

      if (
        climb <
        2.4
      ) {

        mom.model.position.x =
          proposedX;

        mom.model.position.z =
          proposedZ;

      }

    }

    const targetAngle =
      Math.atan2(

        movement.x,

        movement.z

      );

    let difference =

      targetAngle -

      mom.model.rotation.y;

    difference =
      Math.atan2(

        Math.sin(
          difference
        ),

        Math.cos(
          difference
        )

      );

    mom.model.rotation.y +=

      difference *

      Math.min(
        1,
        delta * 10
      );

    mom.play(

      keys.shift
        ? "run"
        : "walk"

    );

  }

  else {

    mom.play(
      "idle"
    );

  }

  verticalVelocity -=
    GRAVITY *
    delta;

  mom.model.position.y +=
    verticalVelocity *
    delta;

  const groundY =
    terrainHeight(

      mom.model.position.x,

      mom.model.position.z

    );

  if (
    groundY !==
      null &&
    mom.model.position.y <=
      groundY
  ) {

    mom.model.position.y =
      groundY;

    verticalVelocity = 0;

    grounded = true;

  }

  else {

    grounded = false;

  }

  const oldTarget =
    controls.target.clone();

  controls.target.set(

    mom.model.position.x,

    mom.model.position.y +
      1.25,

    mom.model.position.z

  );

  camera.position.add(

    new THREE.Vector3()
      .subVectors(

        controls.target,

        oldTarget

      )

  );

}

// ======================================================
// NPC FOLLOWING
// ======================================================

function updateFollower(
  character,
  sideOffset,
  backOffset,
  delta
) {

  if (
    gameMode !==
      "gameplay" ||
    !mom
  ) {

    return;

  }

  const playerForward =
    new THREE.Vector3(

      Math.sin(
        mom.model.rotation.y
      ),

      0,

      Math.cos(
        mom.model.rotation.y
      )

    );

  const playerRight =
    new THREE.Vector3(

      playerForward.z,

      0,

      -playerForward.x

    );

  const target =
    mom.model.position
      .clone()
      .addScaledVector(

        playerForward,

        -backOffset

      )
      .addScaledVector(

        playerRight,

        sideOffset

      );

  const distance =
    character.model.position
      .distanceTo(
        target
      );

  if (
    distance >
    2.2
  ) {

    moveCharacterToward(

      character,

      target,

      distance > 8
        ? 5.5
        : 3.4,

      delta

    );

  }

  else {

    character.play(
      "idle"
    );

    groundCharacter(
      character
    );

  }

}

// ======================================================
// INTERACTION
// ======================================================

function currentInteractionObject() {

  if (
    currentClue <
    clueObjects.length
  ) {

    return clueObjects[
      currentClue
    ];

  }

  if (
    currentClue >=
      clueObjects.length &&
    finalNoteObject
  ) {

    return finalNoteObject;

  }

  return null;

}

function updateInteraction() {

  if (
    gameMode !==
      "gameplay" ||
    clueWindowOpen
  ) {

    setPrompt("");

    return;

  }

  const object =
    currentInteractionObject();

  if (!object) {

    setPrompt("");

    return;

  }

  const distance =
    mom.model.position
      .distanceTo(
        object.position
      );

  if (
    distance <
    3.4
  ) {

    setPrompt(

      currentClue <
      clueObjects.length

        ? "[E] Read Clue"

        : "[E] Read Note"

    );

  }

  else {

    setPrompt("");

  }

}

function openClueWindow(
  title,
  text,
  final = false
) {

  clueWindowOpen =
    true;

  controls.enabled =
    false;

  clueCard.style.display =
    "flex";

  cluePaper.classList.toggle(

    "final-note",

    final

  );

  cluePaper.scrollTop = 0;

  clueTitle.textContent =
    title;

  clueText.textContent =
    text;

  clueHelp.textContent =

    final

      ? "Press Esc to close"

      : "Press E to continue";

}

function interact() {

  if (
    gameMode !==
    "gameplay"
  ) {

    return;

  }

  if (
    clueWindowOpen
  ) {

    if (
      currentClue <
      clueObjects.length
    ) {

      closeClue();

    }

    return;

  }

  const object =
    currentInteractionObject();

  if (!object) {

    return;

  }

  const distance =
    mom.model.position
      .distanceTo(
        object.position
      );

  if (
    distance >
    3.4
  ) {

    return;

  }

  if (
    currentClue <
    clueData.length
  ) {

    const clue =
      clueData[
        currentClue
      ];

    openClueWindow(

      clue.title,

      clue.text,

      false

    );

  }

  else {

    openClueWindow(

      FINAL_NOTE_TITLE,

      FINAL_NOTE_TEXT,

      true

    );

  }

}

function closeClue() {

  clueWindowOpen =
    false;

  controls.enabled =
    true;

  clueCard.style.display =
    "none";

  cluePaper.classList.remove(
    "final-note"
  );

  if (
    currentClue >=
    clueData.length
  ) {

    finalNoteRead =
      true;

    setObjective("");


    queueDialogue([

      {

        speaker:
          "Dad",

        text:
          "That was quite a journey."

      },

      {

        speaker:
          "Aneesh",

        text:
          "And we saved the best view for last."

      },

      {

        speaker:
          "Mom",

        text:
          "I don't think I'll forget this one."

      }

    ]);

    return;

  }

  const completedIndex =
    currentClue;

  currentClue++;

  const dialogues = [

    [

      {

        speaker:
          "Mom",

        text:
          "A clue. This walk just became much more interesting."

      },

      {

        speaker:
          "Dad",

        text:
          "Then let's see where it leads."

      }

    ],

    [

      {

        speaker:
          "Aneesh",

        text:
          "The lamp was the easy part. What's next?"

      },

      {

        speaker:
          "Mom",

        text:
          "Stone, apparently."

      }

    ],

    [

      {

        speaker:
          "Dad",

        text:
          "Behind the rock. Nicely hidden."

      },

      {

        speaker:
          "Mom",

        text:
          "And now we're looking for something green."

      }

    ],

    [

      {

        speaker:
          "Aneesh",

        text:
          "That shrub nearly got away with it."

      },

      {

        speaker:
          "Dad",

        text:
          "Apparently we're supposed to rest next."

      }

    ],

    [

      {

        speaker:
          "Mom",

        text:
          "Under the bench. Of course."

      },

      {

        speaker:
          "Dad",

        text:
          "Looks like the last path goes upward."

      },

      {

        speaker:
          "Aneesh",

        text:
          "Then up we go."

      }

    ]

  ];

  if (
    dialogues[
      completedIndex
    ]
  ) {

    queueDialogue(

      dialogues[
        completedIndex
      ]

    );

  }

  if (
    currentClue <
    clueData.length
  ) {

    setObjective(

      clueData[
        currentClue -
        1
      ].objective

    );

  }

  else {

    setObjective(
      "Reach the rocky summit."
    );

  }

}

function closeFinalNote() {

  if (
    !clueWindowOpen ||
    currentClue <
      clueData.length
  ) {

    return;

  }

  clueWindowOpen =
    false;

  controls.enabled =
    true;

  clueCard.style.display =
    "none";

  cluePaper.classList.remove(
    "final-note"
  );

  if (
    !finalNoteRead
  ) {

    finalNoteRead =
      true;

    setObjective("");

    triggerFinalFartSequence();

    queueDialogue([

      {

        speaker:
          "Dad",

        text:
          "That was quite a journey."

      },

      {

        speaker:
          "Aneesh",

        text:
          "And we saved the best view for last."

      },

      {

        speaker:
          "Mom",

        text:
          "I don't think I'll forget this one."

      }

    ]);

  }

}

// ======================================================
// FINAL AREA
// ======================================================

function updateFinalArea() {

  if (
    finalAreaTriggered ||
    currentClue <
      clueData.length ||
    !mom
  ) {

    return;

  }

  const distance =
    Math.hypot(

      mom.model.position.x -
        finalPoint.x,

      mom.model.position.z -
        finalPoint.z

    );

  if (
    distance <
    18
  ) {

    finalAreaTriggered =
      true;

    setObjective(
      "Read the final note."
    );

    queueDialogue([

      {

        speaker:
          "Dad",

        text:
          "Now that is a view."

      },

      {

        speaker:
          "Aneesh",

        text:
          "I think we found the last surprise."

      },

      {

        speaker:
          "Mom",

        text:
          "There's one more note."

      }

    ]);

  }

}

// ======================================================
// INPUT
// ======================================================

window.addEventListener(
  "keydown",
  event => {

    const key =
      event.key
        .toLowerCase();

    if (
      key === "w"
    ) {

      keys.w = true;

    }

    if (
      key === "a"
    ) {

      keys.a = true;

    }

    if (
      key === "s"
    ) {

      keys.s = true;

    }

    if (
      key === "d"
    ) {

      keys.d = true;

    }

    if (
      key === "shift"
    ) {

      keys.shift =
        true;

    }

    if (
      event.code ===
        "Space" &&
      grounded &&
      gameMode ===
        "gameplay" &&
      !clueWindowOpen
    ) {

      grounded = false;

      verticalVelocity =
        JUMP_FORCE;

    }

    if (
      key === "e"
    ) {

      interact();

    }

    if (
      event.key ===
      "Escape"
    ) {

      closeFinalNote();

    }

    // Developer coordinate checker.
    if (
      key === "p" &&
      mom
    ) {

      console.log(

        "PLAYER POSITION",

        {

          x:
            Number(
              mom.model.position.x
                .toFixed(2)
            ),

          y:
            Number(
              mom.model.position.y
                .toFixed(2)
            ),

          z:
            Number(
              mom.model.position.z
                .toFixed(2)
            )

        }

      );

    }

  }
);

window.addEventListener(
  "keyup",
  event => {

    const key =
      event.key
        .toLowerCase();

    if (
      key === "w"
    ) {

      keys.w = false;

    }

    if (
      key === "a"
    ) {

      keys.a = false;

    }

    if (
      key === "s"
    ) {

      keys.s = false;

    }

    if (
      key === "d"
    ) {

      keys.d = false;

    }

    if (
      key === "shift"
    ) {

      keys.shift =
        false;

    }

  }
);

// ======================================================
// INITIALIZATION
// ======================================================

async function init() {

  setObjective(
    "Loading..."
  );

  await buildTerrain();

  await Promise.all([

    buildDistantMountains(),

    loadWorldTemplates()

  ]);

  buildClueLocations();

  buildHandPlacedEnvironment();

  buildLandmarks();

  buildFinalArea();

  createNavigationMarker();

  createSnowMist();

  await loadCharacters();

  setObjective("");

  startOpeningCutscene();

}

// ======================================================
// LOOP
// ======================================================

const clock =
  new THREE.Clock();

function animate() {

  requestAnimationFrame(
    animate
  );

  const delta =
    Math.min(

      clock.getDelta(),

      .05

    );

  if (mom) {

    mom.update(
      delta
    );

  }

  if (dad) {

    dad.update(
      delta
    );

  }

  if (aneesh) {

    aneesh.update(
      delta
    );

  }

  if (
    gameMode ===
    "opening"
  ) {

    updateOpening(
      delta
    );

  }

  if (
    gameMode ===
    "gameplay"
  ) {

    updatePlayer(
      delta
    );

    updateFollower(

      dad,

      -2.1,

      4.2,

      delta

    );

    updateFollower(

      aneesh,

      2,

      5.3,

      delta

    );

    updateInteraction();

    updateFinalArea();

    updateNavigation(
      delta
    );

    updateBoundaryFog();

    controls.update();

  }

  updateSnow(
    delta
  );

  updateFartClouds(
  delta
 );

  updateDialogue();

  renderer.render(

    scene,

    camera

  );

}

animate();

// ======================================================
// RESIZE
// ======================================================

window.addEventListener(
  "resize",
  () => {

    camera.aspect =
      window.innerWidth /
      window.innerHeight;

    camera
      .updateProjectionMatrix();

    renderer.setSize(

      window.innerWidth,

      window.innerHeight

    );

  }
);

// ======================================================
// START
// ======================================================

init().catch(
  error => {

    console.error(

      "Game initialization failed:",

      error

    );

    setObjective(
      "Game failed to load. Check console."
    );

  }
);