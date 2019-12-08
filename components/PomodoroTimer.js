import React from 'react'
import { Text, View, Button, Vibration, TextInput, Keyboard, ScrollView } from 'react-native'

import { styles } from './styles/PomodoroTimerStyles'

export default class PomodoroTimer extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      seconds: 0,
      minutes: 0,
      disableStart: false,
      isWork: false,
      workTime: 25,
      breakTime: 5,
      dialogVisible: false,
      newWorkTime: 25,
      newBreakTime: 5,
    }
    let timer
  }

  render() {
    return (
      <ScrollView style={{flex: 1 }} contentContainerStyle={styles.container} keyboardShouldPersistTaps={false}>
        <Text style={{fontSize: 30}}> Pomodoro Timer </Text>
        <Text style={ styles.timer }> {this.state.minutes} : {this.state.seconds} </Text>
        <View style={{margin:10}}>
          <Button title="Start" disabled={this.state.disableStart} onPress={() => this.start()} />
        </View>
        <View style={{margin:10}}>
          <Button title="Stop" onPress={() => this.stop()} />
        </View>
        <View style={{margin:10}}>
          <Button title="Reset" onPress={() => this.reset()} />
        </View>
        <View style={ styles.changeTimesContainer }>
          <View style={ styles.timeInputContainer }>
            <Text style={ styles.input }> Work Time (in minutes): </Text>
            <TextInput
              onChangeText={text => this.handleWorkTimeChange(text)}
              value={ this.state.newWorkTime.toString() }
              keyboardType='numeric'
              style={ styles.input }
            />
          </View>
          <View style={ styles.timeInputContainer }>
            <Text style={ styles.input }> Break Time (in minutes): </Text>
            <TextInput
              onChangeText={text => this.handleBreakTimeChange(text)}
              value={ this.state.newBreakTime.toString() }
              keyboardType='numeric'
              style={ styles.input }
            />
          </View>
          <Button title="Set New Work/Break Times" onPress={() => this.setWorkAndBreakTimes()} />
        </View>
      </ScrollView>
    )
  }

  handleWorkTimeChange(text) {
    //only integer
    if (!text.includes('.')) {
      const number = (text.length > 0) ? Number(text) : 0
      if (number >= 0) {
        this.setState({newWorkTime: number})
      }
    }
  }

  handleBreakTimeChange(text) {
    //only integer
    if (!text.includes('.')) {
      const number = (text.length > 0) ? Number(text) : 0
      if (number >= 0) {
        this.setState({newBreakTime: number})
      }
    }
  }

  //update state with new values of work/break, and reset timer
  setWorkAndBreakTimes() {
    const workTime = this.state.newWorkTime
    const breakTime = this.state.newBreakTime
    this.setState({
      workTime,
      breakTime,
    })
    //reset current timer
    this.reset()
    Keyboard.dismiss()
  }

  //start timer
  start() {
    this.checkForRestartingTimer()
    this.timer = setInterval(()=> this.setTime(), 1000)
    this.setState({
      disableStart: true,
    })
  }

  //update time left and update state
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
      Vibration.vibrate(1000)
    }
  }

  //update state to start "work"
  startWork() {
    this.setState({
      minutes: this.state.workTime,
      seconds: 0,
      isWork: true,
    })
  }

  //update state to start "break"
  startBreak() {
    this.setState({
      minutes: this.state.breakTime,
      seconds: 0,
      isWork: false,
    })
  }

  //stop timer
  stop() {
    clearInterval(this.timer)
    this.setState({
      disableStart: false,
    })
  }

  //reset timer
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
