import React, {Component} from 'react';

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            Email: '',
            Password: '',
            errors: {}
        }

        // This sets the state value to it's respective state (via binding)
        this.onChange = this.onChange.bind(this);

        // This binds the onSubmit function to this.OnSubmit
        this.onSubmit = this.onSubmit.bind(this);
    }

    // This captures what the user types and sets the specific input to the respective state variable
    onChange(event) {
        // event.target.name is used instead of a specific named state (ie "event.target.FullName") as there is more then
        // one, making it easier to capture all of them with this onChange function.
        this.setState({[event.target.name]: event.target.value})
    }

    onSubmit(event){
        event.preventDefault();

        const newUser = {
            Email: this.state.Email,
            Password: this.state.Password,
        }
        console.log(newUser);
    }


    render() {
        return (
            <div className="login">
                <div className="container  container-custom">
                    <div className="row">
                        <div className="col-md-8 m-auto">
                            <h1 className="text-center display-5">Log In</h1>
                            <p className="description text-center">Sign into Fitness App account</p>
                            <form onSubmit={this.onSubmit}>  {/* onSubmit used instead of normal action*/}
                                <div className="form-group">
                                    <input type="email"
                                           className="form-control form-control-lg"
                                           placeholder="Email Address"
                                           name="Email"
                                           value={this.state.Email}
                                           onChange={this.onChange}
                                           required />
                                </div>
                                <div className="form-group">
                                    <input type="password"
                                           className="form-control form-control-lg"
                                           placeholder="Password"
                                           name="Password"
                                           value={this.state.Password}
                                           onChange={this.onChange}
                                           required/>
                                </div>
                                <input type="submit" className="btn btn-info btn-block mt-5"/>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

        );
    }
}

export default Login;
