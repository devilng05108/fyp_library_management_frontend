import React, {Component} from 'react';
import {Button, Grid, InputLabel, MenuItem, Paper, Select, TextField} from "@material-ui/core";
import StudentBoilerplate from "./../student/StudentBoilerplate";
import {isEmpty} from "./../../util/StringUtils";
import axios from 'axios';
import FormControl from "@material-ui/core/FormControl";
import AlertDialog from "./../../components/AlertDialog";

class StudentAccountRegistrationPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            file: {},
            email: '',
            role: '',
            successDialog: {
                showSuccessDialog: false,
            },
            errorDialog: {
                showErrorDialog: false,
                errorMessage: '',
            },
        }
    }

    componentDidMount() {
        axios.get('users/get-registration-csv',{params:{role:'teacher'}}).then(res=>{
            this.setState({
                csvFormatLink:res.data,
            })
        });
        axios.get('roles/teacher/get-roles').then(res => {
            console.log(res.data);
            this.setState({
                role: res.data[0].id,
            });
        });
    }


    onChangeFile = (e) => {
        this.setState({file: e.target.files[0]})
    };

    onChangeForm = (name, value) => {
        if (isEmpty(value)) {

        }
        this.setState({
            [name]: value,
        });
    };

    onSubmit = (e) => {
        e.preventDefault();
        this.fileUpload();
    };

    fileUpload = () => {
        const url = 'users/register-user';
        const allowedRoles = [this.state.role];
        const formData = new FormData();
        formData.append('file', this.state.file);
        formData.append('email', this.state.email);
        formData.append('role', this.state.role);
        formData.append('registrationLinkPrefix',window.location.origin+'/account-registration');
        formData.append('allowedRoles',allowedRoles);

        const config = {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        };
        return axios.post(url, formData, config).then(res=>{
            this.setState({
                successDialog: {
                    showSuccessDialog: true,
                }
            });
        }).catch(err=>{
            if (err) {
                const errMessage = err.response.data?err.response.data.message:err.toString();
                this.setState({
                    errorDialog: {
                        showErrorDialog: true,
                        errorMessage: errMessage,
                    }
                });
            }
        })
    };

    onCloseErrorDialog = () => {
        this.setState({
            errorDialog: {
                showErrorDialog: false,
                errorMessage: '',
            }
        });
    };

    onCloseSuccessDialog = () => {
        this.setState({
            successDialog: {
                showSucessDialog: false,
            }
        });
    };

    render() {
        return (
            <div>
                <StudentBoilerplate page={"studentregistration"}/>
                <div className="content">
                    <Paper style={{padding: 20}}>
                        <h2 className="textCenter">Account Registration</h2>
                        <form onSubmit={this.onSubmit} noValidate autoComplete="off">
                            <div className="flex-justify-center" style={{marginTop: 15}}>

                                <Button
                                    variant="contained"
                                    component="label"
                                    color="primary"
                                >
                                    Upload Excel file of student list
                                    <input
                                        name="file"
                                        type="file"
                                        style={{display: "none"}}
                                        onChange={this.onChangeFile}
                                    />
                                </Button>
                            </div>
                            {this.state.file.name?(<p className="textCenter">Selected file:&nbsp;{this.state.file.name}</p>):''}
                            <p className="textCenter" style={{color: 'red'}}>*Create accounts for students by uploading CSV
                                file, a verification link will be sent to the lists of email addresses</p>
                            <p className="flex-justify-center">Download the csv format&nbsp;<a href={this.state.csvFormatLink}>here</a>.</p>


                            <Grid container direction="row" justify="center">
                                <Grid item md={8} lg={5}>
                                    <TextField
                                        label="Email Address"
                                        name="email"
                                        // error={this.state.formValidation.error && this.state.formValidation.reason !== ''}
                                        // helperText={this.state.formValidation.reason}
                                        fullWidth
                                        required
                                        variant="outlined"
                                        onChange={e => this.onChangeForm(e.target.name, e.target.value)}
                                    />
                                </Grid>
                            </Grid>
                            <div className="flex-justify-center" style={{marginTop: 15}}>
                                <Button
                                    variant="contained"
                                    type="submit"
                                    color="primary"
                                >Submit</Button>
                            </div>
                        </form>
                    </Paper>
                </div>
                <AlertDialog
                    showAlertModal={this.state.errorDialog.showErrorDialog}
                    title={'Error'}
                    desc={this.state.errorDialog.errorMessage}
                    onCloseConfirmationModal={this.onCloseErrorDialog}
                />
                <AlertDialog
                    showAlertModal={this.state.successDialog.showSuccessDialog}
                    title={'Success'}
                    desc={'Account registration request success'}
                    onCloseConfirmationModal={this.onCloseSuccessDialog}
                />
            </div>
        );
    }
}

export default StudentAccountRegistrationPage;