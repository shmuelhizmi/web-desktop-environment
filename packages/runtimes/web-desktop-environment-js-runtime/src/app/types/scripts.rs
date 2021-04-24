use std::string;

pub enum ScriptLocationType {
	Local,
	Url,
}

pub struct Script {
	pub path: String,
	pub location_type: ScriptLocationType,
	pub content: Option<String>,
}
