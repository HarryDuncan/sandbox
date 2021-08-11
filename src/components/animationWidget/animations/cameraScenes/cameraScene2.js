import * as THREE from "three";
import {fragmentShader} from './shader/fragmentShader'
import {vertexShader} from './shader/vertexShader' 




export function CameraScene1(framework){

    let particles, videoWidth, videoHeight, imageCache;

    const particleIndexArray = [];




    // audio
    let audio, analyser;
    const fftSize = 2048; 


    let uniforms = {
        time: {
            type: 'f',
            value: 0.0
        },
        size: {
            type: 'f',
            value: 10.0
        }
    };
    //Scene 
    let scene = new THREE.Scene();
    scene.background = new THREE.Color(0x170708);
    // Camera
    let camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 10000);
    camera.position.set(0, 0, 900);
    camera.lookAt(0, 0, 0);

    scene.add(camera);


    /************************************
            SETS UP VIDEO 
    ***********************************/
    framework.video = document.getElementById("video");

    framework.video.autoplay = true;

    const option = {
        video: true,
        audio: false
    };
    navigator.mediaDevices.getUserMedia(option)
        .then((stream) => {
            framework.video.srcObject = stream;
            framework.video.addEventListener("loadeddata", () => {
                videoWidth = framework.video.videoWidth;
                videoHeight = framework.video.videoHeight;

                createParticles();
            });
        })
        .catch((error) => {
            
            showAlert();
        });

          const getImageData = (image, useCache, framework, imageCache) => {
                if (useCache && imageCache) {
                    return imageCache;
                }

                const w = image.videoWidth;
                const h = image.videoHeight;
               

                framework.canvas.width = w;
                framework.canvas.height = h;

                framework.ctx.translate(w, 0);
                framework.ctx.scale(-1, 1);

                framework.ctx.drawImage(image, 0, 0);

                return framework.ctx.getImageData(0, 0, w, h);

            };

             //  from https://stackoverflow.com/a/5624139
            const hexToRgb = (hex) => {
                let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
                return {
                    r: parseInt(result[1], 16) / 255,
                    g: parseInt(result[2], 16) / 255,
                    b: parseInt(result[3], 16) / 255
                };
            };
      /************************************
            CREATES PARTICLES
         ***********************************/
            const createParticles = () => {
                const imageData = getImageData(framework.video, false, framework, imageCache);
                const geometry = new THREE.BufferGeometry();
                const material = new THREE.ShaderMaterial({
                    uniforms: uniforms,
                    vertexShader: vertexShader,
                    fragmentShader: fragmentShader,
                    transparent: true,
                    depthWrite: false,
                    blending: THREE.AdditiveBlending
                });

                const vertices = [];
                const colors = [];

                let colorsPerFace = [
                   "#16e36d", "#ff4b78",  "#162cf8", "#2016e3"
                ];
                let width = window.innerWidth
                let height = window.innerHeight


                let count = 0;
                const step = 3;
                for (let y = 0, height = imageData.height; y < height; y += step) {
                    for (let x = 0, width = imageData.width; x < width; x += step) {
                        // let index = (count) * 4 * step;
                        let index = (x + y * width) * 4;
                        particleIndexArray.push(index);

                        let gray = (imageData.data[index] + imageData.data[index + 1] + imageData.data[index + 2]) / 3;
                        let z = gray < 300 ? gray : 10000;

                        vertices.push(
                            x - imageData.width / 2,
                            -y + imageData.height / 2,
                            z
                        );

                        const rgbColor = hexToRgb(colorsPerFace[Math.floor(Math.random() * colorsPerFace.length)]);
                        colors.push(rgbColor.r, rgbColor.g, rgbColor.b);

                        count++;
                    }
                }

                const verticesArray = new Float32Array(vertices);
                geometry.addAttribute('position', new THREE.BufferAttribute(verticesArray, 3));

                const colorsArray = new Float32Array(colors);
                geometry.addAttribute('color', new THREE.BufferAttribute(colorsArray, 3));

                particles = new THREE.Points(geometry, material);
                scene.add(particles);
            };

   

    let cameraScene1 = {
        scene: scene,
        camera: camera,
        tag : 'generic',
        responsive : true,
        changeVisuals : false,
        onUpdate : (framework) => {

            /*****************************
                GETS IMAGE DATA FROM VID
            ****************************/

          


           



            /**
             * https://github.com/processing/p5.js-sound/blob/v0.14/lib/p5.sound.js#L1765
             *
             * @param data
             * @param _frequencyRange
             * @returns {number} 0.0 ~ 1.0
             */
            const getFrequencyRangeValue = (data, _frequencyRange) => {
                const nyquist = 48000 / 2;
                const lowIndex = Math.round(_frequencyRange[0] / nyquist * data.length);
                const highIndex = Math.round(_frequencyRange[1] / nyquist * data.length);
                let total = 0;
                let numFrequencies = 0;

                for (let i = lowIndex; i <= highIndex; i++) {
                    total += data[i];
                    numFrequencies += 1;
                }
                return total / numFrequencies / 255;
            };






            /******************************
            PERFORMS THE ON UPDATE
            *******************************/
            framework.clock.getDelta();
            const time = framework.clock.elapsedTime;

            uniforms.time.value += 0.5;

            let r, g, b;

            // audio
            if (framework.analyser) {
                // analyser.getFrequencyData() would be an array with a size of half of fftSize.
                const data = framework.analyser.getFrequencyData();

                const bass = getFrequencyRangeValue(data, framework.frequencyRange.bass);
                const mid = getFrequencyRangeValue(data, framework.frequencyRange.mid);
                const treble = getFrequencyRangeValue(data, framework.frequencyRange.treble);

                r = bass;
                g = mid;
                b = treble;
            }

            
            // video
            if (particles) {
                let useCache = parseInt(time) % 2 === 0;  // To reduce CPU usage.
                let imageData = getImageData(framework.video, useCache, framework);
                
                let count = 0;

                for (let i = 0, length = particles.geometry.attributes.position.array.length; i < length; i += 3) {

                    let index = particleIndexArray[count];
                    let gray = (imageData.data[index] + imageData.data[index + 1] + imageData.data[index + 2]) / 3;
                    let threshold = 300;
                    if (gray < threshold) {
                        if (gray < threshold / 3) {
                            particles.geometry.attributes.position.array[i + 2] = gray * r * 5;

                        } else if (gray < threshold / 2) {
                            particles.geometry.attributes.position.array[i + 2] = gray * g * 6;

                        } else {
                            particles.geometry.attributes.position.array[i + 2] = gray * b * 5;
                        }
                    } else {
                        particles.geometry.attributes.position.array[i + 2] = 10000;
                    }

                    count++;
                    }

                    uniforms.size.value = (r + g + b) / 3 * 5 + 5;

                    particles.geometry.attributes.position.needsUpdate = true;
                }

               

                
                }
            }

    return cameraScene1
};



//
export const showAlert = () => {
    document.getElementById("message").classList.remove("hidden");
};

// const onResize = () => {
//     width = window.innerWidth;
//     height = window.innerHeight;

//     renderer.setPixelRatio(window.devicePixelRatio);
//     renderer.setSize(width, height);

//     camera.aspect = width / height;
//     camera.updateProjectionMatrix();
// };

