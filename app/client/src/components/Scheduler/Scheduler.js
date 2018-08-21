import React, {Component} from 'react';
import '../../../node_modules/dhtmlx-scheduler/codebase/dhtmlxscheduler.js';

class Scheduler extends Component {

    // // add init() function to only the scheduler route in index.html (located in public folder) before the component is rendered
    // componentDidMount() {
    //     document.getElementsByTagName('body')[0].setAttribute('onload', 'init();');
    // }

    render() {
        return (
                <div id="scheduler" className="dhx_cal_container scheduler">
                    <div className="dhx_cal_navline">
                        <div className="dhx_cal_prev_button">&nbsp;</div>
                        <div className="dhx_cal_next_button">&nbsp;</div>
                        <div className="dhx_cal_today_button"></div>
                        <div className="dhx_cal_date"></div>
                        <div className="dhx_cal_tab" name="day_tab"></div>
                        <div className="dhx_cal_tab" name="week_tab"></div>
                        <div className="dhx_cal_tab" name="month_tab"></div>
                    </div>
                    <div className="dhx_cal_header">
                    </div>
                    <div className="dhx_cal_data">
                    </div>
                </div>
        );
    }
}

export default Scheduler;

