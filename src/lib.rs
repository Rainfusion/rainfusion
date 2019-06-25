//! rainfusion
//! 
//! The WASM frontend for the Rainfusion website.
//! This website uses WASM to load server sided rendered objects.

/// Main Rainfusion Service
mod rainfusion;
use rainfusion::Rainfusion;

use wasm_bindgen::prelude::*;

#[cfg(feature = "wee_alloc")]
#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

#[wasm_bindgen(start)]
pub fn run() -> Result<(), JsValue> {
    #[cfg(debug_assertions)]
    console_error_panic_hook::set_once();

    // Setup Variables
    let window = web_sys::window().expect("Error finding window.");
    let rainfusion = Rainfusion::new();

    // Mod HTML Callback
    let mod_callback = Closure::wrap(Box::new(|x: JsValue| {
        // Get Window and Document
        let window = web_sys::window().expect("Error finding window");
        let document = window
            .document()
            .expect("Error finding document on the window");

        // Get mod element
        let mod_element = document.get_element_by_id("mods-root").unwrap();
        mod_element.set_inner_html(&x.as_string().unwrap());
    }) as Box<FnMut(JsValue)>);

    // Call for HTML from CDN
    rainfusion.rainfusion_html(mod_callback).unwrap();

    Ok(())
}