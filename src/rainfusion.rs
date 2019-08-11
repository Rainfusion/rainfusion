//! This file provides functions to fetch data from the main Rainfusion
//! CDN provided by the .env file in the root directory of this project.
use crate::element::Element;
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

    /// Get rendered Mod HTML from CDN
    pub fn rainfusion_html(&self, filter: Option<&[String]>) -> Result<(), JsValue> {
        // Construct Request Options.
        let mut opts = RequestInit::new();
        opts.method("GET");
        opts.mode(RequestMode::Cors);

        // Check if we must filter the request.
        // Then construct the request for fetching.
        let request = match filter {
            Some(f) => {
                // Join the filter array.
                let joined_filter = f.join(";");

                // Convert the joined filter array into base64.
                let encoded_filter = base64::encode(&joined_filter);

                // Generate the request with the filtering added.
                Request::new_with_str_and_init(
                    &format!("{}/api/mods?sort={}", env!("CDN_IP"), encoded_filter),
                    &opts,
                )?
            }
            None => {
                // Generate the request without filtering.
                Request::new_with_str_and_init(&format!("{}/api/mods", env!("CDN_IP")), &opts)?
            }
        };

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

        // Generate callbacks.
        let ok_callback = self.generate_success_callback("#mods-root");
        let err_callback = self.generate_error_callback("#mods-root");

        // Handle Promise with callback.
        promise.then(&ok_callback).catch(&err_callback);

        // Forget the callbacks.
        ok_callback.forget();
        err_callback.forget();

        Ok(())
    }

    /// Get rendered Launcher HTML from CDN
    #[cfg(not(feature = "compat"))]
    pub fn rainfusion_launcher(&self) -> Result<(), JsValue> {
        // Construct Request Options.
        let mut opts = RequestInit::new();
        opts.method("GET");
        opts.mode(RequestMode::Cors);

        // Generate the request for the launcher.
        let request =
            Request::new_with_str_and_init(&format!("{}/api/launcher", env!("CDN_IP")), &opts)?;

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

        // Generate callbacks.
        let ok_callback = self.generate_success_callback("#launcher-root");
        let err_callback = self.generate_error_callback("#launcher-root");

        // Handle Promise with callback.
        promise.then(&ok_callback).catch(&err_callback);

        // Forget the callbacks.
        ok_callback.forget();
        err_callback.forget();

        Ok(())
    }

    /// Generate an successful callback for fetching.
    pub fn generate_success_callback(&self, element_id: &'static str) -> Closure<FnMut(JsValue)> {
        Closure::wrap(Box::new(move |x: JsValue| {
            // Get the element and set the inner to the JsValue.
            let mut element = Element::query(element_id).unwrap();
            element.set_inner_html(x.as_string().unwrap());
        }) as Box<FnMut(JsValue)>)
    }

    /// Generate an error callback for fetching.
    pub fn generate_error_callback(&self, element_id: &'static str) -> Closure<FnMut(JsValue)> {
        Closure::wrap(Box::new(move |_: JsValue| {
            // Get the element and set the inner to the JsValue.
            let mut element = Element::query(element_id).unwrap();
            element.set_inner_html(r#"<h1 class="ror-font-square text-center"> Server Sided Rendering Failure (404) </h1>"#.to_string());
        }) as Box<FnMut(JsValue)>)
    }
}
