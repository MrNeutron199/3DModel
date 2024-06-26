import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { GUI } from "lil-gui";
import { DRACOLoader } from "three/addons/loaders/DRACOLoader.js";
export default function App() {
  const container = document.body;
  const renderer = new THREE.WebGLRenderer();
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1;

  renderer.setSize(window.innerWidth, window.innerHeight);
  container.appendChild(renderer.domElement);
  // const pmremGenerator = new THREE.PMREMGenerator(renderer);
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x000000);
  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    100
  );
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enablePan = false;
  controls.enableDamping = true;
  controls.dampingFactor = 0.12;
  controls.mouseButtons = {
    LEFT: THREE.MOUSE.ROTATE,
    MIDDLE: null,
    RIGHT: THREE.MOUSE.ROTATE,
  };
  controls.maxPolarAngle = THREE.MathUtils.degToRad(70);
  controls.target.set(0, 0, 0);
  controls.maxDistance = 6.3;
  controls.minDistance = 6.5;
  const loader = new GLTFLoader().setPath("/models/");
  const dracoLoader = new DRACOLoader();
  loader.setDRACOLoader(dracoLoader);
  dracoLoader.setDecoderPath("/draco/");
  let mixer;
  loader.load(
    "LittlestTokyo.glb",
    async function (gltf) {
      const model = gltf.scene;
      await renderer.compileAsync(model, camera, scene);
      model.position.set(-0.2, 1.3, -0.3);
      model.scale.set(0.01, 0.01, 0.01);
      mixer = new THREE.AnimationMixer(model);
      mixer.clipAction(gltf.animations[0]).play();
      model.traverse(function (object) {
        if (object.isMesh) object.castShadow = true;
      });
      scene.add(model);
      model.name = "Little Shop";
      setTimeout(() => {
        console.log(scene.children);
      }, 5000);
      model.rotation.y = 1.99;
    },
    undefined,
    function (e) {
      console.error(e);
    }
  );

  scene.background = new THREE.Color(0x000000);
  // scene.environment = pmremGenerator.fromScene(
  //   new RoomEnvironment(renderer),
  //   0.04
  // ).texture;
  // scene.fog = new THREE.Fog(0xa0a0a0, 10, 50);
  //Hemisphere Light
  const spotLight = new THREE.SpotLight(0xffffff, 100);
  spotLight.position.set(-5, 8, 5);
  spotLight.angle = Math.PI / 6;
  spotLight.intensity = 180;
  spotLight.penumbra = 0.5;
  spotLight.decay = 1.99;
  spotLight.distance = 90;
  spotLight.castShadow = true;
  spotLight.shadow.camera.near = 1;
  spotLight.shadow.camera.far = 10;
  spotLight.shadow.focus = 1;
  scene.add(spotLight);

  // scene.add(new THREE.SpotLightHelper(spotLight));
  // const gui = new GUI();
  const pointLight1 = new THREE.PointLight(0xffffff, 3, 10);
  // const helper = new THREE.PointLightHelper(pointLight1);
  // scene.add(helper);
  pointLight1.position.set(-1.5, 2, -3);
  pointLight1.castShadow = false;
  pointLight1.intensity = 5;
  scene.add(pointLight1);
  // let settings = {
  //   // X: 0,
  //   // Y: 0,
  //   // Z: 0,
  //   // intensity: 1,
  //   animations: true,
  //   // power: 1,
  // };

  const pointLight2 = new THREE.PointLight(0xffffff, 3, 10);
  // const helper = new THREE.PointLightHelper(pointLight);
  // scene.add(helper);
  pointLight2.position.set(4, 3, 3);
  pointLight2.castShadow = false;
  pointLight2.intensity = 5;
  scene.add(pointLight2);

  const pointLight3 = new THREE.PointLight(0xffffff, 3, 10);
  // const helper = new THREE.PointLightHelper(pointLight3);
  // scene.add(helper);
  pointLight3.position.set(2, 2, -1);
  pointLight3.castShadow = false;
  pointLight3.intensity = 5;
  scene.add(pointLight3);

  // const folder1 = gui.addFolder("Coordinates");
  // const folder2 = gui.addFolder("Visual settings");
  // folder2.add(settings, "animations").onChange(function (val) {
  //   if (mixer.isRunning()) {
  //     mixer.stop();
  //   } else {
  //     // mixer.clipAction(scene.children[3]).play();
  //     console.log("Want to play");
  //   }
  // });
  // folder2.add(settings, "power").onChange(function (val) {
  //   pointLight.power = val;
  // });
  // folder2.add(settings, "left").onChange(function (val) {
  //   dirLight.shadow.camera.left = val;
  // });
  // folder2.add(settings, "right").onChange(function (val) {
  //   dirLight.shadow.camera.right = val;
  // });
  // folder2.add(settings, "near").onChange(function (val) {
  //   dirLight.shadow.camera.near = val;
  // });
  // folder2.add(settings, "far").onChange(function (val) {
  //   dirLight.shadow.camera.far = val;
  // });

  const clock = new THREE.Clock();
  const mesh = new THREE.Mesh(
    new THREE.PlaneGeometry(10, 10),
    new THREE.MeshPhongMaterial({ color: 0xcbcbcb, depthWrite: false })
  );
  mesh.rotation.x = -Math.PI / 2;
  mesh.receiveShadow = true;
  mesh.position.y = -0.6;
  scene.add(mesh);

  // scene.add(new THREE.DirectionalLightHelper(dirLight));
  //   const quarternion = new THREE.Quaternion().setFromAxisAngle(
  //     new THREE.Vector3(settings.X, settings.Y, settings.Z).normalize(),
  //     0.01
  //   );
  //   camera.position.applyQuaternion(quarternion);

  // gui.open();
  camera.position.set(-3, 3, 9);
  window.addEventListener("resize", onWindowResize);
  function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
  }

  function animate() {
    requestAnimationFrame(animate);
    controls.update();
    const delta = clock.getDelta();
    if (mixer) mixer.update(delta);
    renderer.render(scene, camera);
  }
  animate();
}
