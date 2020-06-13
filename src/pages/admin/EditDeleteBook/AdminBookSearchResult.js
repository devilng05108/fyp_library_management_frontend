import React, {Component} from 'react';
import {Card, CardActionArea, CardContent, CardMedia, Grid} from '@material-ui/core';
import BookEditDeleteModal from "./BookEditDeleteModal";

class AdminBookSearchResult extends Component {
    constructor(props) {
        super(props);
        this.state = {
            bookReservationModal:{
                showBookReservationModal:false,
                bookId:null,
            },
        };
    }

    onBookSelected = (selectedBookDetail) => {
        this.props.onBookSelected(selectedBookDetail);
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
        const imageLink = bookDetail.bookimg;
        return (
            <Card style={{padding: 10,margin:10}}>
                <CardContent className="flexGrow">
                    <CardActionArea onClick={() => this.onBookSelected(bookDetail)}>
                        <CardMedia
                            component="img" className="center"
                            src={imageLink}
                            height={140}
                            alt="book img"
                            title={title}/>
                        <h3 className="textCenter">{title}</h3>
                        <p className="textCenter">{desc.length>100?desc.slice(0,100)+'...':desc}</p>
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


    render() {
        const searchResults = this.props.result;
        return (
            <div id="searchResult">
                <h2>Search Result</h2>
                <Grid container>
                    {this.displaySearchResult(searchResults)}
                </Grid>

            </div>
        );
    }
}

export default AdminBookSearchResult;