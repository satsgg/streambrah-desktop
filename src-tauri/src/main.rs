// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
mod server;

use std::thread;
use std::sync::Mutex;

use serde::Serialize;
use tauri::State;

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
        .invoke_handler(tauri::generate_handler![get_state, set_state])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
