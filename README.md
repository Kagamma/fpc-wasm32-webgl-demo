Simple WebGL demo with Free Pascal + WebAssembly target.

For building wasm, execute `fpc -Twasi -Pwasm32 -MObjFPC -oapp.wasm app.pas`

For running, use a server to serve the files (for example `python -m http.server`), the wasm result after opening `index.html` will be available in web browser's console.
