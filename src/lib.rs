//! rainfusion
//!
//! The WASM frontend for the Rainfusion website.
//! This website uses WASM to load server sided rendered objects.
#![allow(dead_code)]

/// Main Rainfusion Service
mod rainfusion;
use rainfusion::Rainfusion;

/// Element Utility Functions
mod element;
use element::Element;

/// Main Tag Component
mod tags;
use tags::TagComponent;

use wasm_bindgen::prelude::*;

#[cfg(feature = "wee_alloc")]
#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

#[wasm_bindgen(start)]
pub async fn run() -> Result<(), JsValue> {
    #[cfg(debug_assertions)]
    console_error_panic_hook::set_once();

    // Modify Launcher
    #[cfg(not(feature = "compat"))]
    Rainfusion::rainfusion_launcher().await?;

    // Mod Loading Text
    let mut mod_element = Element::query("#mods-root").unwrap();
    mod_element
        .set_inner_html(r#"<h1 class="ror-font-square text-center"> Loading Mods </h1>"#.into());

    // Call for HTML from CDN
    Rainfusion::rainfusion_html(None).await?;

    // Create Tags Component
    let mut tags_component = TagComponent::new();
    tags_component.mount();

    Ok(())
}
