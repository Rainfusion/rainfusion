//! Webdriver testing to make sure the website is rendering correctly on
//! modern browsers such as Firefox or Chrome.
//! We test Firefox, Chrome, Edge and Safari since they are the most popular.

use fantoccini::{Client, Locator};
use serde_json::json;
use std::error::Error;

const VERSION: &'static str = env!("CARGO_PKG_VERSION");

/// Function to allow tests to be ran on BrowserStack.
pub async fn run_test(
    browser: &str,
    browser_version: &str,
    os: &str,
    os_version: &str,
) -> Result<bool, Box<dyn Error>> {
    // Form the webdriver URL using environment variables.
    let username = env!("BS_USERNAME");
    let access_key = env!("BS_ACCESS_KEY");

    // Create webdriver capabilities.
    let cap = json!({
        "browserName": browser,
        "browserVersion": browser_version,
        "bstack:options": {
            "os": os,
            "osVersion": os_version,
            "projectName": "Rainfusion Modern Browser Testing",
            "buildName": format!("Build {}", VERSION),
            "sessionName": format!("Rainfusion {} Test", browser),
            "seleniumVersion": "4.0.0-alpha-2",
            "userName": username,
            "accessKey": access_key,
        }
    });

    // Form the webdriver client.
    let mut driver = Client::with_capabilities(
        "http://hub-cloud.browserstack.com/wd/hub/",
        cap.as_object().unwrap().to_owned(),
    )
    .await?;

    // First go to the webpage.
    driver.goto("https://rainfusion.ml").await?;

    // Wait for the element to appear on the page.
    let element = driver.wait_for_find(Locator::Id("example_mod")).await;

    // Find out if the element is on the page or not.
    let output = match element {
        Ok(_x) => true,
        Err(_e) => false,
    };

    // Close and return.
    driver.close().await?;

    Ok(output)
}

/// Latest Chrome Test
#[tokio::test]
async fn test_chrome_latest() -> Result<(), Box<dyn Error>> {
    // Run the test using Chrome as the browser.
    let result = run_test("Chrome", "79.0", "Windows", "10").await?;

    // This assert fails the test if the browser fails the test.
    Ok(assert_eq!(result, true))
}

/// Latest Firefox Test
#[tokio::test]
async fn test_firefox_latest() -> Result<(), Box<dyn Error>> {
    // Run the test using Firefox as the browser.
    let result = run_test("Firefox", "71.0", "Windows", "10").await?;

    // This assert fails the test if the browser fails the test.
    Ok(assert_eq!(result, true))
}

/// Latest Edge Test
#[tokio::test]
async fn test_edge_latest() -> Result<(), Box<dyn Error>> {
    // Run the test using Edge as the browser.
    let result = run_test("Edge", "79.0 beta", "Windows", "10").await?;

    // This assert fails the test if the browser fails the test.
    Ok(assert_eq!(result, true))
}

/// Latest Safari Test
#[tokio::test]
async fn test_safari_latest() -> Result<(), Box<dyn Error>> {
    // Run the test using Edge as the browser.
    let result = run_test("Safari", "13.0", "OS X", "Catalina").await?;

    // This assert fails the test if the browser fails the test.
    Ok(assert_eq!(result, true))
}
