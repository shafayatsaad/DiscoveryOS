"use client";

// Purpose: Render the Stitch WebGL-style animated research network background.

import { useEffect, useRef } from "react";

export function ShaderBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    const gl = canvas.getContext("webgl") ?? canvas.getContext("experimental-webgl");
    if (!gl || !("viewport" in gl)) {
      return;
    }

    const webgl = gl as WebGLRenderingContext;
    let frameId = 0;
    let disposed = false;

    const syncSize = () => {
      const width = canvas.clientWidth || 1280;
      const height = canvas.clientHeight || 720;
      const scale = Math.min(window.devicePixelRatio || 1, 2);
      const nextWidth = Math.floor(width * scale);
      const nextHeight = Math.floor(height * scale);

      if (canvas.width !== nextWidth || canvas.height !== nextHeight) {
        canvas.width = nextWidth;
        canvas.height = nextHeight;
      }
    };

    const vertexShaderSource = `
      attribute vec2 a_position;
      varying vec2 v_texCoord;

      void main() {
        v_texCoord = a_position * 0.5 + 0.5;
        gl_Position = vec4(a_position, 0.0, 1.0);
      }
    `;

    const fragmentShaderSource = `
      precision highp float;
      varying vec2 v_texCoord;
      uniform float u_time;
      uniform vec2 u_resolution;

      float nodeField(vec2 uv, float t) {
        float n = 0.0;
        vec2 grid = fract(uv * 8.0) - 0.5;
        vec2 id = floor(uv * 8.0);

        for(int y = -1; y <= 1; y++) {
          for(int x = -1; x <= 1; x++) {
            vec2 offs = vec2(float(x), float(y));
            vec2 p = offs + sin(t + (id + offs) * 123.45) * 0.38;
            float dist = length(grid - p);
            n += smoothstep(0.024, 0.01, dist) * 0.45;
          }
        }

        return n;
      }

      void main() {
        vec2 uv = v_texCoord;
        vec3 base = vec3(0.02, 0.03, 0.05);
        vec3 tint = vec3(0.04, 0.06, 0.11);
        float t = u_time * 0.25;
        float n = nodeField(uv + sin(t * 0.4) * 0.08, t);
        float vignette = smoothstep(0.96, 0.16, distance(uv, vec2(0.5, 0.5)));
        vec3 color = mix(base, tint, uv.y + n * 0.12);
        color += n * mix(vec3(0.3, 0.55, 1.0), vec3(0.62, 0.45, 0.98), uv.x) * 0.34;
        color *= vignette;
        gl_FragColor = vec4(color, 1.0);
      }
    `;

    const createShader = (type: number, source: string) => {
      const shader = webgl.createShader(type);
      if (!shader) {
        return null;
      }

      webgl.shaderSource(shader, source);
      webgl.compileShader(shader);
      return shader;
    };

    const vertexShader = createShader(webgl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = createShader(webgl.FRAGMENT_SHADER, fragmentShaderSource);
    const program = webgl.createProgram();

    if (!vertexShader || !fragmentShader || !program) {
      return;
    }

    webgl.attachShader(program, vertexShader);
    webgl.attachShader(program, fragmentShader);
    webgl.linkProgram(program);
    webgl.useProgram(program);

    const buffer = webgl.createBuffer();
    webgl.bindBuffer(webgl.ARRAY_BUFFER, buffer);
    webgl.bufferData(
      webgl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
      webgl.STATIC_DRAW,
    );

    const position = webgl.getAttribLocation(program, "a_position");
    webgl.enableVertexAttribArray(position);
    webgl.vertexAttribPointer(position, 2, webgl.FLOAT, false, 0, 0);

    const timeUniform = webgl.getUniformLocation(program, "u_time");
    const resolutionUniform = webgl.getUniformLocation(program, "u_resolution");
    const observer = new ResizeObserver(syncSize);
    observer.observe(canvas);
    syncSize();

    const render = (time: number) => {
      if (disposed) {
        return;
      }

      syncSize();
      webgl.viewport(0, 0, canvas.width, canvas.height);
      if (timeUniform) {
        webgl.uniform1f(timeUniform, time * 0.001);
      }
      if (resolutionUniform) {
        webgl.uniform2f(resolutionUniform, canvas.width, canvas.height);
      }
      webgl.drawArrays(webgl.TRIANGLE_STRIP, 0, 4);
      frameId = requestAnimationFrame(render);
    };

    frameId = requestAnimationFrame(render);

    return () => {
      disposed = true;
      cancelAnimationFrame(frameId);
      observer.disconnect();
      webgl.deleteProgram(program);
      webgl.deleteShader(vertexShader);
      webgl.deleteShader(fragmentShader);
      if (buffer) {
        webgl.deleteBuffer(buffer);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="absolute inset-0 h-full w-full opacity-70"
    />
  );
}

