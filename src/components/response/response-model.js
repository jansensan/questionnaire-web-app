import _ from 'lodash';
import signals from 'signals';

export default class ResponseModel {
  constructor() {
    // properties
    this.data = {};
    this.value = -1;
    this.hasData = false;

    // signals
    this.updated = new signals.Signal();
  }

  getAdditionalLabels() {
    // error checking
    if (!this.hasData) {
      return;
    }

    return _.get(this.data, 'type.additionalLabels');
  }

  getAdditionalLabelAtIndex(index) {
    // error checking
    if (!this.hasData) {
      return;
    }

    return _.get(
      _.find(this.getAdditionalLabels(), {index: index}),
      this.data.lang
    );
  }

  getInputName() {
    // error checking
    if (!this.hasData) {
      return;
    }

    return _.get(this.data, 'vignetteId') +
      'Range' +
      _.get(this.data, 'index');
  }

  getLabel() {
    // error checking
    if (!this.hasData) {
      console.warn(
        'Warning at ResponseModel#getLabel: ' +
        'Model has no data, unable to get label value'
      );
      return;
    }

    return _.get(this.data.label, this.data.lang);
  }

  getMax() {
    // error checking
    if (!this.hasData) {
      return;
    }

    let max = _.get(this.data, 'type.max');
    return parseInt(max, 10);
  }

  getMin() {
    // error checking
    if (!this.hasData) {
      return;
    }

    let min = _.get(this.data, 'type.min');
    return parseInt(min, 10);
  }

  getNumSteps() {
    // error checking
    if (!this.hasData) {
      return;
    }

    let type = _.get(this.data, 'type.stepType');
    let numSteps = -1;
    switch(type) {
      case 'int':
        numSteps = this.getMax() - this.getMin() + 1;
        break;
      case 'percentage':
        numSteps = 11;
        break;
    }
    return parseInt(numSteps, 10);
  }

  getStepSize() {
    // error checking
    if (!this.hasData) {
      return;
    }

    return _.get(this.data, 'type.step');
  }

  getStepType() {
    // error checking
    if (!this.hasData) {
      return;
    }

    return _.get(this.data, 'type.stepType');
  }

  setData(value) {
    this.data = value;
    this.hasData = true;
  }

  setInitialValue() {
    // error checking
    if (!this.hasData) {
      console.warn(
        'Warning at ResponseModel#setInitialValue: ' +
        'Model has no data, unable to set initial value'
      );
      return;
    }

    let val = _.get(this.data, 'type.initVal');
    this.setValue(val);
  }

  setValue(val) {
    this.value = parseInt(val, 10);
    this.updated.dispatch();
  }
}