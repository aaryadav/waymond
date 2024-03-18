use std::collections::HashMap;

use serde::{Deserialize, Serialize};
use crate::error::TauriError;

pub type APIResult<T, E = TauriError> = Result<T, E>;

#[derive(Deserialize, Serialize)]
pub struct DefinitionDetail {
    definition: String,
}

#[derive(Deserialize, Serialize)]
pub struct WordDefinition {
    word: String,
    part_of_speech: String,
    definition: Vec<DefinitionDetail>,
}

#[derive(Deserialize, Serialize)]
pub struct File {
    name: String,
    filetype: String,
    size: u64,
    path: String,
}

#[derive(Deserialize, Serialize)]
pub struct WebSearch {
    query: String,
    result: String,
}

#[derive(Deserialize, Serialize)]
pub struct App {
    name: String,
    version: String,
    developer: String,
    description: String,
    platform: String,
}

#[derive(Deserialize, Serialize)]
pub struct Apps {
    apps: Vec<App>,
}

pub enum URL {
    WithBaseUrl(&'static str),
    WithoutBaseUrl(String),
}


impl URL {
    pub fn value(self) -> String {
        match self {
            URL::WithBaseUrl(url) => format!("https://api.github.com/{url}"),
            URL::WithoutBaseUrl(url) => url
        }
    }
}
