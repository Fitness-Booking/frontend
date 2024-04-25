import { timestamp } from 'rxjs/internal/operators/timestamp';

const MILLISECONDS_IN_A_SECOND = 1000;
const SECONDS_IN_A_MINUTE = 60;
const MINUTES_IN_AN_HOUR = 60;
const HOURS_IN_A_DAY = 24;
const DAYS_IN_A_WEEK = 7;

const MILLISECONDS_IN_A_MINUTE = MILLISECONDS_IN_A_SECOND * SECONDS_IN_A_MINUTE;
const MILLISECONDS_IN_AN_HOUR = MILLISECONDS_IN_A_MINUTE * MINUTES_IN_AN_HOUR;
const MILLISECONDS_IN_A_DAY = MILLISECONDS_IN_AN_HOUR * HOURS_IN_A_DAY;
const MILLISECONDS_IN_A_WEEK = MILLISECONDS_IN_A_DAY * DAYS_IN_A_WEEK;


export class TimeSpan {

  constructor(milliseconds: number = 0) {
    this._milliseconds = milliseconds;
    this._totalMilliSeconds = milliseconds;
    this._seconds = 0;
    this._minutes = 0;
    this._hours = 0;

    this.calcMilliSeconds();
  }

  get hours(): number {
		return this._hours;
	}
	set hours(value: number) {
    console.log("set hours", value)
		if (isNaN(value)) {
			value = 0;
		}
		this._hours = value;
		this.calcMilliSeconds();
	}

	get minutes(): number {
		return this._minutes;
	}
	set minutes(value: number) {
		if (isNaN(value)) {
			value = 0;
		}
		this._minutes = value;
		this.calcMilliSeconds();
	}

	get seconds(): number {
		return this._seconds;
	}
	set seconds(value: number) {
		this._seconds = value;
		this.calcMilliSeconds();
	}

	get milliseconds(): number {
		return this._milliseconds;
	}
	set milliseconds(value: number) {
		if (isNaN(value)) {
			value = 0;
		}
		this._milliseconds = value;
		this.calcMilliSeconds();
	}

	get TotalMilliSeconds() {
		return this._totalMilliSeconds;
	}

	get TotalSeconds() {
		return Math.round(this._totalMilliSeconds / MILLISECONDS_IN_A_SECOND);
	}

	get TotalMinutes() {
		return Math.round(this._totalMilliSeconds / MILLISECONDS_IN_A_MINUTE);
	}

	get TotalHours() {
		return Math.round(this._totalMilliSeconds / MILLISECONDS_IN_AN_HOUR);
	}
	private _milliseconds; number;
	private _totalMilliSeconds: number;
	private _seconds: number;
	private _minutes: number;
	private _hours: number;

	static Subtract(date1: any, date2: any) {
		let milliSeconds: number = date1 - date2;

		return new TimeSpan(milliSeconds);

	}

	static Day(): TimeSpan {
		return new TimeSpan(MILLISECONDS_IN_A_DAY);
	}
	static Hour(): TimeSpan { return new TimeSpan(MILLISECONDS_IN_AN_HOUR); }
	static Week(): TimeSpan { return new TimeSpan(MILLISECONDS_IN_A_WEEK) }	static Month(): TimeSpan {
		let now: any = new Date();
		let aMonthAgo: any = new Date();
		aMonthAgo.setMonth(aMonthAgo.getMonth() - 1);
		return new TimeSpan(now - aMonthAgo);
	}
	static FromStringToTimeSpan(str: string): TimeSpan {
    let dataFromStr = str.split(':');

    return new TimeSpan((MILLISECONDS_IN_AN_HOUR * +dataFromStr[0]) + MILLISECONDS_IN_A_MINUTE * +dataFromStr[1]);
  }

  static toStringValue(seconds: number): string {
    let time = new TimeSpan(seconds * MILLISECONDS_IN_A_SECOND);
    let leftValue = time.hours;
    let rightValue = time.minutes;
    let answer: string = "";
    answer = TimeSpan.appendAnswer(answer, leftValue) + ":";
    answer = TimeSpan.appendAnswer(answer, rightValue);
    return answer;
  }

  static appendAnswer(str: string, value: number): string {
    if (value < 10) {
      return str += "0" + value.toString();
    }
    return str += value.toString();
  }
	addTo(date: Date): Date {
		console.log('add ' + this.TotalMilliSeconds, this);
		date.setMilliseconds(date.getMilliseconds() + this.TotalMilliSeconds);

		return date;
	}

	subtructFrom(date: Date): Date {
		date.setMilliseconds(date.getMilliseconds() - this.TotalMilliSeconds);

		return date;
	}



	roundValue(origValue, maxValue) {
		return { modulu: origValue % maxValue, addition: Math.round(origValue / maxValue) };
	}



	calcMilliSeconds() {

		let newMilliSecond = this.roundValue(this._milliseconds, MILLISECONDS_IN_A_SECOND);
		this._milliseconds = newMilliSecond.modulu;
		this._seconds += newMilliSecond.addition;

		let newSecond = this.roundValue(this._seconds, SECONDS_IN_A_MINUTE);
		this._seconds = newSecond.modulu;
		this._minutes += newSecond.addition;

		let newminutes = this.roundValue(this._minutes, MINUTES_IN_AN_HOUR);
		this._minutes = newminutes.modulu;
		this._hours += newminutes.addition;

		this._totalMilliSeconds = this.hours * MILLISECONDS_IN_AN_HOUR + this.minutes * MILLISECONDS_IN_A_MINUTE
			+ this.seconds * MILLISECONDS_IN_A_SECOND + this.milliseconds;
	}

}
