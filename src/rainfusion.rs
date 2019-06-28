//! This file provides functions to fetch data from the main Rainfusion
//! CDN provided by the .env file in the root directory of this project.
use futures::{future, Future};
use js_sys::{Error, Promise};
use wasm_bindgen::{prelude::*, JsCast};
use wasm_bindgen_futures::{future_to_promise, JsFuture};
use web_sys::{Document, Request, RequestInit, RequestMode, Response, Window};

/// Main Rainfusion Service
pub struct Rainfusion {
    pub window: Window,
    pub document: Document,
}

/// Implementation of the Rainfusion service.
impl Rainfusion {
    /// Create a new Rainfusion service.
    pub fn new() -> Self {
        let window = web_sys::window().unwrap();
        let document = window.document().unwrap();

        Self { window, document }
    }

    /// Get rendered HTML from CDN
    pub fn rainfusion_html(
        &self,
        ok_callback: Closure<FnMut(JsValue)>,
        err_callback: Closure<FnMut(JsValue)>,
    ) -> Result<(), JsValue> {
        // Construct Request Options.
        let mut opts = RequestInit::new();
        opts.method("GET");
        opts.mode(RequestMode::Cors);

        // Construct Request.
        let request =
            Request::new_with_str_and_init(&format!("{}/api/mods", env!("CDN_IP")), &opts)?;

        // Fetch using the request.
        let request_promise = self.window.fetch_with_request(&request);

        // Convert and Handle the future.
        let future = JsFuture::from(request_promise)
            .and_then(|resv| {
                // Convert into a response and grab text.
                let res: Response = resv.dyn_into()?;
                res.text()
            })
            .and_then(|textv: Promise| JsFuture::from(textv))
            .and_then(|text| {
                // Decode the response
                future::ok(text)
            })
            .map_err(|err| {
                let js_error = Error::new(&format!("{:?}", err));
                JsValue::from(js_error)
            });

        // Convert the Rust future to a JS promise.
        let promise = future_to_promise(future);

        // Handle Promise with callback.
        promise.then(&ok_callback).catch(&err_callback);

        // Forget the callbacks.
        ok_callback.forget();
        err_callback.forget();

        Ok(())
    }

    /// Modify the Launcher
    pub fn rainfusion_launcher(&self) -> Result<(), JsValue> {
        // Get Download Icon
        let launcher_download = self
            .document
            .get_element_by_id("launcher-download")
            .unwrap();
        launcher_download.set_attribute(
            "href",
            &format!("{}/launcher-download", env!("CDN_IP")),
        )?;

        // Get Submit Icon
        let launcher_submit = self.document.get_element_by_id("launcher-submit").unwrap();
        launcher_submit.set_attribute("href", env!("SUBMIT_URL"))?;

        // Get Docs Icon
        let launcher_docs = self.document.get_element_by_id("launcher-docs").unwrap();
        launcher_docs.set_attribute("href", env!("DOCS_URL"))?;

        // Get Update Icon
        let launcher_update = self.document.get_element_by_id("launcher-update").unwrap();
        launcher_update.set_attribute("href", env!("UPDATE_URL"))?;

        // Get Update Icon
        let launcher_discord = self.document.get_element_by_id("launcher-discord").unwrap();
        launcher_discord.set_attribute("href", env!("DISCORD_URL"))?;

        Ok(())
    }
}
