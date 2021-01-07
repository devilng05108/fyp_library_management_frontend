import React, {Component} from 'react';
import {Card, CardActionArea, CardContent, CardMedia, Grid} from '@material-ui/core';
import BookDetailModal from "./BookDetailModal";
import BookReservationModal from "./BookReservationModal";

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
      allBookDetail:{}
    };
  }

  onBookSelected = (selectedBookDetail,allBookDetail) => {
    this.setState({
      selectedBookDetail: selectedBookDetail,
      allBookDetail: allBookDetail,
      showBookDetailModal: true,
    });
    console.log(typeof this.state.allBookDetail);
    console.log(typeof allBookDetail);
  };

//   displaySearchResult = (searchResults) => {
//       if (searchResults) {
          
//           return searchResults.map(searchResult => {
//               return (
//                   <Grid item xs={12} sm={6} md={4} key={searchResult.id}>
//                       {this.displayBookDetail(searchResult)}
//                   </Grid>
//               );
//           });
//       } else {
//           return (
//               <p style={{margin: 'auto'}}>No result found</p>
//           );
//       }
//   };

  displaySearchResult = (searchResults) => {
    if (searchResults) {
        // var allBookArr = [];
        // Object.keys(searchResults).forEach(result=>{
        //     console.log(searchResults[result]);
        //     searchResults[result].forEach(all =>{
                
        //         allBookArr.push(all);
        //     })
        // });
        // console.log(allBookArr);

        return Object.keys(searchResults).map(result=>{
        //   console.log(searchResults[result][0].id);
          const firstbook = searchResults[result][0];
          const allbook = searchResults[result];
          var jsonBook = [];
          allbook.forEach(book=>{
            jsonBook.push({bookid:book.id,location:book.location});
          });
          console.log(jsonBook);
            return (
              <Grid item xs={12} sm={6} md={4} key={firstbook.id}>
                {this.displayBookDetail(firstbook, jsonBook)}
              </Grid>
            );
        })
        
    } else {
          return (
              <p style={{margin: 'auto'}}>No result found</p>
          );
      }
  };

  displayBookDetail = (bookDetail,allbook) => {
    const bookId = bookDetail.id;
    const title = bookDetail.title;
    const desc = bookDetail.summary;
    let imageLink = bookDetail.bookimg;
    console.log(typeof allbook);

    return (
      <Card style={{ padding: 10, margin: 10 }}>
        <CardContent className="flexGrow">
          <CardActionArea
            onClick={() => this.onBookSelected(bookDetail, allbook)}
          >
            <Grid
              container
              spacing={0}
              direction="column"
              alignItems="center"
              justify="center"
            >
              <CardMedia
                className="center"
                src={imageLink}
                height={140}
                alt="book img"
                title={title}
                onError={(this.src = '/mainlogo.png')}
              >
                <img
                  style={{
                    height: 200,
                    width: 200,
                    marginLeft: 'auto',
                    marginRight: 'auto',
                  }}
                  src={imageLink}
                  alt="a"
                  onError={
                    (imageLink =
                      'https://static.observableusercontent.com/thumbnail/6c9fd0747972d30c17c9f46f63840f1ff998330a22f170b3727bbd023d5d0f6c.jpg')
                  }
                />
              </CardMedia>
            </Grid>
            <h3 className="textCenter">{title}</h3>
            <p className="textCenter">
              {desc.length > 100 ? desc.slice(0, 100) + '...' : desc}
            </p>
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
        bookId: bookId,
      },
    });
  };

  onChangeShowBookReservationModal = (show) => {
    console.log('here');
    this.setState({
      bookReservationModal: {
        showBookReservationModal: show,
      },
    });
  };

  render() {
    const searchResults = this.props.result;
    return (
      <div id="searchResult">
        <h2>{this.props.title}</h2>
        <Grid container>{this.displaySearchResult(searchResults)}</Grid>
        <BookDetailModal
          openModal={this.state.showBookDetailModal}
          book={this.state.selectedBookDetail}
          allBook={this.state.allBookDetail}
          onChangeShowDetailModal={(e) => {
            this.onChangeShowDetailModal(e);
          }}
          onChangeShowBookReservationModal={(bookId) => {
            this.setSelectedBookId(bookId);
            this.onChangeShowBookReservationModal(true);
          }}
        />
        <BookReservationModal
          openModal={this.state.bookReservationModal.showBookReservationModal}
          book={this.state.bookReservationModal.bookId}
          allBook={this.state.allBookDetail}
          onChangeShowBookReservationModal={() => {
            this.onChangeShowBookReservationModal(false);
          }}
        />
      </div>
    );
  }
}

export default BookSearchResult;
