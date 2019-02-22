import React from "react";
import m from "moment";
import { clone } from "lodash";

import "./Calender.css";
import Logo from "./assets/Netflix_Logo_RGB.png";

class Calendar extends React.Component {
  state = {
    currentMonth: new Date(),
    currentMonthf: m(new Date()),
    releases: [],
    thisMonthReleases: [],
    fetching: true
  };

  componentDidMount() {
    fetch("/releases")
      .then(response => {
        if (!response.ok) {
          throw new Error(`status ${response.status}`);
        }
        return response.json();
      })
      .then(json => {
        this.setState({
          releases: json.data,
          fetching: false
        });
      })
      .catch(e => {
        this.setState({
          releases: `API call failed: ${e}`,
          fetching: false
        });
      });
  }

  renderHeader = () => {
    return (
      <div className="header">
        <div className="prev">
          <div className="icon" onClick={this.prev} />
        </div>
        <div className="month-header">
          <h1>{m(this.state.currentMonth).format("MMMM  YYYY")}</h1>
        </div>
        <div className="next">
          <div className="icon" onClick={this.next} />
        </div>
      </div>
    );
  };

  next = () => {
    this.setState({
      currentMonth: m(this.state.currentMonth).add(1, "M")
    });
  };
  prev = () => {
    this.setState({
      currentMonth: m(this.state.currentMonth).add(-1, "M")
    });
  };

  findRelease = date => {
    const formattedDate = m(date).format("L");
    return this.state.releases.filter(
      node => m(node.launch_date).format("L") === formattedDate
    );
  };

  renderDay = (date, month) => {
    const day = {
      name: m(date)
        .format("dd")
        .substring(0, 1),
      number: m(date).date(),
      hasReleaseToday: this.findRelease(date),
      isCurrentMonth: m(date).month() === m(month).month(),
      isToday: m(date).isSame(new Date(), "day"),
      date: m(date)
    };
    let monthDiff = day.isCurrentMonth ? "" : " month-diff",
      today = day.isToday ? " is-today" : "",
      releaseCheck = day.hasReleaseToday.length > 0,
      hasRelease = releaseCheck ? " release-today" : "",
      releaseTitle = releaseCheck ? day.hasReleaseToday[0].title : "";

    return (
      <div
        className={"day" + monthDiff + today + hasRelease}
        key={day.date.toString()}
      >
        <h3 className="day-label">{day.number}</h3>
        <div className="release">{releaseTitle}</div>
      </div>
    );
  };
  renderWeek = (day, month) => {
    const days = [];
    let date = day;
    for (var i = 0; i < 7; i++) {
      days.push(this.renderDay(date, month));
      date = clone(m(date).add(1, "d"));
    }
    return (
      <div className="week" key={date.toString()}>
        {days}
      </div>
    );
  };

  renderMonth = () => {
    let weeks = [],
      finish = false,
      date = clone(
        m(this.state.currentMonth)
          .startOf("month")
          .add("w" - 1)
          .day("Sunday")
      ),
      monthIndx = m(date).month(),
      count = 0;

    while (!finish) {
      weeks.push(this.renderWeek(date, this.state.currentMonth));
      date.add(1, "w");
      finish = count++ > 2 && monthIndx !== date.month();
      monthIndx = date.month();
    }
    return weeks;
  };
  render() {
    return (
      <section className="calender-container">
        {this.renderHeader()}
        <div className="week">
          <div className="week-days">SUNDAY</div>
          <div className="week-days">MONDAY</div>
          <div className="week-days">TUESDAY</div>
          <div className="week-days">WEDNESDAY</div>
          <div className="week-days">THURSDAY</div>
          <div className="week-days">FRIDAY</div>
          <div className="week-days">SATURDAY</div>
        </div>
        <div className="calender-cells">{this.renderMonth()}</div>
        <footer>
          <img src={Logo} alt="" width="150" />
        </footer>
      </section>
    );
  }
}

export default Calendar;
