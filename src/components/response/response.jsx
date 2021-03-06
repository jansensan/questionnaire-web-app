import React, { Component } from 'react';

// models
import ResponseModel from './response-model';
import surveyModel from '../survey/survey-model';

// styles
require('./response.scss');


export default class Response extends Component {
  constructor(props) {
    super(props);

    // properties
    this.isComponentMounted = false;

    // init state
    this.state = new ResponseModel();
    this.state.setData(this.props);

    // listen to updates
    this.state.updated.add(this.onModelUpdated, this);
    surveyModel.questionChanged.add(this.onQuestionChanged, this);
  }

  // react methods definitions
  render() {
    return (
      <div className="response">
        <p>{this.state.getLabel()}</p>
        <input
          type="range"
          name={this.state.name}
          min={this.state.getMin()}
          max={this.state.getMax()}
          step={this.state.getStepSize()}
          value={this.state.value}
          onFocus={this.onRangeChanged.bind(this)}
          onChange={this.onRangeChanged.bind(this)}
        />
        <table className="response-num-label">
          <tbody>
            <tr>
              {this.renderNumericLabelCells()}
            </tr>
          </tbody>
        </table>
      </div>
    );
  }

  componentDidMount() { 
    this.isComponentMounted = true;
    this.state.setInitialValue();
    this.state.setName();
  }


  // methods definitions
  renderNumericLabelCells() {
    // generate num labels cells
    let cellWidth = Math.floor(100 / this.state.getNumSteps()) + '%';
    let cells = [];
    let label = '';
    for (let i = 0; i < this.state.getNumSteps(); i++) {
      switch(this.state.getStepType()) {
        case 'int':
          label = i + this.state.getMin();
          break;
        case 'percentage':
          label = i * 10 + '%';
          break;
      }

      // check if additional label
      let additionalLabel = this.state.getAdditionalLabelAtIndex(i);
      let hasAdditLabel = !_.isUndefined(additionalLabel);

      // add cell
      cells.push(
        <td
          style={{"width": cellWidth}}
          key={i}
        >
          <p className="numeric-label">{label}</p>
          {
            hasAdditLabel &&
            <p className="addit-label">{additionalLabel}</p>
          }
        </td>
      );
    }

    return cells;
  }

  onRangeChanged(event) {
    this.state.setAsChanged();
    this.state.setValue(event.target.value);

    surveyModel.saveResponses();

    let input = document.getElementsByName(this.state.name)[0];
    input.setCustomValidity('');
  }

  onModelUpdated() {
    if (!this.isComponentMounted) {
      return;
    }

    this.forceUpdate();
  }

  onQuestionChanged() {
    this.state.setAsClean();
  }
}
