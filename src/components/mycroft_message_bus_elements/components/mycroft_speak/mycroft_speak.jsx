import React, { Component } from "react";
import "./mycroft_speak.css"
export function MycroftSpeak(props) {
	const utterance = props.utterance;

	return (
		<div className="title">
			<h1>{utterance}</h1>
		</div>
	);
}
