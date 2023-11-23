import * as SPLAT from '/gsplat.js'

const DEG2RAD = Math.PI / 180

const canvas = document.getElementById("canvas");
let referenceSpace = null

const enter = document.getElementById("enter");
enter.style.display = 'none'
enter.onclick = () => {
  onRequestSession()
}

const renderer = new SPLAT.WebGLRenderer(canvas)
const scene = new SPLAT.Scene()
const camera = new SPLAT.Camera()
const controls = new SPLAT.OrbitControls(camera, canvas)

async function main() {
  const url = 'test.splat'

  await SPLAT.Loader.LoadAsync(url, scene, null)

  const handleResize = () => {
    renderer.setSize(window.innerWidth, window.innerHeight)
  }

  scene.scale(new SPLAT.Vector3(0.2, 0.2, 0.2))
  const q = SPLAT.Quaternion.FromEuler(new SPLAT.Vector3(0, 0, 180 * DEG2RAD))
  scene.rotate(q)

  controls.update()
  renderer.prepareRender(scene, camera)
  renderer.sendCameraToWorker()
  renderer.clearRender()
  /*
  // renderer.render(canvas.width, canvas.height)
  const frame = () => {
   controls.update()
   renderer.prepareRender(scene, camera)
   renderer.sendCameraToWorker() 

   renderer.clearRender() 

   renderer.render(canvas.width, canvas.height)

    // requestAnimationFrame(frame)
  }
  */

  handleResize()
  window.addEventListener('resize', handleResize)

  //animFrameCallback = requestAnimationFrame(frame)

  enter.style.display = 'block'
}

const matrix4_invert = (matrixDst, matrixSrc) => {

  // based on http://www.euclideanspace.com/maths/algebra/matrix/functions/inverse/fourD/index.htm
  let te = matrixSrc,

    n11 = te[0], n21 = te[1], n31 = te[2], n41 = te[3],
    n12 = te[4], n22 = te[5], n32 = te[6], n42 = te[7],
    n13 = te[8], n23 = te[9], n33 = te[10], n43 = te[11],
    n14 = te[12], n24 = te[13], n34 = te[14], n44 = te[15],

    t11 = n23 * n34 * n42 - n24 * n33 * n42 + n24 * n32 * n43 - n22 * n34 * n43 - n23 * n32 * n44 + n22 * n33 * n44,
    t12 = n14 * n33 * n42 - n13 * n34 * n42 - n14 * n32 * n43 + n12 * n34 * n43 + n13 * n32 * n44 - n12 * n33 * n44,
    t13 = n13 * n24 * n42 - n14 * n23 * n42 + n14 * n22 * n43 - n12 * n24 * n43 - n13 * n22 * n44 + n12 * n23 * n44,
    t14 = n14 * n23 * n32 - n13 * n24 * n32 - n14 * n22 * n33 + n12 * n24 * n33 + n13 * n22 * n34 - n12 * n23 * n34

  const det = n11 * t11 + n21 * t12 + n31 * t13 + n41 * t14

  if (det === 0) return // this.set( 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 );

  const detInv = 1 / det

  te = matrixDst

  te[0] = t11 * detInv
  te[1] = (n24 * n33 * n41 - n23 * n34 * n41 - n24 * n31 * n43 + n21 * n34 * n43 + n23 * n31 * n44 - n21 * n33 * n44) * detInv
  te[2] = (n22 * n34 * n41 - n24 * n32 * n41 + n24 * n31 * n42 - n21 * n34 * n42 - n22 * n31 * n44 + n21 * n32 * n44) * detInv
  te[3] = (n23 * n32 * n41 - n22 * n33 * n41 - n23 * n31 * n42 + n21 * n33 * n42 + n22 * n31 * n43 - n21 * n32 * n43) * detInv

  te[4] = t12 * detInv
  te[5] = (n13 * n34 * n41 - n14 * n33 * n41 + n14 * n31 * n43 - n11 * n34 * n43 - n13 * n31 * n44 + n11 * n33 * n44) * detInv
  te[6] = (n14 * n32 * n41 - n12 * n34 * n41 - n14 * n31 * n42 + n11 * n34 * n42 + n12 * n31 * n44 - n11 * n32 * n44) * detInv
  te[7] = (n12 * n33 * n41 - n13 * n32 * n41 + n13 * n31 * n42 - n11 * n33 * n42 - n12 * n31 * n43 + n11 * n32 * n43) * detInv

  te[8] = t13 * detInv
  te[9] = (n14 * n23 * n41 - n13 * n24 * n41 - n14 * n21 * n43 + n11 * n24 * n43 + n13 * n21 * n44 - n11 * n23 * n44) * detInv
  te[10] = (n12 * n24 * n41 - n14 * n22 * n41 + n14 * n21 * n42 - n11 * n24 * n42 - n12 * n21 * n44 + n11 * n22 * n44) * detInv
  te[11] = (n13 * n22 * n41 - n12 * n23 * n41 - n13 * n21 * n42 + n11 * n23 * n42 + n12 * n21 * n43 - n11 * n22 * n43) * detInv

  te[12] = t14 * detInv
  te[13] = (n13 * n24 * n31 - n14 * n23 * n31 + n14 * n21 * n33 - n11 * n24 * n33 - n13 * n21 * n34 + n11 * n23 * n34) * detInv
  te[14] = (n14 * n22 * n31 - n12 * n24 * n31 - n14 * n21 * n32 + n11 * n24 * n32 + n12 * n21 * n34 - n11 * n22 * n34) * detInv
  te[15] = (n12 * n23 * n31 - n13 * n22 * n31 + n13 * n21 * n32 - n11 * n23 * n32 - n12 * n21 * n33 + n11 * n22 * n33) * detInv
}

const onRequestSession = () => {
  return navigator.xr.requestSession('immersive-vr').then(onSessionStarted);
}

const onSessionEnded = (event) => {
}

const onSessionStarted = (session) => {
  session.addEventListener('end', onSessionEnded)

  let nativeScale = XRWebGLLayer.getNativeFramebufferScaleFactor(session)
  console.log('nativeScale', nativeScale)

  renderer.gl.clearColor(0.0, 0.0, 0.0, 0.0)

  const baseLayer = new XRWebGLLayer(session, renderer.gl, {
    // alpha                  : false,
    // antialias              : false,
    // depth                  : false,
    // framebufferScaleFactor : 1.0,
    // ignoreDepthValues      : true,
    // stencil                : false,
  })

  // baseLayer.fixedFoveation = 1

  session.updateRenderState({
    baseLayer: baseLayer
  })

  //const max = 90
  //session.updateTargetFrameRate(max).then(() => console.debug('fps:', max))

  session.requestReferenceSpace('local').then((refSpace) => {
    referenceSpace = refSpace;
    session.requestAnimationFrame(onXRFrame)
  })
}

const onXRFrame = (t, frame) => {
  let session = frame.session

  session.requestAnimationFrame(onXRFrame)

  let pose = frame.getViewerPose(referenceSpace)

  if (pose) {
    const gl = renderer.gl
    let layer = session.renderState.baseLayer

    if (layer.colorTexture) {
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, layer.colorTexture, 0);
    }
    if (layer.depthStencilTexture) {
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.TEXTURE_2D, layer.depthStencilTexture, 0);
    }

    gl.bindFramebuffer(gl.FRAMEBUFFER, layer.framebuffer);

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    let first = true
    for (const view of pose.views) {
      const viewport = layer.getViewport(view)
      renderer.gl.viewport(viewport.x, viewport.y, viewport.width, viewport.height)
      for (let i = 0; i < 16; i++) {
        camera.projectionMatrix.buffer[i] = view.projectionMatrix[i]
      }

      camera.fx = (camera.projectionMatrix.buffer[0] / 2) * viewport.width
      camera.fy = (camera.projectionMatrix.buffer[5] / -2) * viewport.height

      matrix4_invert(camera.viewMatrix.buffer, view.transform.matrix)

      camera.viewProj = camera.projectionMatrix.multiply(camera.viewMatrix);
      if (first) {
        first = false
        renderer.sendCameraToWorker()
      }
      renderer.render(viewport.width, viewport.height)

    }
  } else {

  }
}

main()
