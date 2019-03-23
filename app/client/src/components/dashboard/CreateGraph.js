import React, {Component} from 'react';
import {addGraph} from "../../utilities/drawProgressGraph";

class CreateGraph extends Component {
    // constructor(props){
    //     super(props)
    // }

    sortedProgressionMap(data){
        return data.sort((obj1, obj2) => {
            return new Date(obj1.Date) - new Date(obj2.Date);
        });
    }; // sortedMap

    componentDidMount(){
        let exerciseToId = this.props.data.exerciseName.replace(/\s+/g, '-');
        const metrics = this.sortedProgressionMap(this.props.data.metrics)
        addGraph(metrics, '.' + exerciseToId);
    }

    render(){

        return (
            <div className={this.props.data.exerciseName.replace(/\s+/g, '-') + " graph"}>
                {console.log(2)}
            </div>
        )
    }
}
export default CreateGraph;
