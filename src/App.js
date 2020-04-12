import React, { Component } from 'react';
import { Table, Button, Modal, ModalHeader, ModalBody, ModalFooter, FormGroup, Label, Input} from 'reactstrap';
import axios from 'axios';

class App extends Component {

  state = {
    books: [],
    newBookModal: false,
    editBookModal: false,
    newBookData: {
      title: '',
      rating: ''
    },
    editBookData: {
      id:'',
      title: '',
      rating: ''
    }
  }

  componentDidMount() {
    this._refreshBooks()
  }

  toggleNewBookModal(){
    this.setState({
      newBookModal : !this.state.newBookModal
    })
  }
  toggleEditBookModal(){
    this.setState({
      editBookModal : !this.state.editBookModal
    })
  }

  editBook(id, title, rating){
    this.setState({
      editBookData: {id, title, rating}, editBookModal: ! this.state.editBookModal
    })
    console.log(id)
  }
  
  addBook() {
    axios.post('http://localhost:3000/books', this.state.newBookData).then((res) => {
      let {books} = this.state;
      books.push(res.data);
      this.setState({
        books, newBookModal: false, newBookData: {
          title: '',
          rating: ''
        }
      })

    })
  }

  updateBook() {
    let {title, rating} = this.state.editBookData
    axios.put('http://localhost:3000/books/' + this.state.editBookData.id, {
      title, rating
    }).then((res) => {
      this._refreshBooks();
    })

    this.setState({
      editBookModal : !this.state.editBookModal,
      editBookData: {
        id:'',
        title: '',
        rating: ''
      }
    })

  }

  deleteBook(id) {
    
    axios.delete('http://localhost:3000/books/' + id).then((response) => {
      this._refreshBooks();
    });
  }

  _refreshBooks() {
    axios.get('http://localhost:3000/books').then((response) => {
      this.setState({
        books: response.data
      })
    })
  }



  render () {

    let books = this.state.books.map(book => {
      return(
        <tr key={book.id}>
          <td>{book.id}</td>
          <td>{book.title}</td>
          <td>{book.rating}</td>
          <td>
            <Button color='success' size='sm' className='mr-2' onClick={this.editBook.bind(this, book.id, book.title, book.rating)}> Edit</Button>
            <Button color='danger' size='sm' onClick={this.deleteBook.bind(this, book.id)}> Delete</Button>
          </td>
        </tr>
      )
    })
    return (
      <div className="App container">

        <h1>Books App</h1>

        <Button className="my-3"color="primary" onClick={this.toggleNewBookModal.bind(this)}>Add Book</Button>

        <Modal isOpen={this.state.newBookModal} toggle={this.toggleNewBookModal.bind(this)}>
          <ModalHeader toggle={this.toggleNewBookModal.bind(this)}>Add a new Book</ModalHeader>
          <ModalBody>
          <FormGroup>
            <Label for="title">Title</Label>
            <Input id="title" placeholder="Enter a book name .." value= {this.state.newBookData.title} onChange={e =>{
              let {newBookData} = this.state;
              newBookData.title = e.target.value;
              this.setState({
                newBookData
              })
              console.log(newBookData)
            }}/>
          </FormGroup>
          <FormGroup>
            <Label for="rating">Rating</Label>
            <Input id="rating" placeholder="Rate this book .." value= {this.state.newBookData.rating} onChange={e =>{
              let {newBookData} = this.state;
              newBookData.rating = e.target.value;
              this.setState({
                newBookData
              })
              console.log(newBookData)
            }}/>
          </FormGroup>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={this.addBook.bind(this)}>Add Book</Button>{' '}
            <Button color="secondary" onClick={this.toggleNewBookModal.bind(this)}>Cancel</Button>
          </ModalFooter>
        </Modal>



        <Modal isOpen={this.state.editBookModal} toggle={this.toggleEditBookModal.bind(this)} >
        <ModalHeader toggle={this.toggleEditBookModal.bind(this)}>Update book</ModalHeader>
        <ModalBody>
        <FormGroup>
            <Label for="title">Title</Label>
            <Input id="title" placeholder="Enter a book name .." value= {this.state.editBookData.title} onChange={e =>{
              let {editBookData} = this.state;
              editBookData.title = e.target.value;
              this.setState({
                editBookData
              })
              console.log(editBookData)
            }}/>
          </FormGroup>
          <FormGroup>
            <Label for="rating">Rating</Label>
            <Input id="rating" placeholder="Rate this book .." value= {this.state.editBookData.rating} onChange={e =>{
              let {editBookData} = this.state;
              editBookData.rating = e.target.value;
              this.setState({
                editBookData
              })
              console.log(editBookData)
            }}/>
          </FormGroup>
          </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={this.updateBook.bind(this)}>Update Book</Button>{' '}
          <Button color="secondary" onClick={this.toggleEditBookModal.bind(this)}>Cancel</Button>
        </ModalFooter>
      </Modal>

        <Table>
          <thead>
            <tr>
              <th>#</th>
              <th>Title</th>
              <th>Rating</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {books}
          </tbody>
        </Table>
      </div>
    );
  }
}

export default App;
