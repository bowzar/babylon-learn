import React, { useContext } from 'react';
import { Application } from "@yulintu/freesia-bootstrap";

import "./index.less";

const Echo = function (props) {

    const context = useContext(Application.Context);

    console.log("echo props", props);
    console.log("echo context", context);

    return <>
        <div className="h100 w100 layout-h center2 echo-text" >
            {props.metadata.alias}
        </div>
    </>
}

export default Echo;