//! This file provides functions to fetch data from the main Rainfusion
//! CDN provided by the .env file in the root directory of this project.
use crate::element::Element;
use wasm_bindgen::{prelude::*, JsCast};
use wasm_bindgen_futures::JsFuture;
use web_sys::{Request, RequestInit, RequestMode, Response};

/// Main Rainfusion Service
pub struct Rainfusion;

/// Implementation of the Rainfusion service.
impl Rainfusion {
    /// Fetch and handle errors and success with the given request.
    pub async fn fetch_request(request: Request, id: &'static str) -> Result<(), JsValue> {
        // Fetch using the built request.
        let window = web_sys::window().unwrap();
        let resp_value = JsFuture::from(window.fetch_with_request(&request)).await?;

        // `resp_value` is a `Response` object.
        assert!(resp_value.is_instance_of::<Response>());
        let resp: Response = resp_value.dyn_into().unwrap();

        // Check if the response was a success or not.
        if resp.ok() {
            // Convert this other `Promise` into a rust `Future`.
            let text = JsFuture::from(resp.text()?).await?;

            // Convert the JsValue into a string and set it as the body.
            let body = text.as_string().unwrap();
            Self::set_success(id, body);
        } else {
            // We must end the execution here since the request failed.
            Self::set_error(id);
        }

        Ok(())
    }

    /// Get rendered Mod HTML from CDN
    pub async fn rainfusion_html(filter: Option<&[String]>) -> Result<(), JsValue> {
        // Generate request options.
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

                // Form the request using the base64 filter string.
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

        // Fetch using the built request.
        Ok(Self::fetch_request(request, "#mods-root").await?)
    }

    /// Get rendered Launcher HTML from CDN
    #[cfg(not(feature = "compat"))]
    pub async fn rainfusion_launcher() -> Result<(), JsValue> {
        // Generate request options.
        let mut opts = RequestInit::new();
        opts.method("GET");
        opts.mode(RequestMode::Cors);

        // Build the request from options.
        let request =
            Request::new_with_str_and_init(&format!("{}/api/launcher", env!("CDN_IP")), &opts)?;

        // Fetch using the built request.
        Ok(Self::fetch_request(request, "#launcher-root").await?)
    }

    /// Generate an successful callback for fetching.
    pub fn set_success(element_id: &'static str, body: String) {
        // Get the element and set the inner to the JsValue.
        let mut element = Element::query(element_id).unwrap();
        element.set_inner_html(body);
    }

    /// Generate an error callback for fetching.
    pub fn set_error(element_id: &'static str) {
        // Get the element and set the inner to the JsValue.
        let mut element = Element::query(element_id).unwrap();
        element.set_inner_html(r#"<h1 class="ror-font-square text-center"> Server Sided Rendering Failure (404) </h1>"#.to_string());
    }
}
