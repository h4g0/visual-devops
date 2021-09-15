import Constraints from './constraints'
import Variables from './variables'
import Objective from './objective'
import Data from './data/data'

import React from 'react'
import './model.css'
import { Options } from './options/options'
import Result from './result'

function Model(props: any) {

    const generator = props.generator

    return (

         <div className="model">
           
          <div className="variables-constraints-options">

          <Variables />
       
          <Constraints />
       
          <Options generator={generator}/>

          </div>

            <div className="objective-result-data"> 
          <Objective />

          <Result />
          

            <Data /> 
            </div>
         </div>
    )
}

export default Model