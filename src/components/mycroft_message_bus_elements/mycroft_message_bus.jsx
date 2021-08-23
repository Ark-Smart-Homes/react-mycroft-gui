import React, { Component, useState } from "react";
import { Slideshow } from "./components/slideshow/slideshow";
import SkillComponent from "./skill_component_handler";
import MessageComponent from "./message_component_handler"

const SLIDESHOW_INTERVAL = 30

  
export default class MycroftMessageBus extends Component {
	constructor(props) {
		super(props);
		this.state = {
			"ws.readyState": null,
			"mycroft.system.active_skills": null,
			"face.active": true,
			"speak": null,
			"mycroft_state": null,
			"image_index": 0,
			"time": new Date().toLocaleTimeString(),
			"seconds": 1
		};
	}


	tick() {
		if (this.state.seconds % SLIDESHOW_INTERVAL === 0  ) {
			console.log("image_index + 1", this.state.image_index + 1)
			this.setState({ "image_index": this.state.image_index + 1 });
			this.setState(state => ({
				seconds: 0
				}));
		}

		this.setState(state => ({
			seconds: state.seconds + 1
			}));


	  }

	componentDidMount() {
		this.interval = setInterval(() => this.tick(), 1000);
		if ((this.state["ws.readyState"] = null || 3)) {
			this.connectToCoreWebSocket();
		}
	}

	componentWillUnmount() {
		clearInterval(this.interval);
	  }

	connectToCoreWebSocket() {
		var ws = new WebSocket("ws://localhost:8181/core");
		ws.onopen = (event) => {
			this.updateWebSocketReadyState(ws);
			this.announceConnection(ws);
		};
		this.handleCoreMessages(ws);
		ws.onclose = () => {
			this.updateWebSocketReadyState(ws);
		};
	}

	updateWebSocketReadyState(web_socket) {
		this.setState(
			{
				["ws.readyState"]: web_socket.readyState,
			},
			() => {
				console.log(`mycroft core ready state: ${this.state["ws.readyState"]}`);
			}
		);
	}

	announceConnection(web_socket) {
		web_socket.send(
			JSON.stringify({
				type: "mycroft.gui.connected",
				data: {
					gui_id: "js_gui",
				},
			})
		);
	}

	handleCoreMessages(web_socket) {
		let setFaceState = (active) => {
			this.setState({ "face.active": active });
		};
		let setSpeakState = (utterance) => {
			this.setState({ "speak": utterance });
		};
		let setMycroftState = (state) => {
			this.setState({ "mycroft_state": state });
		};
		web_socket.onmessage = (event) => {
			var msg = JSON.parse(event.data);
			// console.log('top message', msg)
			switch (msg.type) {
				case "recognizer_loop:audio_output_start":
					setFaceState(true);
					break;
				case "recognizer_loop:audio_output_end":
					setFaceState(false);
					setSpeakState(null);
					break;
				case "mycroft.ready":
					console.log("Mycroft is ready.");
					break;
				case "speak":
					console.log("Mycroft is speaking.", msg.data);
					setSpeakState(msg.data.utterance);
					break;
				case "gui.value.set":
					console.log("Mycroft state.", msg.data);
					setMycroftState(msg.data);
					break;
				case "mycroft.gui.port":
					console.log(msg.type);
					console.log(`connecting to mycroft gui at port: ${msg.data["port"]}`);
					var gui_ws = new WebSocket(`ws://localhost:${msg.data["port"]}/gui`);
					this.handleGuiMessages(gui_ws);
					break;
				default:
				// Log unhandled messages
				// console.log("Unhandled message type: " + msg.type);
				// console.log("Unhandled message event: " + event.data);
			}
		};
	}

	handleGuiMessages(gui_ws) {
		gui_ws.onmessage = (event) => {
			let gui_msg = JSON.parse(event.data);
			let component_namespace_state = Object.assign(
				{},
				this.state[gui_msg.namespace]
			);
			// console.log("gui_msg", gui_msg)
			// console.log("gui_msg.type", gui_msg.type)
			switch (gui_msg.type) {
				case "mycroft.session.list.insert":
					// Insert a new and reset existing skill namespace under mycroft.system.active_skill in state
					let skill_id = gui_msg.data[0]["skill_id"];
					return this.setState({
						[gui_msg.namespace]: skill_id,
						[skill_id]: null,
					});
				case "mycroft.session.set":
					// Set all variables to the namespaces state
					let merged_namespace_state = Object.assign(
						component_namespace_state,
						gui_msg.data
					);
					return this.setState({
						[gui_msg.namespace]: merged_namespace_state,
					});
				case "mycroft.gui.list.insert":
					let filter_url = (page_url) => {
						return page_url
							.substring(page_url.lastIndexOf("/") + 1)
							.replace(".qml", "");
					};
					// iterate through page_urls only adding the component name to the array
					let page_list = gui_msg.data.map((i) => filter_url(i["url"]));
					// assign pages list and determine page and component to focus
					component_namespace_state["components"] = page_list;
					component_namespace_state["component_focus"] = gui_msg.position;
					// component_namespace_state['displayEvent'] = gui_msg.event_name
					return this.setState({
						[gui_msg.namespace]: component_namespace_state,
					});
				case "mycroft.events.triggered":
					// Used to switch page within currently active namespace if page focus event
					// console.log("gui_msg", gui_msg)
					if (gui_msg.event_name == "page_gained_focus") {
						let resetDisplayEvent = () => {
							component_namespace_state["display"] = {
								["display_event"]: null,
							};
							return this.setState({
								[gui_msg.namespace]: component_namespace_state,
							});
						};
						component_namespace_state["component_focus"] =
							gui_msg.data["number"];
						component_namespace_state["display"] = {
							["display_event"]: gui_msg.event_name,
							["display_event_callback"]: resetDisplayEvent,
						};
						return this.setState({
							["mycroft.system.active_skills"]: gui_msg.namespace,
							[gui_msg.namespace]: component_namespace_state,
						});
					}
				default:
					// Log unhandled messages
					console.log("Unhandled message type: " + gui_msg.type);
			}
		};
	}


	render() {
		let seconds = this.state["seconds"];
		let image_index = this.state["image_index"];
		let active_skill = this.state["mycroft.system.active_skills"];
		let active_skill_state = this.state[active_skill];
		let face_state = this.state["face.active"];
		let speak = this.state["speak"];
		let mycroft_state = this.state["mycroft_state"];
		// console.log('active_skill', active_skill)
		// console.log('active_skill_state', active_skill_state)
		// console.log('speak', speak)
		// console.log("seconds", seconds)

		let defaultFace = () => {
			return (
				<div className="container">
					{/* <Face active={face_state} /> */}
					<p>{speak}</p>
				</div>
			);
		};
		if (speak){
			console.log("speak")
			return (
				<MessageComponent
					utterance={speak} active_skill="speak"
				/>
			)

		} else if (mycroft_state){
			console.log('print mycroft state1')
			return(
				<div>
				<Slideshow active={face_state} index={image_index}/>
				<MessageComponent
					mycroft_state={mycroft_state} active_skill="home"
				/>
			  </div>

			)
		} else {
			console.log("deafult face")
			// return defaultFace();
			return null
		}
	}
}
