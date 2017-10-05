import React from 'react';


export default function(props) {

    return (
        <div>
            <div className="modal" onClick={props.showImage}>

                <div className="ppview-container" onClick={e=>{
                    props.nextImg(e);
                    e.stopPropagation();
                    }
                }>

                    <img className="pp-view" src = {props.image}/>

                </div>

            </div>

        </div>
    )
}
