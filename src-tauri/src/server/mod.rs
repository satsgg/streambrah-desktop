use std::{sync::Mutex};

use actix_files as fs;

use actix_web::{middleware, web, Error, App, HttpRequest, HttpResponse, HttpServer};
use actix_web_actors::ws;
use tauri::AppHandle;

mod ws_server;
use self::ws_server::MyWebSocket;

struct TauriAppState {
    app: Mutex<AppHandle>,
}

/// WebSocket handshake and start `MyWebSocket` actor.
async fn echo_ws(req: HttpRequest, stream: web::Payload) -> Result<HttpResponse, Error> {
    ws::start(MyWebSocket::new(), &req, stream)
}

#[actix_web::main]
pub async fn init(app: AppHandle) -> std::io::Result<()> {
    let tauri_app = web::Data::new(TauriAppState {
        app: Mutex::new(app),
    });

    HttpServer::new(move || {
        App::new()
            .app_data(tauri_app.clone())
            .wrap(middleware::Logger::default())
            .service(web::resource("/ws").route(web::get().to(echo_ws)))
            .service(fs::Files::new("/", tauri_app.app.lock().unwrap().path_resolver().resolve_resource("web").expect("failed to resolve resource")))
    })
    .bind(("127.0.0.1", 4875))?
    .run()
    .await
}