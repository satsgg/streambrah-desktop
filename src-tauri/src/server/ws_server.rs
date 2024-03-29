use std::time::{Duration, Instant};

use actix::prelude::*;
use actix_web_actors::ws;

use actix_web::web;
use tauri::Manager;

use crate::{NostrState, ReturnNostrState};

use super::{TauriAppState, WidgetClientActors};

/// How often heartbeat pings are sent
const HEARTBEAT_INTERVAL: Duration = Duration::from_secs(5);

/// How long before lack of client response causes a timeout
const CLIENT_TIMEOUT: Duration = Duration::from_secs(10);

/// websocket connection is long running connection, it easier
/// to handle with an actor
pub struct MyWebSocket {
    /// Client must send ping at least once per 10 seconds (CLIENT_TIMEOUT),
    /// otherwise we drop connection.
    hb: Instant,
    tauri_app: web::Data<TauriAppState>,
}

impl MyWebSocket {
    // pub fn new(tauri_app_handle: web::Data<TauriAppState>, widget_actors: web::Data<WidgetClientActors>) -> Self {
    pub fn new(tauri_app_handle: web::Data<TauriAppState>) -> Self {
        // Self { hb: Instant::now(), tauri_app: tauri_app_handle, widget_actors: widget_actors }
        Self { hb: Instant::now(), tauri_app: tauri_app_handle}
    }

    /// helper method that sends ping to client every 5 seconds (HEARTBEAT_INTERVAL).
    ///
    /// also this method checks heartbeats from client
    fn hb(&self, ctx: &mut <Self as Actor>::Context) {
        ctx.run_interval(HEARTBEAT_INTERVAL, |act, ctx| {
            // check client heartbeats
            if Instant::now().duration_since(act.hb) > CLIENT_TIMEOUT {
                // heartbeat timed out
                println!("Websocket Client heartbeat failed, disconnecting!");

                // stop actor
                ctx.stop();

                // don't try to send a ping
                return;
            }

            ctx.ping(b"");
        });
    }
}

impl Actor for MyWebSocket {
    type Context = ws::WebsocketContext<Self>;

    /// Method is called on actor start. We start the heartbeat process here.
    fn started(&mut self, ctx: &mut Self::Context) {
        self.hb(ctx);
        ctx.text("Welcome to the WebSocket server!");

        let tauri_app_handle = self.tauri_app.app.lock().unwrap().clone();
        let widget_actors = tauri_app_handle.state::<WidgetClientActors>();
        widget_actors.clients.lock().unwrap().push(ctx.address());
        let my_state = tauri_app_handle.state::<NostrState>();

        let res = ReturnNostrState {
            pubkey: my_state.pubkey.lock().unwrap().clone(),
            identifier: my_state.identifier.lock().unwrap().clone()
        };

        let json_text = serde_json::to_string(&res).expect("Serialization failed");
        ctx.text(json_text)
    }
}

/// Handler for `ws::Message`
impl StreamHandler<Result<ws::Message, ws::ProtocolError>> for MyWebSocket {
    fn handle(&mut self, msg: Result<ws::Message, ws::ProtocolError>, ctx: &mut Self::Context) {
        // process websocket messages
        println!("WS: {msg:?}");
        match msg {
            Ok(ws::Message::Ping(msg)) => {
                self.hb = Instant::now();
                ctx.pong(&msg);
            }
            Ok(ws::Message::Pong(_)) => {
                self.hb = Instant::now();
            }
            Ok(ws::Message::Text(text)) => ctx.text(text),
            Ok(ws::Message::Binary(bin)) => ctx.binary(bin),
            Ok(ws::Message::Close(reason)) => {
                ctx.close(reason);
                ctx.stop();
            }
            _ => ctx.stop(),
        }
    }
}

#[derive(Message)]
#[rtype(result = "()")]
pub struct WebSocketMessage(pub ws::Message);

// Implement handling for the ClientMessage for your WebSocket actor
impl Handler<WebSocketMessage> for MyWebSocket {
    type Result = ();

    fn handle(&mut self, msg: WebSocketMessage, ctx: &mut Self::Context) {
        match msg.0 {
            ws::Message::Text(text) => ctx.text(text),
            // Handle other ws::Message variants as needed
            _ => {}
        }
    }
}