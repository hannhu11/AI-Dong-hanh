use super::conf::AppConfig;
use log::info;
use tauri::{Manager, WindowBuilder, WindowUrl};

#[tauri::command]
pub async fn reopen_main_window(app: tauri::AppHandle) -> Result<(), String> {
    // Check if a window with label "main" already exists
    if let Some(window) = app.get_window("main") {
        // Bring the existing window to focus
        window.set_focus().map_err(|e| e.to_string())?;
        info!("Main window already exists, brought to focus");
        return Ok(());
    }

    // Load app configuration
    let settings = AppConfig::new();
    
    // If no window exists, create a new one
    let window = WindowBuilder::new(&app, "main", WindowUrl::App("/".into()))
        .fullscreen(true)
        .resizable(false)
        .transparent(true)
        .always_on_top(settings.get_allow_pet_above_taskbar())
        .title("WindowPet")
        .skip_taskbar(true)
        .build()
        .map_err(|e| e.to_string())?;

    // Allow click-through window if interaction is disabled
    if !settings.get_allow_pet_interaction() {
        window.set_ignore_cursor_events(true).map_err(|e| e.to_string())?;
    }
    
    info!("Reopened main window with configuration - Language: {}, Above taskbar: {}, Interaction: {}", 
          settings.get_language(), 
          settings.get_allow_pet_above_taskbar(), 
          settings.get_allow_pet_interaction());

    Ok(())
}

pub fn open_setting_window(app: tauri::AppHandle) {
    let settings = AppConfig::new();
    
    // Log configuration for debugging
    info!("App language: {}", settings.get_language());
    info!("Allow pet above taskbar: {}", settings.get_allow_pet_above_taskbar());
    info!("Allow pet interaction: {}", settings.get_allow_pet_interaction());
    
    let _window = tauri::WindowBuilder::new(&app, "setting", WindowUrl::App("/setting".into()))
        .title("WindowPet Setting")
        .inner_size(1000.0, 650.0)
        .theme(if settings.get_theme() == "dark" {
            Some(tauri::Theme::Dark)
        } else {
            Some(tauri::Theme::Light)
        })
        .always_on_top(settings.get_allow_pet_above_taskbar())
        .build()
        .unwrap_or_else(|e| {
            log::error!("Failed to create setting window: {}", e);
            panic!("Window creation failed: {}", e);
        });
    info!("open setting window");
}