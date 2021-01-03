import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import moment from 'moment';
import { range, takeWhile, last } from 'lodash';
// import 'moment/locale/nb'; // Use to show Months in local format
import registerServiceWorker from './registerServiceWorker'

/**
* Calender Component
*/
class CalendarComponent extends React.Component {

  // Sets Default values
  static defaultProps = {
    date: moment(),
    renderDay: day => day.format('D')
  };

  // Created the dates that are to be seen in the calendar
  createDateObjects = (date, weekOffset = 0) => {
      const highLightDate = date.date();
      const startOfMonth = date.startOf('month');

      let diff = startOfMonth.weekday() - weekOffset;
      if (diff < 0) diff += 7;

      // Creating the dates of previous month that are to be seen in current month of calendar
      const prevMonthDays = range(0, diff).map(n => ({
        day: startOfMonth.clone().subtract(diff - n, 'days'),
        classNames: 'prevMonth'
      }));

      const currentMonthDays = range(1, date.daysInMonth() + 1).map(index => ({
        day: moment([date.year(), date.month(), index]),
        classNames: ((highLightDate === index) ? 'Highlight-date' : '')
      }));

      // Creating the dates of next month that are to be seen in current month of calendar
      const daysAdded = prevMonthDays.length + currentMonthDays.length - 1;
      const nextMonthDays = takeWhile(
        range(1, 7),
        n => (daysAdded + n) % 7 !== 0
      ).map(n => ({
        day: last(currentMonthDays).day.clone().add(n, 'days'),
        classNames: 'nextMonth'
      }));

      return [...prevMonthDays, ...currentMonthDays, ...nextMonthDays];
    }

  // Uses a exceptions handling for invalid date input
  getDate = () => {
    return (moment(this.props.date).isValid() ? this.props.date : moment());
  };

  // used for navigating to next month
  handleNextMonth = () => {
    const date = this.getDate();
   this.props.changeDate(date.clone().add(1, 'months'));
  };

  // used for navigating to prev month
  handlePrevMonth = () => {
    const date = this.getDate();
    this.props.changeDate(date.clone().subtract(1, 'months'));
  };

  render() {
    const {
      renderDay
    } = this.props;
    // const renderDay = this.props.renderDay;

    const weekdays = [
        "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
    ];
    const date = this.getDate();

    return (
      <div className="Calendar">
        <div className="Calendar-header">
          <button onClick={this.handlePrevMonth}>«</button>
          <div className="Calendar-header-currentDate">
            {date.format('MMMM YYYY')}
          </div>
          <button onClick={this.handleNextMonth}>»</button>
        </div>
        <div className="Calendar-grid">
          {
            weekdays.map((day, i) => (
              <div
                key={`week-${i}`}
                className={`Calendar-grid-item ${day.classNames || ''}`}
              >
                {day}
              </div>
            ))
          }
          {this.createDateObjects(date).map((day, i) => (
            <div
              key={`day-${i}`}
              className={`Calendar-grid-item ${day.classNames || ''}`}
              onClick={e => this.props.changeDate(day.day)}
            >
              {renderDay(day.day)}
            </div>
          ))}
        </div>
      </div>
    );
  }
}

/**
* Usage of calender component
*/
class Calendar extends React.Component {
  constructor(props){
    super(props);
    this.state = { };
    this.changeDate = this.changeDate.bind(this);
  }
  changeDate = (date) => {
    this.setState({ date })
  }
  render() {
    return (
      <CalendarComponent
        changeDate={this.changeDate}
        date={this.state.date}
      />
    );
  }
};


ReactDOM.render(<Calendar />, document.getElementById('root'));
registerServiceWorker();
