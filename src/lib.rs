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
    let document = window
        .document()
        .expect("Error finding document on the window");
    let rainfusion = Rainfusion::new();

    // Mod HTML Callbacks
    let ok_mod_callback = Closure::wrap(Box::new(|x: JsValue| {
        // Get Window and Document
        let window = web_sys::window().expect("Error finding window");
        let document = window
            .document()
            .expect("Error finding document on the window");

        // Get mod element
        let mod_element = document.get_element_by_id("mods-root").unwrap();
        mod_element.set_inner_html(&x.as_string().unwrap());
    }) as Box<FnMut(JsValue)>);

    let err_mod_callback = Closure::wrap(Box::new(|_| {
        // Get Window and Document
        let window = web_sys::window().expect("Error finding window");
        let document = window
            .document()
            .expect("Error finding document on the window");

        // Get mod element
        let mod_element = document.get_element_by_id("mods-root").unwrap();
        mod_element.set_inner_html(r#"<h1 class="ror-font-square text-center"> Server Sided Rendering Failure (404) </h1>"#);
    }) as Box<FnMut(JsValue)>);

    // Modify Launcher
    rainfusion.rainfusion_launcher()?;

    // Mod Loading Text
    let mod_element = document.get_element_by_id("mods-root").unwrap();
    mod_element.set_inner_html(r#"<h1 class="ror-font-square text-center"> Loading Mods </h1>"#);

    // Call for HTML from CDN
    rainfusion.rainfusion_html(None, ok_mod_callback, err_mod_callback)?;

    Ok(())
}
