use std::string;
use url::{Url};
use crate::app::types::scripts::{Script, ScriptLocationType};

struct ModuleLoader {
	loaded_scripts: &[Script]
}

impl ModuleLoader {
	pub fn import(source: Script, path: String) {
		
	}
}
