//! This file provides the framework for the tag entry
//! on the Rainfusion website.
use crate::{Element, Rainfusion};
use wasm_bindgen::JsCast;
use web_sys::{Event, HtmlInputElement, KeyboardEvent};

/// Main Tag Component
pub struct TagComponent {
    tag_container: TagContainer,
    tag_input: TagInput,
    search_button: SearchButton,
}

/// Implementation of the Tag Component
impl TagComponent {
    /// Create a new tag component.
    pub fn new() -> Self {
        // Create the elements.
        let tag_container = TagContainer::new();
        let tag_input = TagInput::new();
        let search_button = SearchButton::new();

        Self {
            tag_container,
            tag_input,
            search_button,
        }
    }

    /// Mount the component to the DOM.
    pub fn mount(&mut self) {
        // Get tags root element.
        let mut tags_root = Element::query("#tags-root").unwrap();

        // Mount the tag container.
        self.tag_container.mount(&mut tags_root);

        // Mount the tag input on the tag container.
        self.tag_input
            .mount(&mut self.tag_container.inner_container_element);
    }
}

/// Tag Container
pub struct TagContainer {
    container_element: Element,
    inner_container_element: Element,
}

/// Implementation of the Tag Container
impl TagContainer {
    /// Create a new tag container.
    pub fn new() -> Self {
        // Create the container in the document.
        let mut container_element = Element::create_element("div").unwrap();
        let mut inner_container_element = Element::create_element("span").unwrap();
        let mut inner_tags_element = Element::create_element("span").unwrap();
        container_element.class_list_add("tags-container");
        inner_tags_element.set_id("tags-container");
        inner_container_element.append_child(&inner_tags_element);
        container_element.append_child(&inner_container_element);

        Self {
            container_element,
            inner_container_element,
        }
    }

    /// Return an array of tags in the tags container.
    pub fn tags() -> Vec<String> {
        // Get the children of the element.
        let container = Element::query("#tags-container").unwrap();
        let container_children = container.inner_ref().children();

        // Iterate through the children.
        (0..container_children.length())
            .map(|c| {
                // Get the span element with the tag.
                let tag_element = container_children.item(c).unwrap();
                let inner_element = tag_element.first_element_child().unwrap();

                // Return the inner value as the tag.
                inner_element.inner_html()
            })
            .collect()
    }

    /// Mount the container on an element.
    fn mount(&mut self, mounting_element: &mut Element) {
        // Mount the tag container on the mounting element.
        mounting_element.append_child(&self.container_element);
    }
}

/// Tags Input
pub struct TagInput {
    input_element: Element,
}

impl TagInput {
    /// Create a new tag input component.
    pub fn new() -> Self {
        // Create the input in the document.
        let input_element = Element::create_element("input").unwrap();
        input_element.class_list_add("tags-input");
        input_element.set_attribute("maxlength", "5");

        // Listen to "enter" events on the input box.
        let cloned_element = input_element.clone();
        input_element.add_event_listener("keydown", move |event: Event| {
            // Convert the event into a keyboard event.
            let keyboard_event: KeyboardEvent = event.dyn_into().unwrap();

            // Match the keys from the event.
            match keyboard_event.key().as_str() {
                "Enter" => {
                    // Get value inside input.
                    let html_input_element: &HtmlInputElement =
                        cloned_element.inner_ref().dyn_ref().unwrap();
                    let tag_value = html_input_element.value();

                    // Transform the tag into lowercase.
                    let mut lowercase_tag = tag_value.to_lowercase();

                    // Cut the value short if it is over the tag max.
                    if lowercase_tag.len() > 5 {
                        lowercase_tag.truncate(5);
                    }

                    // Clear the value inside the input.
                    html_input_element.set_value("");

                    // Get the inner tags container element.
                    let mut tags_container = Element::query("#tags-container").unwrap();

                    // Create a new tag with the value
                    let mut tag = Tag::new(lowercase_tag);
                    tag.mount(&mut tags_container);
                }
                _ => {}
            }
        });

        Self { input_element }
    }

    /// Mount the tag input on an element.
    fn mount(&mut self, mounting_element: &mut Element) {
        // Mount the tag input on the mounting element.
        mounting_element.append_child(&self.input_element);
    }
}

/// Tag Object
pub struct Tag {
    tag_element: Element,
    tag_text: Element,
    tag_removal: Element,
}

/// Implementation of the Tag Object
impl Tag {
    /// Create a new tag object.
    pub fn new(tag: String) -> Self {
        // Create the tag_element in the document.
        let mut tag_element = Element::create_element("span").unwrap();
        tag_element.class_list_add("tag-object");

        // Create the inner elements.
        let mut tag_text = Element::create_element("span").unwrap();
        let tag_removal = Element::create_element("a").unwrap();

        // Inner Tag Text
        tag_text.set_inner_html(tag);
        tag_element.append_child(&tag_text);

        // Inner Tag Removal
        tag_removal.class_list_add("tag-object-remove");
        tag_element.append_child(&tag_removal);

        // Listen to "click" events on the tag removal element.
        let cloned_element = tag_element.clone();
        tag_removal.add_event_listener("click", move |_: Event| {
            // Remove the tag from the container.
            cloned_element.inner_ref().remove();
        });

        Self {
            tag_element,
            tag_text,
            tag_removal,
        }
    }

    /// Mount the tag on an element.
    fn mount(&mut self, mounting_element: &mut Element) {
        // Mount the tag on the mounting element.
        mounting_element.append_child(&self.tag_element);
    }
}

/// Search Button Component
pub struct SearchButton;

/// Implementation of the Search Button
impl SearchButton {
    /// Create a new search button.
    pub fn new() -> Self {
        // Create the search button in the document.
        let search_button = Element::query("#tags-submit").unwrap();

        // Create the event listener on the button.
        search_button.add_event_listener("click", |_: Event| {
            // Get the current tags as an array of strings.
            let tags = TagContainer::tags();

            // Create a new Rainfusion service.
            let rainfusion = Rainfusion::new();

            // Get mod html element.
            let mut mods_element = Element::query("#mods-root").unwrap();

            // If the tags object is empty and the mods element is also empty.
            // Fetch unfiltered content or else fetch filtered content.
            if tags.is_empty() && mods_element.inner_html().is_empty() {
                // Fetch unfiltered content.
                mods_element.set_inner_html(
                    r#"<h1 class="ror-font-square text-center"> Loading Mods </h1>"#.to_string(),
                );
                rainfusion.rainfusion_html(None).unwrap();
            } else if !tags.is_empty() && mods_element.inner_html().is_empty() {
                // Fetch filtered content.
                mods_element.set_inner_html("".into());
                mods_element.set_inner_html(
                    r#"<h1 class="ror-font-square text-center"> Loading Filter </h1>"#.to_string(),
                );
                rainfusion.rainfusion_html(Some(&tags)).unwrap();
            } else if tags.is_empty() && !mods_element.inner_html().is_empty() {
                // Fetch unfiltered content.
                mods_element.set_inner_html(
                    r#"<h1 class="ror-font-square text-center"> Loading Mods </h1>"#.to_string(),
                );
                rainfusion.rainfusion_html(None).unwrap();
            } else if !tags.is_empty() && !mods_element.inner_html().is_empty() {
                // Fetch filtered content.
                mods_element.set_inner_html("".into());
                mods_element.set_inner_html(
                    r#"<h1 class="ror-font-square text-center"> Loading Filter </h1>"#.to_string(),
                );
                rainfusion.rainfusion_html(Some(&tags)).unwrap();
            }
        });

        Self {}
    }
}
