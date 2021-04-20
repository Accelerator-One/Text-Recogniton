import React, { Component } from 'react';
import M from 'materialize-css';

function Content({ snips, removeSnip }) {

  function copyToClipboard(snip) {

    const inputRef = document.getElementById('clipboard');
    inputRef.value = snip;

    inputRef.style.display = "unset";
    inputRef.style.visibility = "visible";

    inputRef.select();
    inputRef.setSelectionRange(0, 99999);
    document.execCommand("copy");

    M.toast({ html: "Text copied to clipboard" });
    inputRef.style.display = "none";
    inputRef.style.visibility = "hidden";
    inputRef.value = "";

  }

  return (
    <div id="content">
      {
        snips.map(({ time, snip }) => {
          return (
            <div key={time} className="card">
              <div className="card-content row">
                <div className='col s8'>
                  {snip}
                </div>
                <div className='col s2' onClick={() => copyToClipboard(snip)}>
                  <i className="material-icons copy">content_copy</i>
                </div>
                <div className='col s2' onClick={() => removeSnip(time)}>
                  <i className="material-icons copy">delete</i>
                </div>
              </div>
            </div>
          )
        })
      }
    </div>
  );
};

export default Content;