/*
 * The Rainfusion Project
 * Copyright 2019 The Rainfusion Project
 * Licensed under GPL-3.0
 */

// Check if the browser even supports WebAssembly.
// Credit: https://stackoverflow.com/questions/47879864/how-can-i-check-if-a-browser-supports-webassembly/
const supported = (() => {
    if (typeof WebAssembly === "object"
        && typeof WebAssembly.instantiate === "function") {
        const module = new WebAssembly.Module(Uint8Array.of(0x0, 0x61, 0x73, 0x6d, 0x01, 0x00, 0x00, 0x00));
        if (module instanceof WebAssembly.Module)
            return new WebAssembly.Instance(module) instanceof WebAssembly.Instance;
    }

    return false;
})();

// If the browser doesnt support WASM display an error message.
if (supported) {
    // Initialize WASM module and catch any errors.
    import("./pkg/index.js").catch(console.error);
} else {
    // Get the mods root element and attach the error message.
    const element = document.getElementById("mods-root");
    const tags_container = document.getElementById("tags-div");
    tags_container.innerHTML = "";
    element.innerHTML = "<h1 class=\"ror-font-square ror-shadow-2 text-center\">Your browser does not support <b>WebAssembly</b> technologies.</h1> \
                         <h1 class=\"ror-font-square ror-shadow-1 text-center\">Please use a modern browser such as <b>Firefox, Chrome, Edge or Safari!</b></h1>"
}
