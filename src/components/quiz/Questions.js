import React,{Component,Fragment} from 'react';
import {Link} from 'react-router-dom';
import {Helmet} from 'react-helmet';

const QuizInstruction=()=>(
    <Fragment>
        <Helmet><title>Quiz Instructions - Quiz App</title></Helmet>
        <div className="instruction container">
            <h1>How to play the Game</h1>
            <p>Ensure you read this guide from start to finish.</p>
            <ul className="browser-default" id='main-list'>
                <li>The game has a duration of 15 minutes</li>
                <li>Each game consists of 15 questions.</li>
                <li>
                    Every question contains 4 options.
                </li>
            </ul>
            <div>
                <span className="left"><Link to="/">No take me back</Link></span>
                <span className="left"><Link to="/play/quiz">Okey, Let's do this</Link></span>

            </div>
        </div>
    </Fragment>
);

export default QuizInstruction;