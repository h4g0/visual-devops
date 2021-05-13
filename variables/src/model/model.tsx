import Constraints from './constraints'
import Variables from './variables'
import Objective from './objective'
import Data from './data'

import React from 'react'
import './model.css'

class Model extends React.Component {


    render() {

        return <div className="model">
       
          <Variables />
       
          <Constraints />
       
            <div className="objective-data-container"> 
          <Objective />

            <Data /> 
            </div>
         </div>
    }
}

export default Model