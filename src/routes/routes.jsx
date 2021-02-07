import { Suspense } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Home from "../view/home/home";

export default function Routes() {
    return (
        <BrowserRouter>
            <Switch>
                <Suspense fallback={<h1>Loding...</h1>}>
                    <Route exact path="/" component={() => <Home />} />
                </Suspense>
            </Switch>
        </BrowserRouter>
    )
}