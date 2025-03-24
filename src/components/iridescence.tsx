import { debounce } from "@/utils/kit";
import { HeartIcon } from "@heroicons/react/24/solid";
import { Renderer, Program, Mesh, Color, Triangle } from "ogl";
import { useEffect, useRef } from "react";

const vertexShader = `
attribute vec2 uv;
attribute vec2 position;

varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = vec4(position, 0, 1);
}
`;

const fragmentShader = `
precision highp float;

uniform float uTime;
uniform vec3 uColor;
uniform vec3 uResolution;
uniform vec2 uMouse;
uniform float uAmplitude;
uniform float uSpeed;

varying vec2 vUv;

void main() {
  float mr = min(uResolution.x, uResolution.y);
  vec2 uv = (vUv.xy * 2.0 - 1.0) * uResolution.xy / mr;

  // Add a subtle offset based on the mouse position
  uv += (uMouse - vec2(0.5)) * uAmplitude;

  float d = -uTime * 0.5 * uSpeed;
  float a = 0.0;
  for (float i = 0.0; i < 8.0; ++i) {
    a += cos(i - d - a * uv.x);
    d += sin(uv.y * i + a);
  }
  d += uTime * 0.5 * uSpeed;
  vec3 col = vec3(cos(uv * vec2(d, a)) * 0.6 + 0.4, cos(a + d) * 0.5 + 0.5);
  col = cos(col * cos(vec3(d, a, 2.5)) * 0.5 + 0.5) * uColor;
  gl_FragColor = vec4(col, 1.0);
}
`;

export const Iridescence = ({
    color = [1, 1, 1],
    speed = 1.0,
    amplitude = 0.1,
    mouseReact = true,
    width = 0,
    username = '',
    ...rest
}) => {
    const observer = useRef<ResizeObserver>(null)
    const ctnDom = useRef<HTMLDivElement>(null)
    const mousePos = useRef({ x: 0.5, y: 0.5 })

    useEffect(() => {
        if (!ctnDom.current) return;
        const ctn = ctnDom.current;
        const renderer = new Renderer();
        const gl = renderer.gl;
        gl.clearColor(1, 1, 1, 1);

        let program: Program;

        function resize() {
            const scale = 1;
            renderer.setSize(ctn.offsetWidth * scale, ctn.offsetHeight * scale);
            if (program) {
                program.uniforms.uResolution.value = new Color(
                    gl.canvas.width,
                    gl.canvas.height,
                    gl.canvas.width / gl.canvas.height
                );
            }
        }

        const debouncedResize = debounce(resize, 100)

        observer.current = new ResizeObserver(entries => {
            for (let entry of entries) {
                if (entry.target === ctnDom.current) {
                    debouncedResize()
                }
            }
        })
        observer.current.observe(ctnDom.current)
        resize();

        const geometry = new Triangle(gl);
        program = new Program(gl, {
            vertex: vertexShader,
            fragment: fragmentShader,
            uniforms: {
                uTime: { value: 0 },
                uColor: { value: new Color(...color) },
                uResolution: {
                    value: new Color(
                        gl.canvas.width,
                        gl.canvas.height,
                        gl.canvas.width / gl.canvas.height
                    ),
                },
                uMouse: { value: new Float32Array([mousePos.current.x, mousePos.current.y]) },
                uAmplitude: { value: amplitude },
                uSpeed: { value: speed },
            },
        });

        const mesh = new Mesh(gl, { geometry, program });
        let animateId: number;

        function update(t: any) {
            animateId = requestAnimationFrame(update);
            program.uniforms.uTime.value = t * 0.001;
            renderer.render({ scene: mesh });
        }
        animateId = requestAnimationFrame(update);
        ctn.appendChild(gl.canvas);

        function handleMouseMove(e: any) {
            const rect = ctn.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width;
            const y = 1.0 - (e.clientY - rect.top) / rect.height;
            mousePos.current = { x, y };
            program.uniforms.uMouse.value[0] = x;
            program.uniforms.uMouse.value[1] = y;
        }
        if (mouseReact) {
            ctn.addEventListener("mousemove", handleMouseMove);
        }

        return () => {
            cancelAnimationFrame(animateId);
            if (mouseReact) {
                ctn.removeEventListener("mousemove", handleMouseMove);
            }
            ctn.removeChild(gl.canvas);
            gl.getExtension("WEBGL_lose_context")?.loseContext();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [color, speed, amplitude, mouseReact]);

    return (
        <div
            ref={ctnDom}
            className="station relative w-full h-full rounded-md hover:scale-105 transition-all duration-300 cursor-pointer aspect-square"
            style={{
                width: `${width}px`,
                height: `${width}px`
            }}
            {...rest}
        >
            <div className={`p-3 max-w-full w-fit`}>

                <div className={`rounded-md tilted-card-demo-text backdrop-blur-md bg-black/30`}>
                    <div className="flex items-center gap-2 truncate ..."><HeartIcon className="size-4" />{`${username}'s Station`}</div>
                </div>
            </div>
            {/* <div className="absolute w-full left-0 bottom-0 h-[20%] backdrop-blur-md flex items-center justify-center">
                <span className="text-white text-2xl">test</span>
            </div> */}
        </div>
    );
}