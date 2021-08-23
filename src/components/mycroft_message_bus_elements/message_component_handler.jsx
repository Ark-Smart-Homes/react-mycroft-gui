import React, { Component } from "react";
import "./default.scss";
// import { GuiExamplesAiix } from "./skill_components/gui_examples_aiix";
// import { MycroftDateTime } from "./components/mycroft_date_time/mycroft_date_time";
// import { MycroftIp } from "./skill_components/mycroft_ip";
// import { MycroftWiki } from "./skill_components/mycroft_wiki";
// import { MycroftWeather } from "./skill_components/mycroft_weather/mycroft_weather";
import { MycroftSpeak } from "./components/mycroft_speak/mycroft_speak"
import { MycroftState } from "./components/mycroft_state/mycroft_state"

export default function MessageComponentHandler(props) {
	function returnActiveMessageComponent() {
		console.log('props', props)
		const utterance = props.utterance;
		const active_skill = props.active_skill;
		const mycroft_state = props.mycroft_state;
		console.log("utterance inside message_component", utterance)
		console.log("active_skill inside message_component", active_skill)

		switch (active_skill) {
			case "speak":
				return (
					<MycroftSpeak utterance={utterance} />
				);
			case "home":
				return (
					<MycroftState mycroft_state={mycroft_state} />
				);
			default:
				// return null;
				console.log("Unhandled component for: " + active_skill);
				return (<div>
							<p>{active_skill}</p>
						</div>);
		}
	}

	return (
		<div className="skill-container row">{returnActiveMessageComponent()}</div>
	);
}
