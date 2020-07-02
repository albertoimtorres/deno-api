import React from "https://dev.jspm.io/react@16.13.1"
import ReactDOMServer from "https://dev.jspm.io/react-dom@16.13.1/server"

declare global {
    namespace JSX {
        interface IntrinsicElements {
            div: any
            nav: any
            img: any
        }
    }
}

const Header = () => {
    return (
        <div id="header">
            <nav className="nav-wrapper black darken-4">
                <div className="row">

                    <div className="col s12 m8">
                        <div className="row valign-wrapper">
                            <div className="col s4 m2">
                                <img className="responsive-img" src="https://upload.wikimedia.org/wikipedia/commons/8/84/Deno.svg" />
                            </div>
                        </div>
                    </div>

                </div>
            </nav>
        </div>
    )
}

export default Header