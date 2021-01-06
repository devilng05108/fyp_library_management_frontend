import React, {Component} from 'react';
import {Card, CardActionArea, CardContent, CardMedia, Grid} from '@material-ui/core';
import BookDetailModal from "./BookDetailModal";
import BookReservationModal from "./BookReservationModal";
import {BASE_URL} from "../../../constant/route.constant";
import Typography from "@material-ui/core/Typography";
import {withStyles} from "@material-ui/core/styles";

const StyledCardContent = withStyles({
    MuiCardContent: {
        root: {
            padding: 0,
            "&:last-child": {
                paddingBottom: 0,
            },
        },
    },
})(CardContent);

class BookSearchResult extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedBookDetail: {},
            showBookDetailModal: false,
            bookReservationModal: {
                showBookReservationModal: false,
                bookId: null,
            },
        };
    }

    onBookSelected = (selectedBookDetail) => {
        this.setState({
            selectedBookDetail: selectedBookDetail,
            showBookDetailModal: true,
        });
    };

    displaySearchResult = (searchResults) => {
        if (searchResults) {
            return searchResults.map(searchResult => {
                return (
                    <Grid item xs={12} sm={6} md={4} key={searchResult.id}>
                        {this.displayBookDetail(searchResult)}
                    </Grid>
                );
            });
        } else {
            return (
                <p style={{margin: 'auto'}}>No result found</p>
            );
        }
    };

    displayBookDetail = (bookDetail) => {
        const bookId = bookDetail.id;
        const title = bookDetail.title;
        const desc = bookDetail.summary;
        let imageLink = bookDetail.bookimg;

        return (

            <Card style={{margin: 10}}>
                <CardContent style={{padding: 0}}>
                    <CardActionArea onClick={() => this.onBookSelected(bookDetail)}>
                        <CardMedia
                            component="img"
                            src={BASE_URL + imageLink}
                            height={200}
                            alt="book img"
                            title={title}
                            onError={this.src = "/mainlogo.png"}/>

                            <CardContent>
                                <Typography gutterBottom variant="h5" component="h3">
                                    {title}
                                </Typography>
                                <Typography variant="body2" color="textSecondary" component="p">
                                    {desc.length > 100 ? desc.slice(0, 100) + '...' : desc}
                                </Typography>
                            </CardContent>
                    </CardActionArea>
                </CardContent>
            </Card>

        );
    };

    onChangeShowDetailModal = (data) => {
        this.setState({
            showBookDetailModal: data,
        });
    };

    setSelectedBookId = (bookId) => {
        this.setState({
            bookReservationModal: {
                bookId: bookId
            }
        });
    };

    onChangeShowBookReservationModal = (show) => {
        console.log('here');
        this.setState({
            bookReservationModal: {
                showBookReservationModal: show,
            }
        });
    };

    render() {
        const searchResults = this.props.result;
        return (
            <div id="searchResult">
                <h1>{this.props.title}</h1>
                <Grid container>
                    {this.displaySearchResult(searchResults)}
                </Grid>
                <BookDetailModal
                    openModal={this.state.showBookDetailModal}
                    book={this.state.selectedBookDetail}
                    onChangeShowDetailModal={e => {
                        this.onChangeShowDetailModal(e)
                    }}
                    onChangeShowBookReservationModal={(bookId) => {
                        this.setSelectedBookId(bookId);
                        this.onChangeShowBookReservationModal(true);
                    }}
                />
                <BookReservationModal
                    openModal={this.state.bookReservationModal.showBookReservationModal}
                    book={this.state.bookReservationModal.bookId}
                    onChangeShowBookReservationModal={() => {
                        this.onChangeShowBookReservationModal(false);
                    }
                    }
                />
            </div>
        );
    }
}

export default BookSearchResult;
