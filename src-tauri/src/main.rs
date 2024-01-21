// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
mod server;

use std::thread;
use std::sync::Mutex;

use tauri::State;

pub struct NostrState {
    value: Mutex<String>,
}

impl NostrState {
    fn new() -> Self {
        NostrState {
            value: Mutex::new(String::from("Initial Value")),
        }
    }
}

#[tauri::command]
fn get_state<'r>(state: State<'r, NostrState>) -> String {
    let v = state.value.lock().unwrap().clone();
    println!("state: {}", v);
    v
}

#[tauri::command]
fn set_state<'r>(state: State<'r, NostrState>, new_value: String) -> String {
    println!("setting state: {}", new_value);
    *state.value.lock().unwrap() = new_value;
    let v = state.value.lock().unwrap().clone();
    v
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
