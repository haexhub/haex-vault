use libsql::Builder;
use std::fs;
use std::path::Path;

pub fn create_db_file_if_not_exists(path: String, filename: String1) {
    if !db_file_exists(path) {
        create_db_file();
    }
}

pub fn create_local_database(sqlite_path: String) {
    if !db_file_exists(sqlite_path) {
        let db = Builder::new_local(sqlite_path).build().await?;
        let conn = db
            .connect()
            .unwrap_or_else(|_| panic!("Error connecting to {}", db_path));
    }
}

fn create_db_file(sqlite_path: String) {
    let db_dir = Path::new(&sqlite_path).parent().unwrap();

    if !db_dir.exists() {
        fs::create_dir_all(db_dir).unwrap();
    }

    fs::File::create(db_path).unwrap();
}

fn db_file_exists(sqlite_path: String) -> bool {
    let db_path = get_db_path();
    Path::new(&db_path).exists()
}
