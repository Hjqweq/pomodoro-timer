use std::time::Duration;

#[tauri::command]
fn play_alarm_sound() -> Result<(), String> {
    // 播放一个简单的提示音
    // 在发布版本中可以使用实际的音频文件
    println!("Alarm sound played!");
    Ok(())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![play_alarm_sound])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
