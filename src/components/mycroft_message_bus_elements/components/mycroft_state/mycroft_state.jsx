import React, { Component } from "react";

import "./mycroft_state.css"
export function MycroftState(props) {
	const mycroft_state = props.mycroft_state;
	console.log('mycroft_state', mycroft_state)
	return (
		
		<div id="circle">
			{/* <div id="circle"></div> */}
			<div  id="info">
				<h1>{mycroft_state.time_string}</h1>
				<p>{mycroft_state.weekday_string}</p>
				<p>{mycroft_state.month_string}</p>
			</div>
		</div>
	);
}
