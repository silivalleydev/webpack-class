import React, { Component } from 'react';
import Banner from '@C/header/Banner';
import Body from '@C/body/Body';
import { hot } from 'react-hot-loader';

class App extends Component {
  render() {
    return (
      <>
        <Banner />
        <Body />
      </>
    )
  }
}

// 루트 컴포넌트에 핫 모듈 설정을 해주면, 각 모듈의 코드 변경시 state가 초기화 되지 않는다.
export default hot(module)(App);