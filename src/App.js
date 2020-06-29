import React, { Component } from 'react';
import { Link } from 'react-router-dom'

import './css/App.css';
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
			max: 20200481,
			min: startDay,
		}
	}
	convertDay = (minPlusDays) => {
		let date
		if (minPlusDays - this.state.min > 61) date = 20200600 + minPlusDays - this.state.min
		else if (minPlusDays - this.state.min > 30) date = 20200500 + minPlusDays - this.state.min
		else date = 20200600 + minPlusDays - this.state.min

		return date
	}
	componentDidMount() {
		this.getData()
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
		this.setState({ currentDay: newDay })
	}
	statesCustomConfig = () => {
		Object.keys(States).map(function(key, index) {
			States[key] = {
				fill: 'navy',
				clickHandler: (e) => console.log(e.target.dataset)
			}
			// console.log(States[key])
		  });
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
							<ReactBootstrapSlider
								// value={this.state.currentDay}
								slideStop={this.changeValue}
								step={this.state.step}
								max={this.state.max}
								min={this.state.min}
								orientation="horizontal"
								// reversed={true}
								disabled="enabled" />
							<Map customize={this.statesCustomConfig()} onClick={this.mapHandler} />
						</main>
					</div>
				</div>
				<footer className="footer">
					<p>2020 RedCap Concepts.</p>
				</footer>
			</div>
		)
	}
}
