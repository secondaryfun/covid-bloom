import React, { Component } from 'react';
import { Link } from 'react-router-dom'

import './css/App.css';
import Map from './components/USAMap'
import ReactBootstrapSlider from 'react-bootstrap-slider';
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-slider/dist/css/bootstrap-slider.css"
import States from './data/states.json'

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
		// this.getData()
		// this.updateUserCourses()
	}
	getData = () => {
		const url = "https://virus-bloom-api.herokuapp.com/states/" + this.state.currentDay

		fetch(url)
			.then(res => res.json())
			.then(result => {
				this.setState({ dailyCovidStats: result });
			}).catch(err => console.log(err))
	}
	// updateUserCourses = () => {
	// 	const url = "https://udemy-courses-api.herokuapp.com/courses/category/user"

	// 	fetch(url)
	// 		.then(res => res.json())
	// 		.then(result => {
	// 			console.log('Updated user courses.')
	// 			this.setState({ userCourseList: result });
	// 		}).catch(err => console.log(err))
	// }
	changeValue = (e) => {
		this.setState({ currentDay: e.target.value })
	}
	render() {
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
								value={this.state.currentDay}
								slideStop={this.changeValue}
								step={this.state.step}
								max={this.state.max}
								min={this.state.min}
								orientation="horizontal"
								// reversed={true}
								disabled="enabled" />
							<Map />
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
