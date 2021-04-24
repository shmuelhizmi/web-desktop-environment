use crate::app::types::scripts::{Script, ScriptLocationType};
use std::string;
use url::Url;
use std::io::{Error, ErrorKind};

struct ModuleLoader {
	loaded_scripts: Vec<Script>,
}

impl ModuleLoader {
	pub fn import(source: Script, path: String) {
		match source.location_type {
			ScriptLocationType::Local => {
				if (isUrl(path)) {

				}
			}
		}
	}
}

async fn fetchFileFromUrl(url: String) -> Result<String, Error> {
	let response = reqwest::blocking::get(&url[..]);
	response
}

fn isUrl(path: String) -> bool {
	let url = Url::parse(&path[..]);
	match url {
		Ok(_) => return true,
		Err(_) => return false,
	}
}
