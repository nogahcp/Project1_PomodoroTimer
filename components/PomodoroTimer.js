import React from 'react';
import { Text, View, Button } from 'react-native';

import { styles } from './styles/PomodoroTimerStyles'

export default class PomodoroTimer extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      seconds: 0,
      minutes: 0,
      disableStart: false,
      isWork: false,
    }
    let timer
  }

  render() {
    return (
      <View style={ styles.container }>
        <Text style={ styles.timer }> {this.state.minutes} : {this.state.seconds} </Text>
        <Button title="Start" disabled={this.state.disableStart} onPress={() => this.start()} />
        <Button title="Stop" onPress={() => this.stop()} />
        <Button title="Reset" onPress={() => this.reset()} />
        <Text> is work:  {this.state.isWork.toString()} </Text>
      </View>
    )
  }

  start() {
    this.checkForRestartingTimer()
    this.timer = setInterval(()=> this.setTime(), 1000)
    this.setState({
      disableStart: true,
    })
  }

  setTime() {
    let seconds = this.state.seconds - 1
    let minutes = this.state.minutes
    //if seconds smaller than 0, new minutes
    if (seconds < 0) {
      seconds = 59
      minutes = minutes - 1
    }
    this.setState({
      minutes,
      seconds
    })
    this.checkForRestartingTimer()
  }

  //if reached to end - update timer and vibrate
  checkForRestartingTimer() {
    if (this.state.seconds === 0 && this.state.minutes === 0) {
      //start timer according to prev "task"
      if (this.state.isWork) {
        this.startBreak()
      } else {
        this.startWork()
      }
      //// TODO: vibrate
    }
  }

  startWork() {
    this.setState({
      minutes: 25,
      seconds: 0,
      isWork: true,
    })
  }

  startBreak() {
    this.setState({
      minutes: 5,
      seconds: 0,
      isWork: false,
    })
  }

  stop() {
    clearInterval(this.timer)
    this.setState({
      disableStart: false,
    })
  }

  reset() {
    this.setState({
      seconds: 0,
      minutes: 0,
      disableStart: false,
      isWork: false,
    })
    clearInterval(this.timer)
  }
}
