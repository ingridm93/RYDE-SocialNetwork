import React from 'react';
import axios from 'axios';
import {Link} from 'react-router'


export default class Upload extends React.Component {

    constructor(props) {
        super(props);
        this.state = {};
    }

    handleChange(e) {
        this.setState({
          [e.target.name] : e.target.files[0]
        });
    }

    serverUpload () {

        const {file} = this.state;

        const fd = new FormData;
        fd.append('file', file);

        axios.post('/upload', fd)

        .then((res) => {
            console.log(res);
            const data = res.data;
            if(!data.success) {
                error: true
            } else {

                var url = data.url;
                this.props.setImage(url);
                location.replace('/');
            }
        });
    };


    render() {
        return (
           <div className = 'uploadBox'>
                <input id="file-button" name="file" type="file" onChange={e => this.handleChange(e)}/>

                <button id="upload-button" onClick={e => this.serverUpload(e)}> Upload </button>
           </div>

        )
    }
}
