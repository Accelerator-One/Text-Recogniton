// Enviroment dependencies
import React, { Component } from 'react';
import Tesseract from 'tesseract.js';

// Visual effects
import './App.css';
import M from "materialize-css";
import "materialize-css/dist/css/materialize.min.css";

// Components
import Content from "./Content.js";
import swal from 'sweetalert';

// Main component
class App extends Component {

  // Constructor
  constructor(props) {
    super(props);
    this.state = {
      sql: false,
      snips: []
    };
  }

  // Add snip
  addSnip = (time, snip, url) => {

    let snips = this.state.snips;
    snips.push({ time, snip });

    this.setState({ ...this.state, snips });
    document.getElementById('imageInput').value = "";
    URL.revokeObjectURL(url);

    swal("Success", "Snip added!", 'success');
  }

  // Image processor
  imageHelper = async () => {

    let imgRef = document.getElementById('imageInput').files[0];
    let url = URL.createObjectURL(imgRef);

    swal("Processing...", "Execution started!", "info", {
      closeOnClickOutside: false,
      buttons: false
    });

    await Tesseract.recognize(url, 'eng', {
      logger: m => console.log(m)
    })
      .then(({ data: { text } }) => {
        this.addSnip(Date.now(), text, url);
      });

  }

  // Remove snip
  removeSnip = async (time) => {

    let snips = this.state.snips.filter(data => data.time !== time);
    await this.setState({ ...this.state, snips });
    M.toast({ html: "Snip removed!" });

    // Notify empty content panel
    setTimeout(() => {
      if (this.state.snips.length === 0) {
        const emptyRef = document.getElementById('empty');
        emptyRef.children[1].innerText = "No snips found";
      }
    }, 800);

  }

  // Final touchup
  async componentDidMount() {

    // effects
    M.AutoInit();

    // feature notification
    const target = document.querySelector('.tap-target');
    let instance = M.TapTarget.getInstance(target);
    instance.open();

    // destroy notification
    setTimeout(() => {
      instance.close();
      instance.destroy();
    }, 2400);

    // no snips
    const emptyRef = document.getElementById('empty');
    if (emptyRef !== null)
      emptyRef.children[1].innerText = "No snips found";

  }

  // Content rendering
  render() {

    return (
      <>

        <nav className="nav-extended purple darken-4">
          <div className="nav-wrapper">
            <span className="brand-logo center">Text Snip</span>
          </div>
        </nav>

        {
          // Content panel
          (this.state.snips.length === 0) ? (
            <div id="empty">
              <i className="material-icons large">search</i>
              <h5> Searching for snips... </h5>
            </div>
          ) :
            <Content snips={this.state.snips} removeSnip={this.removeSnip} />
        }

        <div className="fixed-action-btn">
          <button id='image' className="btn-floating btn-large purple darken-4"
            onClick={() => document.getElementById('imageInput').click()}>
            <i className="large material-icons">camera</i>
          </button>
        </div>

        <div className="tap-target purple" data-target="image">
          <div className="tap-target-content">
            <h5>Select image</h5>
            <h6>Tap the shutter to get started</h6>
          </div>
        </div>

        <input type="text" id="clipboard" />

        <input type="file" accept="image/*" className='hide'
          id="imageInput" onChange={this.imageHelper} />

      </>
    )
  };
}

export default App;