import RouteState from 'route-state';
import handleError from 'handle-error-web';
import { version } from './package.json';
import wireControls from './renderers/wire-controls';
// import seedrandom from 'seedrandom';
import RandomId from '@jimkang/randomid';
// import { createProbable as Probable } from 'probable';
import { renderBones } from './renderers/render-bones';
import { renderPhysicsDiagnostics } from './renderers/render-diagnostics';
import { UpdatePositions } from './updaters/update-positions';
import { SoulMaker } from './souls';
import { Soul, SoulSpot, SoulDefMap } from './types';
import { exampleBGMap } from './defs/maps/example-bg-map';
import { exampleGuysMap } from './defs/maps/example-guys-map';

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

  // var random = seedrandom(seed);
  // prob = Probable({ random });
  var { createSoulsInSpots } = SoulMaker({ seed });
  var { updatePositions, addSouls } = UpdatePositions({});

  var souls: Soul[] = [];

  try {
    souls = souls.concat(await addSoulsFromMap(exampleBGMap));
    //souls = souls.concat(await addSoulsFromMap(exampleGuysMap));
  } catch (error) {
    handleError(error);
  }

  wireControls({
    onReset: () => routeState.addToRoute({ seed: randomId(8) }),
    onBone,
  });

  loop();

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
