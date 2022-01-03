Simple WebGL demo with Free Pascal + WebAssembly target.

For building wasm, execute `fpc -Twasi -Pwasm32 -MObjFPC -oapp.wasm app.pas`

For running, use a server to serve the files (for example `python -m http.server`).

![image](https://user-images.githubusercontent.com/7451778/147938574-d36b7035-8d2b-4cdf-bcea-467e16719f5b.png)
