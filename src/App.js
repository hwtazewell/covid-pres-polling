import './App.css';
import React, { Component } from 'react';
import axios from 'axios';
import { CanvasJSChart } from 'canvasjs-react-charts';
import _ from 'lodash';
import USAMap from "react-usa-map";

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

const abbrs = [
'AL',
'AK',
'AZ',
'AR',
'CA',
'CO',
'CT',
'DE',
'FL',
'GA',
'HI',
'ID',
'IL',
'IN',
'IA',
'KS',
'KY',
'LA',
'ME',
'MD',
'MA',
'MI',
'MN',
'MS',
'MO',
'MT',
'NE',
'NV',
'NH',
'NJ',
'NM',
'NY',
'NC',
'ND',
'OH',
'OK',
'OR',
'PA',
'RI',
'SC',
'SD',
'TN',
'TX',
'UT',
'VT',
'VA',
'WA',
'WV',
'WI',
'WY'
]

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      covid_data: [],
      state: null,
      abbr: null,
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

  mapHandler = (event) => {
    let state_index = _.indexOf(abbrs, event.target.dataset.name)
    this.setState({
      state: states[state_index],
      abbr: event.target.dataset.name
    }, this.selectData(states[state_index]))
    let highlight = {}
    highlight[event.target.dataset.name] = {
      fill: "#CC0000"
    }
    this.statesCustomConfig(highlight)
  };

  statesCustomConfig = () => {
    return {
      'AL': {
        fill: this.state.abbr === 'AL' ? "navy" : null
      },
      'AK': {
        fill: this.state.abbr === 'AK' ? "navy" : null
      },
      'AZ': {
        fill: this.state.abbr === 'AZ' ? "navy" : null
      },
      'AR': {
        fill: this.state.abbr === 'AR' ? "navy" : null
      },
      'CA': {
        fill: this.state.abbr === 'CA' ? "navy" : null
      },
      'CO': {
        fill: this.state.abbr === 'CO' ? "navy" : null
      },
      'CT': {
        fill: this.state.abbr === 'CT' ? "navy" : null
      },
      'DE': {
        fill: this.state.abbr === 'DE' ? "navy" : null
      },
      'FL': {
        fill: this.state.abbr === 'FL' ? "navy" : null
      },
      'GA': {
        fill: this.state.abbr === 'GA' ? "navy" : null
      },
      'HI': {
        fill: this.state.abbr === 'HI' ? "navy" : null
      },
      'ID': {
        fill: this.state.abbr === 'ID' ? "navy" : null
      },
      'IL': {
        fill: this.state.abbr === 'IL' ? "navy" : null
      },
      'IN': {
        fill: this.state.abbr === 'IN' ? "navy" : null
      },
      'IA': {
        fill: this.state.abbr === 'IA' ? "navy" : null
      },
      'KS': {
        fill: this.state.abbr === 'KS' ? "navy" : null
      },
      'KY': {
        fill: this.state.abbr === 'KY' ? "navy" : null
      },
      'LA': {
        fill: this.state.abbr === 'LA' ? "navy" : null
      },
      'ME': {
        fill: this.state.abbr === 'ME' ? "navy" : null
      },
      'MD': {
        fill: this.state.abbr === 'MD' ? "navy" : null
      },
      'MA': {
        fill: this.state.abbr === 'MA' ? "navy" : null
      },
      'MI': {
        fill: this.state.abbr === 'MI' ? "navy" : null
      },
      'MN': {
        fill: this.state.abbr === 'MN' ? "navy" : null
      },
      'MS': {
        fill: this.state.abbr === 'MS' ? "navy" : null
      },
      'MO': {
        fill: this.state.abbr === 'MO' ? "navy" : null
      },
      'MT': {
        fill: this.state.abbr === 'MT' ? "navy" : null
      },
      'NE': {
        fill: this.state.abbr === 'NE' ? "navy" : null
      },
      'NV': {
        fill: this.state.abbr === 'NV' ? "navy" : null
      },
      'NH': {
        fill: this.state.abbr === 'NH' ? "navy" : null
      },
      'NJ': {
        fill: this.state.abbr === 'NJ' ? "navy" : null
      },
      'NM': {
        fill: this.state.abbr === 'NM' ? "navy" : null
      },
      'NY': {
        fill: this.state.abbr === 'NY' ? "navy" : null
      },
      'NC': {
        fill: this.state.abbr === 'NC' ? "navy" : null
      },
      'ND': {
        fill: this.state.abbr === 'ND' ? "navy" : null
      },
      'OH': {
        fill: this.state.abbr === 'OH' ? "navy" : null
      },
      'OK': {
        fill: this.state.abbr === 'OK' ? "navy" : null
      },
      'OR': {
        fill: this.state.abbr === 'OR' ? "navy" : null
      },
      'PA': {
        fill: this.state.abbr === 'PA' ? "navy" : null
      },
      'RI': {
        fill: this.state.abbr === 'RI' ? "navy" : null
      },
      'SC': {
        fill: this.state.abbr === 'SC' ? "navy" : null
      },
      'SD': {
        fill: this.state.abbr === 'SD' ? "navy" : null
      },
      'TN': {
        fill: this.state.abbr === 'TN' ? "navy" : null
      },
      'TX': {
        fill: this.state.abbr === 'TX' ? "navy" : null
      },
      'UT': {
        fill: this.state.abbr === 'UT' ? "navy" : null
      },
      'VT': {
        fill: this.state.abbr === 'VT' ? "navy" : null
      },
      'VA': {
        fill: this.state.abbr === 'VA' ? "navy" : null
      },
      'WA': {
        fill: this.state.abbr === 'WA' ? "navy" : null
      },
      'WV': {
        fill: this.state.abbr === 'WV' ? "navy" : null
      },
      'WI': {
        fill: this.state.abbr === 'WI' ? "navy" : null
      },
      'WY': {
        fill: this.state.abbr === 'WY' ? "navy" : null
      },
    };
  };

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
        data: data,
        title: {
          text: "Presidential Polls vs Covid Deaths for " + state
        }
      }
    })
  }

  render() {
    return (
      <div style={{width: "1000px", margin: 'auto', paddingTop: '50px'}}>
        <CanvasJSChart options = {this.state.options} onRef={ref => this.chart = ref} />
        <USAMap customize={this.statesCustomConfig()} onClick={this.mapHandler} />
      </div>
    );
  }
}

export default App;
