use std::string;

pub enum ScriptLocationType {
	Local,
	Url,
}

pub struct Script {
	path: String,
	locationType: ScriptLocationType,
	content: Option<String>,
}
