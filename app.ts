import RouteState from 'route-state';
import handleError from 'handle-error-web';
import { version } from './package.json';
import wireControls from './renderers/wire-controls';
import RandomId from '@jimkang/randomid';
import seedrandom from 'seedrandom';
import { createProbable as Probable } from 'probable';
import { renderBones } from './renderers/render-bones';
import { renderPhysicsDiagnostics } from './renderers/render-diagnostics';
import { UpdatePositions } from './updaters/update-positions';
import { SoulMaker } from './souls';
import { Soul, SoulSpot, SoulDefMap } from './types';
import { exampleBGMap } from './defs/maps/example-bg-map';
import { exampleGuysMap } from './defs/maps/example-guys-map';
import { ActionTicker } from './updaters/action-ticker';
import { TurnTicker } from './updaters/turn-ticker';

var randomId = RandomId();
var routeState;
// var prob: any;

(async function go() {
  window.onerror = reportTopLevelError;
  renderVersion();

  routeState = RouteState({
    followRoute,
    windowObject: window,
    propsToCoerceToBool: ['skullOnly', 'showBodyBounds'],
  });
  routeState.routeFromHash();
})();

async function followRoute({ seed, showBodyBounds = false }) {
  if (!seed) {
    routeState.addToRoute({ seed: randomId(8) });
    return;
  }

  var random = seedrandom(seed);
  var prob = Probable({ random });
  var { createSoulsInSpots } = SoulMaker({ seed });
  var { updatePositions, addSouls } = UpdatePositions({ fps: 60 });
  // var createMove = CreateMove({ seed });
  var actionTicker = ActionTicker({ cmdLengthSeconds: 1 });
  var turnTicker = TurnTicker({ addActionCommand: actionTicker.addCommand, prob });

  var souls: Soul[] = [];

  try {
    souls = souls.concat(await addSoulsFromMap(exampleBGMap));
    souls = souls.concat(await addSoulsFromMap(exampleGuysMap));
  } catch (error) {
    handleError(error);
  }

  wireControls({
    onReset: () => routeState.addToRoute({ seed: randomId(8) }),
    onBone,
  });

  loop();

  (async function doATurnIteration() {
    var robeGuy = souls.find((soul) => soul.kind === 'robed-one');
    var squirrels = souls.filter(
      (soul) => soul.kind === 'squirrel'
    );

    turnTicker.registerTurnTaker({
      callback: robeGuy.pickActions,
      params: { self: robeGuy },
      initiative: 0,
    });
    squirrels.forEach((squirrel, i) => turnTicker.registerTurnTaker({
      callback: squirrel.pickActions,
      params: { self: squirrel },
      initiative: i
    }));

    turnTicker.runTurn();
    // TODO: Should turnTicker just gather actions instead of having souls queue them directly?

    await actionTicker.runCommands({ existingSouls: souls });
    setTimeout(doATurnIteration, 3000);
  })();

  // // Test out move action.
  // (async function moveSquirrel() {
  //   //var squirrel = prob.pick(souls.filter((soul) => soul.kind === 'squirrel'));
  //   var squirrels = souls.filter(
  //     (soul) => soul.kind === 'squirrel' && prob.roll(2) === 0
  //   );
  //   var robeGuy = souls.find((soul) => soul.kind === 'robed-one');
  //   if (squirrels.length < 1) {
  //     return;
  //   }
  //   var move: Action = createMove({
  //     actors: squirrels,
  //     direction: { x: (prob.roll(3) - 1) * 8, y: (prob.roll(3) - 1) * 8 },
  //   });
  //   var moveRobeGuy: Action = createMove({
  //     actors: [robeGuy],
  //     direction: { x: 1, y: 1 },
  //   });

  //   actionTicker.addCommand({ cmd: move.cmd, initiative: 1 });
  //   actionTicker.addCommand({ cmd: moveRobeGuy.cmd, initiative: 1.5 });
  //   await actionTicker.runCommands({ existingSouls: souls });

  //   setTimeout(moveSquirrel, 2000);
  // })();

  function loop() {
    updatePositions();
    ['bg', 'guys'].forEach(renderSoulsOnLayer);
    if (showBodyBounds) {
      renderPhysicsDiagnostics({ souls });
    }
    requestAnimationFrame(loop);
  }

  function renderSoulsOnLayer(layer) {
    renderBones({
      souls: souls.filter((soul) => soul.layer === layer),
      depictionRootSelector: `#${layer}-root`,
    });
  }

  // Do we actually need to keep track of all of the bones we added?
  function onBone() {
    // addBones({ bones: [cloneDeep(prob.pick(flatSkeleton))] });
  }

  async function addSoulsFromMap(soulDefMap: SoulDefMap): Promise<Soul[]> {
    let initialSoulSpots: SoulSpot[] = await createSoulsInSpots(soulDefMap);
    console.log('Initial soul spots', initialSoulSpots);
    // It's not a good idea to hold onto initialSoulSpots because the souls
    // will move to other positions. Check soul.body for current posiions.
    addSouls({ soulSpots: initialSoulSpots });
    return initialSoulSpots.map((spot) => spot.soul);
  }
}

function reportTopLevelError(msg, url, lineNo, columnNo, error) {
  handleError(error);
}

function renderVersion() {
  var versionInfo = document.getElementById('version-info');
  versionInfo.textContent = version;
}
