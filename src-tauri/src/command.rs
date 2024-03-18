use reqwest;
use serde_json::Value;
use serde::{Deserialize, Serialize};

#[derive(Deserialize, Serialize)]
pub struct Definition {
    pub word: String,
    pub definition: String,
}

#[tauri::command]
pub fn get_foo(word: String) -> Result<Vec<Definition>, String> {
    let url = format!("https://api.dictionaryapi.dev/api/v2/entries/en/{}", word);
    let response: Value = reqwest::blocking::get(&url)
        .map_err(|e| e.to_string())?
        .json()
        .map_err(|e| e.to_string())?;
    
    let empty_vec: Vec<Value> = vec![];
    let meanings = response[0]["meanings"].as_array().unwrap_or(&empty_vec);
    
    let definitions: Vec<Definition> = meanings.iter().map(|meaning| {
        Definition {
            word: word.clone(),
            definition: meaning["definitions"][0]["definition"].as_str().unwrap_or("").to_string(),
        }
    }).collect();
    Ok(definitions)
}




#[tauri::command]
fn greet(name: &str) -> String {
   format!("Hello, {}!", name)
}
