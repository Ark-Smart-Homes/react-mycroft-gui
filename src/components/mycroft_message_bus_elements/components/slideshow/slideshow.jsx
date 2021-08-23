import React, { Component } from "react";
import "./slideshow.css";

function importAll(r) {
	const image_list = r.keys().map(x => x.replace('./', 'public/images/'));
	return image_list;
}
const images = importAll(require.context('public/images', false, /\.(png|jpe?g|svg)$/));


export function Slideshow(props) {
	const index = props.index
	if (props.active == true) {
		return <img src={images[index]} className="face row" alt="logo" />;
	} else {
		return <img src={images[0]} className="face row" alt="logo" />;
	}
}
