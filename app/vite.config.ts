import { defineConfig } from 'vite';
import { fileURLToPath } from 'node:url';
// CPU-only ONNX: one WASM backend works without WebGPU/COOP/COEP on GitHub Pages.
const ort=fileURLToPath(new URL('./node_modules/onnxruntime-web/dist/ort.wasm.bundle.min.mjs',import.meta.url));
export default defineConfig({base:'./', worker:{format:'es'}, resolve:{alias:[{find:/^onnxruntime-web(?:\/webgpu)?$/,replacement:ort}]}, build:{target:'es2022',rollupOptions:{input:['index.html','insights-check.html','insights-check-inner.html']}}, optimizeDeps:{exclude:['@imgly/background-removal']}});
