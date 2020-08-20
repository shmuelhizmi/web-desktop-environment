import React from "react";

class EmptyComponent extends React.Component {
	render() {
		return this.props?.children;
	}
}

export default EmptyComponent;
