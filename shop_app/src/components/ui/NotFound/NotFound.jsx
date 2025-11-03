import MainHeading from "../Main/MainHeading.jsx";
import React from 'react';

const PageNotFound = () => {
    const title = "Page NotFound"
    const text = "Sorry page not found!!"
    return (
        <>
            <MainHeading
            title={title}
            heading={text}
            />
        </>
    )
}

export default PageNotFound;