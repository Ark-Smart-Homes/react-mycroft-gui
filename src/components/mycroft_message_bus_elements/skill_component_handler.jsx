import React, { Component } from "react";
import "./default.scss";
import { GuiExamplesAiix } from "./components/mycroft_aiix/gui_examples_aiix";
import { MycroftDateTime } from "./components/mycroft_date_time/mycroft_date_time";
import { MycroftIp } from "./components/mycroft_ip/mycroft_ip";
import { MycroftWiki } from "./components/mycroft_wiki/mycroft_wiki";
import { MycroftWeather } from "./components/mycroft_weather/mycroft_weather";

export default function SkillComponentHandler(props) {
	function returnActiveSkillComponent() {
		const active_skill = props.activeSkill;
		const skill_state = props.skillState;
		const component_focus = skill_state["component_focus"];
		const component_name = skill_state["components"][component_focus];
		console.log("active_skill inside skillcomponent", active_skill)
		console.log("skill_state inside skillcomponent", skill_state)
		console.log("component_focus inside skillcomponent", component_focus)
		console.log("component_name inside skillcomponent", component_name)
		switch (active_skill) {
			case "gui-examples.aiix":
				return (
					<GuiExamplesAiix
						skillState={skill_state}
						componentName={component_name}
					/>
				);
			case "mycroft-date-time.mycroftai":
				return (
					<MycroftDateTime
						skillState={skill_state}
						componentName={component_name}
					/>
				);
			case "mycroft-ip.mycroftai":
				return (
					<MycroftIp skillState={skill_state} componentName={component_name} />
				);
			case "mycroft-wiki.mycroftai":
				return (
					<MycroftWiki
						skillState={skill_state}
						componentName={component_name}
					/>
				);
			case "mycroft-wiki.mycroftai":
				return (
					<MycroftWiki
						skillState={skill_state}
						componentName={component_name}
					/>
				);
			case "mycroft-weather.mycroftai":
				return (
					<MycroftWeather
						skillState={skill_state}
						componentName={component_name}
					/>
				);
			default:
				// return null;
				console.log("Unhandled component for: " + active_skill);
				return (<div>
							<p>{active_skill}</p>
							<p>{skill_state}</p>
							<p>{component_name}</p>
						</div>);
		}
	}

	return (
		<div className="skill-container row">{returnActiveSkillComponent()}</div>
	);
}
