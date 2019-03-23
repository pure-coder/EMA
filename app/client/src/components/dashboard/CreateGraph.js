import React, {Component} from 'react';

class CreateGraph extends Component {
    constructor(props){
        super(props)
    }

    render(){
        return (
            <h1>Hello, {this.props.data.exerciseName}</h1>
        )
    }
}
export default CreateGraph;
