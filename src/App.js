import './App.css';
import React, { Component } from 'react';
import axios from 'axios';
import { CanvasJSChart } from 'canvasjs-react-charts';
import Select from 'react-select';
import { Container } from 'reactstrap';
import _ from 'lodash';

const states = [
  'Alabama',
  'Alaska',
  'Arizona',
  'Arkansas',
  'California',
  'Colorado',
  'Connecticut',
  'Delaware',
  'Florida',
  'Georgia',
  'Hawaii',
  'Idaho',
  'Illinois',
  'Indiana',
  'Iowa',
  'Kansas',
  'Kentucky',
  'Louisiana',
  'Maine',
  'Maryland',
  'Massachusetts',
  'Michigan',
  'Minnesota',
  'Mississippi',
  'Missouri',
  'Montana',
  'Nebraska',
  'Nevada',
  'New Hampshire',
  'New Jersey',
  'New Mexico',
  'New York',
  'North Carolina',
  'North Dakota',
  'Ohio',
  'Oklahoma',
  'Oregon',
  'Pennsylvania',
  'Rhode Island',
  'South Carolina',
  'South Dakota',
  'Tennessee',
  'Texas',
  'Utah',
  'Vermont',
  'Virginia',
  'Washington',
  'West Virginia',
  'Wisconsin',
  'Wyoming'
]

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      covid_data: [],
      state: null,
      polling_data: [],
      covid_data_by_state: [],
      polling_data_by_state: [],
      open: false,
      options: {
        theme: "light2",
        animationEnabled: true,
        title:{
          text: "Presidential Polls vs Covid Deaths"
        },
        axisY: {
          title: "Covid Deaths",
          titleFontColor: "#6D78AD",
          lineColor: "#6D78AD",
          labelFontColor: "#6D78AD",
          tickColor: "#6D78AD" 
        },
        axisY2: {
          title: "Polling %",
          titleFontColor: "#51CDA0",
          lineColor: "#51CDA0",
          labelFontColor: "#51CDA0",
          tickColor: "#51CDA0",
          minimum: 25,
          maximum: 75
        },
        toolTip: {
          shared: true
        },
        legend: {
          cursor: "pointer",
          itemclick: this.toggleDataSeries
        },
        data: [{
          type: "line",
          name: "Covid Deaths",
          showInLegend: true,
          xValueFormatString: "DD MMM YYYY",
          yValueFormatString: "#,##0",
          lineColor: "black",
          color: "black",
          dataPoints: []
        },
        {
          type: "line",
          name: "Biden Support",
          axisYType: "secondary",
          showInLegend: true,
          xValueFormatString: "DD MMM YYYY",
          yValueFormatString: "#0.##",
          lineColor: "blue",
          color: "blue",
          dataPoints: []
        },
        {
          type: "line",
          name: "Trump Support",
          axisYType: "secondary",
          showInLegend: true,
          xValueFormatString: "DD MMM YYYY",
          yValueFormatString: "#0.##",
          lineColor: "red",
          color: "red",
          dataPoints: []
        }]
      }
    };
  }

  componentDidMount() {
    this.getCovidData()
    this.getPollingData()
  }

  getCovidData() {
    axios.get(`https://raw.githubusercontent.com/nytimes/covid-19-data/master/us-states.csv`)
         .then(response => {
        this.parseCovidData(response.data);
      })
  }

  parseCovidData(data) {
    let data_list = []
    data.split("\n").map(item => {
      let row = item.split(",");
      if(row[0] !== 'date') {
        data_list.push(row);
      }
      return(true);
    })
    let state_list = [];
    states.map(state => {
      let dates = [];
      let cases = [];
      let deaths = [];
      data_list.map(row => {
        if(row[1] === state) {
          dates.push(new Date(row[0]));
          cases.push(row[3]);
          deaths.push(row[4]);
        }
        return(true);
      })
      state_list.push({
        state: state,
        data: {
          dates: dates,
          cases: cases,
          deaths: deaths
        }
      })
      return(true);
    })
    this.setState({
      covid_data: data_list,
      covid_data_by_state: state_list
    })
  }

  getPollingData() {
    axios.get(`https://cors-anywhere.herokuapp.com/https://projects.fivethirtyeight.com/2020-general-data/presidential_state_toplines_2020.csv`)
         .then(response => {
          this.parsePollingData(response.data)
      })
  }

  parsePollingData(data) {
    let data_list = []
    data.split("\n").map(item => {
      let row = item.split(",");
      if(row[0] !== 'cycle') {
        data_list.push(row);
      }
      return(true);
    })
    let state_list = [];
    states.map(state => {
      let dates = [];
      let joe_polls = [];
      let don_polls = [];
      data_list.map(row => {
        if(row[7] === state) {
          dates.push(new Date(row[3]));
          joe_polls.push(row[14]);
          don_polls.push(row[13]);
        }
        return(true);
      })
      state_list.push({
        state: state,
        data: {
          dates: dates,
          joe_polls: joe_polls,
          don_polls: don_polls
        }
      })
      return(true);
    })
    this.setState({
      polling_data: data_list,
      polling_data_by_state: state_list
    })
  }

  selectData(state) {
    let covid_data = _.find(this.state.covid_data_by_state, function(x) {
      return (x.state === state)
    })
    let polling_data = _.find(this.state.polling_data_by_state, function(x) {
      return (x.state === state)
    })
    let final_covid_data = [];
    for(var i = 0; i < covid_data.data.dates.length; i++) {
      final_covid_data.push({x: covid_data.data.dates[i], y: parseInt(covid_data.data.deaths[i]), color: "black"})
    }
    let biden_polling_data = [];
    let trump_polling_data = [];
    let sorted_dates = _.orderBy(polling_data.data.dates, null, "desc")
    let tryt = JSON.stringify(sorted_dates) === JSON.stringify(polling_data.data.dates)
    console.log(sorted_dates)
    console.log(polling_data.data.dates)
    console.log(tryt)
    for(i = 0; i < polling_data.data.dates.length; i++) {
      let index = _.indexOf(polling_data.data.dates, sorted_dates[i])
      biden_polling_data.push({x: sorted_dates[i], y: parseInt(polling_data.data.joe_polls[index]), color: "blue"})
      trump_polling_data.push({x: sorted_dates[i], y: parseInt(polling_data.data.don_polls[index]), color: "red"})
    }
    let data = this.state.options.data;
    data[0].dataPoints = final_covid_data;
    data[1].dataPoints = biden_polling_data;
    data[2].dataPoints = trump_polling_data;
    this.setState({
      ...this.state,
      options: {
        ...this.state.options,
        data: data
      }
    })
  }

  render() {
    return (
      <div style={{width: "1000px", margin: 'auto', paddingTop: '50px'}}>
        <Container fluid>
          <CanvasJSChart options = {this.state.options} onRef={ref => this.chart = ref} />
          <Select options={states.map(x => { return {label: x, value: x} })} onChange={(state) => this.setState({ state: state.value }, this.selectData(state.value))}/>          
        </Container>
      </div>
    );
  }
}

export default App;
