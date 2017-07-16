class Orientator {
  constructor() {
    if (!window.DeviceOrientationEvent) {
      return false;
    }

    window.addEventListener(
      'deviceorientation',
      event => {
        console.log(event);
        if (event.absolute) {
          alert('This device uses absolute orientation..');
        }
        // LAY FLAT ON TABLE
        // event.alpha Z - left right spin turn (0 north at top of device)
        // event.beta  X - front back lift
        // event.gamma Y - left right lift
        // See: https://developer.mozilla.org/en-US/docs/Web/Guide/Events/Orientation_and_motion_data_explained
        document.getElementById('alpha').innerHTML = Math.round(event.alpha * 10) / 10 + ' °';
        document.getElementById('beta').innerHTML = Math.round(event.beta * 10) / 10 + ' °';
        document.getElementById('gamma').innerHTML = Math.round(event.gamma * 10) / 10 + ' °';

        box.setRotation({
          x: -event.beta / 360 * Math.PI * 2,
          y: -event.gamma / 360 * Math.PI * 2,
          z: -event.alpha / 360 * Math.PI * 2
        });
        renderer.render(scene, camera);
      },
      false
    );

    window.addEventListener('devicemotion', event => {
      [
        {
          name: 'acceleration',
          event: event.acceleration,
          unit: ' '
        },
        {
          name: 'accelerationIncludingGravity',
          event: event.accelerationIncludingGravity,
          unit: ' '
        },
        {
          name: 'rotationRate',
          event: event.rotationRate,
          unit: ' °/s'
        }
      ].forEach(motion => {
        // e.g. x, y, z, alpha, beta, gamma
        for (let direction in motion.event) {
          if (document.getElementById(motion.name + '-' + direction)) {
            document.getElementById(motion.name + '-' + direction).innerHTML =
              Math.round(motion.event[direction] * 10) / 10 + motion.unit;
          }
        }
      });
    });
  }
}

class Box {
  constructor() {
    this.geometry = new THREE.BoxGeometry(700, 700, 700, 30, 30, 30);
    this.material = new THREE.MeshBasicMaterial({ color: 0xfff00, wireframe: true });
    this.cube = new THREE.Mesh(this.geometry, this.material);
    scene.add(this.cube);
  }

  setRotation(rotation) {
    this.cube.rotation.x = rotation.x;
    this.cube.rotation.y = rotation.y;
    this.cube.rotation.z = rotation.z;
  }
}

// Create Three.js scene and renderer
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 10000);
var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
camera.position.z = 1000;

// Create objects
const box = new Box();
const orientator = new Orientator();

renderer.render(scene, camera);
