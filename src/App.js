import React, { Component } from 'react';
import { Link } from 'react-router-dom'

import './css/App.css';
import './css/states.css';
import Map from './components/USAMap'
import ReactBootstrapSlider from 'react-bootstrap-slider';
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-slider/dist/css/bootstrap-slider.css"
let States = require('./components/data/states.json')

// https://covidtracking.com/api
export default class App extends Component {
	constructor(props) {
		super(props)
		let startDay = 20200401

		this.state = {
			dailyCovidStats: [],
			currentDay: startDay,
			linkStyle: { "textDecoration": "none", "color": "white" },
			step: 1,
			max: 81,
			min: 1,
			sliderValue: 1,
			currState: {"name": 'ID', "cases": 999},
			stateSettings: States,
		}
	}
	convertDay = (minPlusDays) => {
		let date
		if (minPlusDays - this.state.min > 61) date = 20200600 + minPlusDays - 61 - this.state.min
		else if (minPlusDays - this.state.min > 30) date = 20200500 + minPlusDays - 30 - this.state.min
		else date = 20200600 + minPlusDays - this.state.min

		return date
	}
	componentDidMount() {
		this.getData()
		this.statesCustomConfig()
	}
	componentDidUpdate() {
		this.getData()
	}

	getData = () => {
		const url = "https://virus-bloom-api.herokuapp.com/states/" + this.state.currentDay

		fetch(url)
			.then(res => res.json())
			.then(results => {
				this.setState({ dailyCovidStats: results });
			}).catch(err => console.log(err))
	}
	changeValue = (e) => {
		let newDay = this.convertDay(e.target.value)
		console.log(newDay)
		this.setState({ currentDay: newDay, sliderValue: e.target.value })
	}
	statesCustomConfig = () => {
		Object.keys(States).map(function(key, index) {
			States[key] = {
				fill: 'blue',
				clickHandler: (e) => console.log(e.target.dataset)
			}
			// console.log(States[key])
		  });
		this.setState({stateSettings: States})
		return States

		// return {
		//   "NJ": {
		// 	fill: "navy",
		// 	clickHandler: (event) => console.log('Custom handler for NJ', event.target.dataset)
		//   },
		//   "NY": {
		// 	fill: "#CC0000"
		//   }
		// }
	}
	mapHandler = (event) => {
		console.log(event.target.dataset.name);
		let name = event.target.dataset.name
		let cases = this.state.dailyCovidStats[name]
		this.setState({currState: {'name': name, 'cases': cases }})
	  };
	render() {
		// console.log(States)
		return (
			<div>
				<div className="body-wrapper">
					<div className="body-overlay">
						<header className="logo-header header">
							<div className="logo-link">
								<Link to={"/map/"} style={this.state.linkStyle} >
									<img src="/images/covid-bloom-white.png" alt="covid-bloom-logo" className="header__logo" />
								</Link>
							</div>
							<Link to={"/map/"} style={this.state.linkStyle} >
								<h3 className="nav-link" >Covid Cases in the US</h3>
							</Link>
						</header>
						<main>
							Day 1: April 1, 2020 --
							<ReactBootstrapSlider
								value={this.state.sliderValue}
								slideStop={this.changeValue}
								step={this.state.step}
								max={this.state.max}
								min={this.state.min}
								orientation="horizontal"
								disabled="enabled" />
							 -- Day 80: June 20, 2020
							<Map customize={this.state.stateSettings} onClick={this.mapHandler} />
						</main>
						<div className="state-detail">
							<h1>
								{this.state.currState.name ? 
								this.state.currState.name + ": " + "this.state.currState.cases" : ""
								}
							</h1>
						</div>
					</div>
				</div>
				<footer className="footer">
					<p>2020 RedCap Concepts.</p>
				</footer>
			</div>
		)
	}
}
