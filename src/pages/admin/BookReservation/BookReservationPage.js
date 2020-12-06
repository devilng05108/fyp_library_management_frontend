import React from 'react';
import AdminBoilerplate from "../AdminBoilerplate";
import {useSnackbar} from "notistack";
import axios from "axios";
import EnhancedTable from "../../../components/EnhancedTable";
import DateFnsUtils from "@date-io/date-fns";
import CustomModal from "../../../components/CustomModal";
import {KeyboardDatePicker, MuiPickersUtilsProvider} from "@material-ui/pickers";
import {TextField} from "@material-ui/core";


const RequestType = {
    ACCEPT: 'accept',
    REJECT: 'reject',
};

const CompletedBookReservation = () => {
    const [bookRequests, setBookRequests] = React.useState([]);
    const {enqueueSnackbar} = useSnackbar();

    React.useEffect(() => {
        retrieveData();
    }, []);

    const headCells = [
        {id: 'id', numeric: true, disablePadding: false, label: 'Book Request ID'},
        {id: 'bookId', numeric: true, disablePadding: false, label: 'Book ID'},
        {id: 'bookimg', numeric: false, type: 'img', disablePadding: false, label: 'Book Cover'},
        {id: 'title', numeric: false, disablePadding: false, label: 'Book Title'},
        {id: 'requestCreatedDate', numeric: false, type: 'date', disablePadding: false, label: 'Created Date'},
        {id: 'userId', numeric: true, disablePadding: false, label: 'User ID'},
        {id: 'username', numeric: false, type: 'date', disablePadding: false, label: 'Username'},
        {id: 'status', numeric: false, disablePadding: false, label: 'Status'},
    ];

    const retrieveData = () => {
        axios.post('book-request/find-all-completed-book-reservations').then(result => {
            setBookRequests(result.data);
        }).catch(err => {
            enqueueSnackbar('Error occured. Please Try Again Later', {variant: 'error', transitionDuration: 1000});
        });
    };

    return (
        <div>
            <h2>Completed Book Reservation</h2>
            <EnhancedTable
                headCells={headCells}
                rows={bookRequests}
                disableToolbar
            />
        </div>
    );
};


const BookReservationPage = () => {
    const [bookRequests, setBookRequests] = React.useState([]);
    const {enqueueSnackbar} = useSnackbar();
    const [startDate, setStartDate] = React.useState(new Date().now);
    const [expiryDate, setExpiryDate] = React.useState(new Date().now);
    const [rejectReason, setRejectReason] = React.useState('');
    const [selectedBookRequestId, setSelectedBookRequestId] = React.useState(-1);
    const [showAlertModal, setShowAlertModal] = React.useState(false);
    const [requestType, setRequestType] = React.useState(RequestType.ACCEPT);

    React.useEffect(() => {
        retrieveData();
    }, []);

    const headCells = [
        {id: 'id', numeric: true, disablePadding: false, label: 'Book Request ID'},
        {id: 'bookId', numeric: true, disablePadding: false, label: 'Book ID'},
        {id: 'bookimg', numeric: false, type: 'img', disablePadding: false, label: 'Book Cover'},
        {id: 'title', numeric: false, disablePadding: false, label: 'Book Title'},
        {id: 'requestCreatedDate', numeric: false, type: 'date', disablePadding: false, label: 'Created Date'},
        {id: 'userId', numeric: true, disablePadding: false, label: 'User ID'},
        {id: 'username', numeric: false, type: 'date', disablePadding: false, label: 'Username'},
        {id: 'status', numeric: false, disablePadding: false, label: 'Status'},
    ];

    const retrieveData = () => {
        axios.post('book-request/find-all-pending-book-reservations').then(result => {
            setBookRequests(result.data);
        }).catch(err => {
            enqueueSnackbar('Error occured. Please Try Again Later', {variant: 'error', transitionDuration: 1000});
        });
    };

    const acceptBookReservationRequest = (bookRequestId) => {
        setSelectedBookRequestId(bookRequestId);
        setRequestType(RequestType.ACCEPT);
        setShowAlertModal(true);
    };

    const rejectBookReservationRequest = (bookRequestId) => {
        setSelectedBookRequestId(bookRequestId);
        setRequestType(RequestType.REJECT);
        setShowAlertModal(true);
    };

    const resetAlertModal = () => {
        setShowAlertModal(false);
        setExpiryDate(new Date().now);
        setRejectReason('');
    };


    const InsertDateModalContent = (
        <div>
            <KeyboardDatePicker
                disablePast
                disableToolbar
                style={{width: '94%'}}
                variant="inline"
                inputVariant="outlined"
                format="dd-MMM-yyyy"
                margin="normal"
                id="date-picker-inline"
                label="Start Date"
                name="startDate"
                value={startDate}
                onChange={(e, value) => setStartDate(value)}
                KeyboardButtonProps={{
                    'aria-label': 'change date',
                }}
            />
            <KeyboardDatePicker
                disablePast
                disableToolbar
                style={{width: '94%'}}
                variant="inline"
                inputVariant="outlined"
                format="dd-MMM-yyyy"
                margin="normal"
                id="date-picker-inline"
                label="Expiry Date"
                name="expiryDate"
                value={expiryDate}
                onChange={(e, value) => setExpiryDate(value)}
                KeyboardButtonProps={{
                    'aria-label': 'change date',
                }}
            />
        </div>
    );

    const InsertRejectReasonModalContent = (
        <TextField
            autoFocus
            label="Reject Reason"
            name="rejectReason"
            value={rejectReason}
            fullWidth
            variant="outlined"
            onChange={e => setRejectReason(e.target.value)}
        />
    );

    const onSuccessButtonPressed = async () => {
        try {
            if (requestType === RequestType.ACCEPT) {
                await axios.post('book-request/accept-book-reservation-request', {
                    bookRequestId: selectedBookRequestId,
                    startDate,
                    dueDate: expiryDate
                }).then(result => {
                    enqueueSnackbar('The book reservation has been approved', {
                        variant: 'success',
                        transitionDuration: 1000
                    });
                    return result;
                });
            } else {
                await axios.post('book-request/reject-book-reservation-request', {
                    bookRequestId: selectedBookRequestId,
                    rejectReason
                }).then(result => {
                    enqueueSnackbar('The book reservation has been rejected', {
                        variant: 'success',
                        transitionDuration: 1000
                    });
                    return result;
                })
            }
        } catch (err) {
            enqueueSnackbar('Error occured. Please Try Again Later', {variant: 'error', transitionDuration: 1000});
        }
        resetAlertModal();
        retrieveData();
    };

    const actionAreaHeadCells = [
        {
            id: 'accept',
            disablePadding: false,
            label: 'Accept',
            text: 'Accept',
            color: 'success',
            disable: {id: 'status', criteria: 'ne', value: 'PROCESSING'},
            action: acceptBookReservationRequest
        },
        {
            id: 'reject',
            disablePadding: false,
            label: 'Reject',
            text: 'Reject',
            color: 'secondary',
            disable: {id: 'status', criteria: 'ne', value: 'PROCESSING'},
            action: rejectBookReservationRequest
        },
    ];

    return (
        <div>
            <AdminBoilerplate page={'reservebook'}/>
            <div className="content">
                <h2>Pending Book Reservation</h2>
                <EnhancedTable
                    headCells={headCells}
                    rows={bookRequests}
                    disableToolbar
                    actionAreaHeadCells={actionAreaHeadCells}
                />

                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <CustomModal
                        showAlertModal={showAlertModal}
                        title="Insert Expiry Date to Continue"
                        desc={requestType === RequestType.ACCEPT ? InsertDateModalContent : InsertRejectReasonModalContent}
                        onCloseConfirmationModal={resetAlertModal}
                        onSuccessButtonPressed={onSuccessButtonPressed}
                    />
                </MuiPickersUtilsProvider>

                <CompletedBookReservation/>
            </div>
        </div>
    );
};

export default BookReservationPage;