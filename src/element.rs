//! Element Utility Functions
use wasm_bindgen::{prelude::*, JsCast};
use web_sys::{Event, EventTarget, HtmlInputElement, Node};

/// Wrapper for `web_sys::Element` to simplify calling different interfaces
#[derive(Clone)]
pub struct Element {
    el: web_sys::Element,
}

impl Element {
    // Create an element from a tag name
    pub fn create_element(tag: &str) -> Result<Element, JsValue> {
        let doc = web_sys::window().unwrap().document().unwrap();

        let el = doc.create_element(tag)?;
        Ok(Element { el })
    }

    pub fn query(selector: &str) -> Result<Element, JsValue> {
        let document = web_sys::window().unwrap().document().unwrap();

        let el = document.query_selector(selector)?.unwrap();
        Ok(Element { el })
    }

    /// Add event listener to this node
    pub fn add_event_listener<T>(&self, event_name: &str, handler: T)
    where
        T: 'static + FnMut(Event),
    {
        let cb = Closure::wrap(Box::new(handler) as Box<dyn FnMut(_)>);
        self.el
            .add_event_listener_with_callback(event_name, cb.as_ref().unchecked_ref())
            .unwrap();
        cb.forget();
    }

    /// Find child `Element`s from this node
    pub fn query_from(&self, selector: &str) -> Result<Element, JsValue> {
        Ok(Element {
            el: self.el.query_selector(selector)?.unwrap(),
        })
    }

    /// Sets the inner HTML of the `self.el` element
    pub fn set_inner_html(&mut self, value: String) {
        self.el.set_inner_html(&value);
    }

    /// Returns the inner HTML of the element.
    pub fn inner_html(&self) -> String {
        self.el.inner_html()
    }

    /// Sets the ID of the ``self.el`` element.
    pub fn set_id(&mut self, id: &str) {
        self.el.set_id(id);
    }

    /// Gets the parent of the `self.el` element
    pub fn append_child(&mut self, child: &Element) {
        self.el.append_child(&child.el).unwrap();
    }

    /// Removes a class list item from the element
    pub fn class_list_remove(&mut self, value: &str) {
        self.el.class_list().remove_1(&value).unwrap();
    }

    /// Add a class list item from the element
    pub fn class_list_add(&self, value: &str) {
        self.el.class_list().add_1(&value).unwrap();
    }

    /// Gets the value for the element in `self.el` (The element must be an input)
    pub fn value(&self) -> String {
        let el: HtmlInputElement = JsCast::dyn_ref::<web_sys::HtmlInputElement>(&self.el)
            .unwrap()
            .to_owned();
        el.value()
    }

    /// Return a reference to the element inside.
    pub fn inner_ref(&self) -> &web_sys::Element {
        &self.el
    }
}
