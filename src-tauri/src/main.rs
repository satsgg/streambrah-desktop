// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
mod server;

use std::thread;
use std::sync::Mutex;

use serde::Serialize;
use tauri::State;
use keyring::Entry;

pub struct NostrState {
    pubkey: Mutex<String>,
    identifier: Mutex<String>,
}

#[derive(Serialize)]
struct ReturnNostrState {
    pubkey: String,
    identifier: String
}

impl NostrState {
    fn new() -> Self {
        NostrState {
            pubkey: Mutex::new(String::from("Initial pubkey")),
            identifier: Mutex::new(String::from("Initial identifier"))
        }
    }
}

#[tauri::command]
fn get_state<'r>(state: State<'r, NostrState>) -> ReturnNostrState {
    let pubkey = state.pubkey.lock().unwrap().clone();
    let identifier = state.identifier.lock().unwrap().clone();
    println!("pubkey: {}", pubkey);
    println!("identifier: {}", identifier);
    ReturnNostrState {
        pubkey,
        identifier
    }
}

#[tauri::command]
fn set_state<'r>(state: State<'r, NostrState>, pubkey: String, identifier: String) -> ReturnNostrState {
    println!("setting state: {}", pubkey);
    *state.pubkey.lock().unwrap() = pubkey;
    *state.identifier.lock().unwrap() = identifier;

    ReturnNostrState {
        pubkey: state.pubkey.lock().unwrap().clone(),
        identifier: state.identifier.lock().unwrap().clone()
    }
}

#[tauri::command]
fn store_private_key(private_key: String) -> Result<(), String> {
    // let entry = Entry::new("key_store", "pubkey123");
    let entry = Entry::new("key_store", "pubkey123").map_err(|e| e.to_string())?;

    // entry.set_password("topS3cr3tP4$$w0rd")?;
    // entry.set_password(&key).map_err(|e| e.to_string())?;
    entry.set_password("topS3cr3tP4$$w0rd").map_err(|e| e.to_string())?;

    // let password = entry.get_password()?;
    // let password = entry.get_password().map_err(|e| e.to_string())
    let key = entry.get_password().map_err(|e| e.to_string())?;
    println!("My key is '{}'", key);

    // entry.delete_password()?;

    Ok(())
}

fn main() {
    let nostr_state = NostrState::new();

    tauri::Builder::default()
        .manage(nostr_state)
        .setup(|app| {
        let handle = app.handle();
        let boxed_handle = Box::new(handle);
        thread::spawn(move || {
            server::init(*boxed_handle).unwrap();
        });
        Ok(())
        })
        .invoke_handler(tauri::generate_handler![get_state, set_state, store_private_key])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
