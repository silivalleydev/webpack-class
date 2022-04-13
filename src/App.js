import React, { Component } from 'react';
import Banner from '@C/header/Banner';
import Body from '@C/body/Body';

export default class App extends Component {
  render() {
    return (
      <>
        <Banner />
        <Body />
      </>
    )
  }
}
