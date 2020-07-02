import React from "https://dev.jspm.io/react@16.13.1"
import ReactDOM from "https://dev.jspm.io/react@16.13.1"
import ReactDOMServer from "https://dev.jspm.io/react-dom@16.13.1/server"

import Header from './header.tsx'

declare global {
    namespace JSX {
        interface IntrinsicElements {
            div: any
        }
    }
}

function App() {
    return (
        <div id="app">
            <Header/>
        </div>
    )
}

/**
 * Only use when be render whith variable body
*/
export const body = ReactDOMServer.renderToString(<App/>)
