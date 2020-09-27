import React, {useEffect, useState} from 'react';
import AdminBoilerplate from "../AdminBoilerplate";
import {Box, Paper} from "@material-ui/core";
import EditLibraryMapCard from "./EditLibraryMapCard";
import UploadLibraryMapForm from "./UploadLibraryMapForm";
import Snackbar from "@material-ui/core/Snackbar";
import Alert from "@material-ui/lab/Alert";
import * as axios from "axios";
import CircularProgress from "@material-ui/core/CircularProgress";

const EditLibraryMapPage = () => {

    const [openErrorSnackbar, setOpenErrorSnackbar] = React.useState(false);
    const [openSuccessSnackbar, setOpenSuccessSnackbar] = React.useState(false);
    const [libraryMaps, setLibraryMaps] = useState([]);

    // <CircularProgress color="inherit" size={20}/>

    const loading = libraryMaps.length === 0;

    useEffect(() => {
        if (!loading) {
            return undefined;
        }
        getLibraryMaps();
    }, [loading]);

    const getLibraryMaps = () => {
        axios.get('library-maps/get-library-maps').then(result => {
            setLibraryMaps(result.data);
        }).catch(err => {
            console.log(err.toString());
        })
    }

    return (
        <div>
            <AdminBoilerplate page={'library_map'}/>
            <div className="content">
                <Paper style={{padding: 20}}>
                    {!loading?<EditLibraryMapCard
                        libraryMaps={libraryMaps}
                        onShowErrorSnackbar={(status) => setOpenErrorSnackbar(status)}
                        onShowSuccessSnackbar={(status) => setOpenSuccessSnackbar(status)}
                        onUpdateLibraryMap={getLibraryMaps}
                    />:
                        <Box width="100%" display="flex" justifyContent="center">
                            <CircularProgress color="inherit" size={20}/>
                        </Box>
                        }

                    <UploadLibraryMapForm
                        onUpdateLibraryMap={getLibraryMaps}
                        onShowErrorSnackbar={(status) => setOpenErrorSnackbar(status)}
                        onShowSuccessSnackbar={(status) => setOpenSuccessSnackbar(status)}
                    />

                    <Snackbar open={openErrorSnackbar} autoHideDuration={3000} onClose={() => {
                        setOpenErrorSnackbar(false)
                    }}>
                        <Alert onClose={() => {
                            setOpenErrorSnackbar(false)
                        }} severity="error">
                            Error occured. Please try again later
                        </Alert>
                    </Snackbar>

                    <Snackbar open={openSuccessSnackbar} autoHideDuration={3000} onClose={() => {
                        setOpenSuccessSnackbar(false)
                    }}>
                        <Alert onClose={() => {
                            setOpenSuccessSnackbar(false)
                        }} severity="success">
                            This is a success message!
                        </Alert>
                    </Snackbar>
                </Paper>
            </div>
        </div>
    );
};

export default EditLibraryMapPage;