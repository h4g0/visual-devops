/**
 * @license
 *
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @fileoverview Main React component that includes the Blockly component.
 * @author samelh@google.com (Sam El-Husseini)
 */

import React from 'react';
import './App.css';

import logo from './logo.svg';

import BlocklyComponent, { Block, Value, Field, Shadow } from './Blockly';


import './blocks/customblocks'

import { LPGenerator } from './generator/generator';
import Model from './model/model'

import {createStore} from 'redux'
import dataStore from './update_state/Store';
import { Provider } from 'react-redux';
import { clearModel } from './update_state/Actions';

//const electron = window.require('electron')
//const ipcRenderer =  electron.ipcRenderer

/*
function sendVariables() {
      var result = ipcRenderer.sendSync('synchronous-message','sendVariables')
      console.log(result)
}
*/

class App extends React.Component {
  simpleWorkspace: any

  constructor(props: any) {
    super(props);
    this.simpleWorkspace = React.createRef();
  }

  generateCode = () =>  {
    dataStore.dispatch( clearModel({}) )
    
    const code = LPGenerator.workspaceToCode(
      this.simpleWorkspace.current.workspace
    );
    const variables = "variables"
    //sendVariables(variables)
    console.log(code);
  }

  render() {
    return (
      <Provider store={dataStore} >
      <div>
        <Model generator={this.generateCode}/>
          <BlocklyComponent ref={this.simpleWorkspace}
          readOnly={false} trashcan={true} media={'media/'}
          move={{
            scrollbars: true,
            drag: true,
            wheel: true,
          }}
          sounds={true}
          initialXml={`
<xml xmlns="http://www.w3.org/1999/xhtml">
</xml>
      `}>
            <Block type = "variables" />
            <Block type = "constraints" />
            <Block type = "constraint" /> 
            <Block type = "objective" />
            <Block type = "new_single_variable" />
            <Block type = "new_col_variable" />
            <Block type = "new_matrix_variable"/>
            <Block type = "col_val_address" />
            <Block type = "single_variable" />
            <Block type = "col_variable"/>
            <Block type = "matrix_variable" />
            <Block type = "number" />
            <Block type = "operation" />
          </BlocklyComponent>
      </div>
      </Provider>
    );
  }
}

export default App;
