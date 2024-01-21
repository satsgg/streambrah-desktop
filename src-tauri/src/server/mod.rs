// mod handlers;

use std::{sync::Mutex};

// use actix_files::NamedFile;
use actix_files as fs;

use actix_web::{middleware, web, App, HttpServer, get};
use tauri::AppHandle;

struct TauriAppState {
    app: Mutex<AppHandle>,
}

// // TODO: Try serving the entire web directory
// // not getting _next/static/css files
// #[get("/")]
// // async fn handle(tauri_app: web::Data<TauriAppState>) -> actix_web::Result<NamedFile> {
// async fn handle(tauri_app: web::Data<TauriAppState>) -> actix_web::Result<NamedFile> {
//     let resource_path = tauri_app.app.lock().unwrap().path_resolver()
//     // .resolve_resource("web/index.html")
//     .resolve_resource("web")
//     .expect("failed to resolve resource");
//     println!("{}", resource_path.display());

//     // let text = "hello world";
//     // println!("{}",text);

//     // Ok(text.to_string())
//     // Ok(NamedFile::open(resource_path)?)
//     Ok(fs::Files::new("/web", ".").show_files_listing())
// }

#[actix_web::main]
pub async fn init(app: AppHandle) -> std::io::Result<()> {
    let tauri_app = web::Data::new(TauriAppState {
        app: Mutex::new(app),
    });

    HttpServer::new(move || {
        App::new()
            .app_data(tauri_app.clone())
            .wrap(middleware::Logger::default())
            // .service(handlers::example::handle)
            // .service(handle)
            .service(fs::Files::new("/", tauri_app.app.lock().unwrap().path_resolver().resolve_resource("web").expect("failed to resolve resource")))
    })
    .bind(("127.0.0.1", 4875))?
    .run()
    .await
}