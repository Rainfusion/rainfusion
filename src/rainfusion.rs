//! This file provides functions to fetch data from the main Rainfusion
//! CDN provided by the .env file in the root directory of this project.
use dotenv_codegen::dotenv;
use futures::{future, Future};
use js_sys::Promise;
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
    pub fn rainfusion_html(&self, callback: Closure<FnMut(JsValue)>) -> Result<(), JsValue> {
        // Construct Request Options.
        let mut opts = RequestInit::new();
        opts.method("GET");
        opts.mode(RequestMode::Cors);

        // Construct Request.
        let request =
            Request::new_with_str_and_init(&format!("{}/api/mods", dotenv!("CDN_IP")), &opts)?;

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
                // Decode the response and convert it into a string.
                let decoded = base64::decode(&text.as_string().unwrap()).unwrap();
                let constructed = std::str::from_utf8(&decoded).unwrap();
                future::ok(JsValue::from(constructed.to_string()))
            });

        // Convert the Rust future to a JS promise.
        let promise = future_to_promise(future);

        // Handle Promise with callback.
        promise.then(&callback);

        // Forget the callback.
        callback.forget();

        Ok(())
    }
}
