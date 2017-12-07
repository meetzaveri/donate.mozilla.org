import React from 'react';
import reactGA from 'react-ga';
import { FormattedMessage, FormattedNumber } from 'react-intl';
import ErrorMessage from './error.js';
import { connect } from 'react-redux';
import { setAmount } from '../actions';
import { setPosition } from '../actions';
import AmountInput from './amount-input.js';

var AmountButton = React.createClass({
  propTypes: {
    onChange: React.PropTypes.func,
    amount: React.PropTypes.string,
    value: React.PropTypes.string,
    currencyCode: React.PropTypes.string
  },

  componentDidMount: function() {
    if (this.input.checked) {
      this.props.onChange(this.props.position);
    }
  },

  onChange: function(e) {
    this.props.onChange(this.props.position);
  },

  onClickEvent: function(e) {
    reactGA.event({
      category: "User Flow",
      action: "Changed Amount",
      label: e.currentTarget.value
    });
  },

  render: function() {
    var checked = false;
    if (this.props.value === this.props.amount) {
      checked = true;
    }

    return (
      <div className="third">
        <input ref={(input) => {this.input = input;}} onChange={this.onChange} onClick={this.onClickEvent} checked={checked} className="amount-radio" type="radio" name="donation_amount" value={this.props.value} id={"amount-" + this.props.value}/>
        <label htmlFor={"amount-" + this.props.value} className="amount-button large-label-size">
          { this.props.currencyCode && this.props.value ?
            <FormattedNumber
              minimumFractionDigits={0}
              value={this.props.value}
              style="currency"
              currency={this.props.currencyCode}
            /> : <span>&nbsp;</span> }
        </label>
      </div>
    );
  }
});

var AmountOtherButton = React.createClass({
  contextTypes: {
    intl: React.PropTypes.object
  },
  propTypes: {
    checked: React.PropTypes.bool.isRequired,
    onRadioChange: React.PropTypes.func,
    onInputChange: React.PropTypes.func,
    amount: React.PropTypes.string,
    currencySymbol: React.PropTypes.string,
    placeholder: React.PropTypes.string
  },
  componentDidMount: function() {
    var inputValue = this.amountInputRef.inputRef.value;
    if (this.radioInput.checked) {
      this.setState({
        inputValue
      });
      this.props.onInputChange(inputValue);
    }
  },
  onRadioClick: function() {
    document.querySelector("#amount-other-input").focus();
    reactGA.event({
      category: "User Flow",
      action: "Changed Amount",
      label: "Other"
    });
  },
  onInputClick: function() {
    document.querySelector("#amount-other").click();
  },
  onRadioChange: function() {
    if (!this.props.checked) {
      this.props.onRadioChange();
    }
  },
  render: function() {
    return (
      <div className="two-third">
        <div className="amount-other-container">
          <input
            ref={(input) => {this.radioInput = input;}}
            id="amount-other"
            type="radio"
            name="donation_amount"
            checked={this.props.checked}
            onClick={this.onRadioClick}
            onChange={this.onRadioChange}
            value={this.props.amount}
          />
          <label htmlFor="amount-other" className="large-label-size">
            <span className="currency-symbol-container">
              { this.props.currencySymbol ?
                <span>{this.props.currencySymbol}</span> :
                <span>&nbsp;</span>
              }
            </span>
          </label>
          <div className="amount-other-wrapper">
            <AmountInput ref={(input) => {this.amountInputRef = input;}}
              id="amount-other-input"
              className="medium-label-size" type="text"
              onInputChange={this.props.onInputChange}
              amount={this.props.amount}
              onInputClick={this.onInputClick}
              placeholder={this.props.placeholder}
            />
          </div>
        </div>
      </div>
    );
  }
});

var AmountButtons = React.createClass({
  contextTypes: {
    intl: React.PropTypes.object
  },
  propTypes: {
    name: React.PropTypes.string
  },
  getInitialState: function() {
    return {
      // userInputting is used to override checked amount
      // buttons while the user is entering an other amount.
      userInputting: false
    };
  },
  onChange: function(position) {
    this.setState({
      userInputting: false
    });
    this.props.setPosition(position);
  },
  otherRadioChange: function() {
    this.setState({
      userInputting: true
    });
    this.props.setAmount("");
  },
  otherInputChange: function(newAmount) {
    this.setState({
      userInputting: true
    });
    this.props.setAmount(newAmount);
  },
  renderErrorMessage: function() {
    if (this.props.amountError === 'donation_min_error') {
      return (
        <FormattedMessage
          id={this.props.amountError}
          values={{minAmount:
            <span>
              { this.props.currency.code ?
                <FormattedNumber
                  maximumFractionDigits={2}
                  value={this.props.currency.minAmount}
                  style="currency"
                  currency={this.props.currency.code}
                /> : "" }
            </span>
          }}
        />
      );
    }
    if (this.props.amountError) {
      return this.context.intl.formatMessage({id: this.props.amountError});
    }
    return "";
  },
  render: function() {
    var otherAmount = "";
    var amount = this.props.amount;
    var presets = this.props.presets;
    var preset = presets.indexOf(amount);
    var userInputting = this.state.userInputting;
    var otherChecked = userInputting || !!(amount && preset < 0);

    if (otherChecked) {
      otherAmount = amount;
      amount = "";
    }
    var currency = this.props.currency;
    return (
      <div className="amount-buttons">
        <div className="row donation-amount-row">
          <AmountButton value={presets[0]} position={0}
            currencyCode={currency.code} amount={amount}
            onChange={this.onChange}/>
          <AmountButton value={presets[1]} position={1}
            currencyCode={currency.code} amount={amount}
            onChange={this.onChange}/>
          <AmountButton value={presets[2]} position={2}
            currencyCode={currency.code} amount={amount}
            onChange={this.onChange}/>
        </div>
        <div className="row donation-amount-row">
          <AmountButton value={presets[3]} position={3}
            currencyCode={currency.code} amount={amount}
            onChange={this.onChange}/>
          <AmountOtherButton amount={otherAmount}
            currencySymbol={currency.symbol}
            checked={otherChecked}
            onRadioChange={this.otherRadioChange}
            onInputChange={this.otherInputChange}
            placeholder={this.context.intl.formatMessage({id: 'other_amount'})}
          />
        </div>
        <ErrorMessage message={this.renderErrorMessage()}/>
      </div>
    );
  }
});

module.exports = connect(
  function(state) {
    return {
      amount: state.donateForm.amount,
      presets: state.donateForm.presets,
      currency: state.donateForm.currency,
      amountError: state.donateForm.amountError
    };
  },
  function(dispatch) {
    return {
      setAmount: function(data) {
        dispatch(setAmount(data));
      },
      setPosition: function(data) {
        dispatch(setPosition(data));
      }
    };
  })(AmountButtons);
