import React, { Fragment } from 'react';
import {Helmet} from 'react-helmet';
import questions from '../../questions.json';
import isEmpty from '../../utlis/is-empty'
import M from 'materialize-css';


class Play extends React.Component{
    constructor(props){
        super(props);
        this.state={
            questions,
            currentQuestion:{},
            nextQuestion:{},
            previousQuestion:{},
            answer:'',
            numberofQuestions:0,
            numberofAnsweredQuestion:0,
            currentQuestionIndex:0,
            score:0,
            correctAnswers:0,
            wrongAnswers:0,
            hints:5,
            fiftyFifty:2,
            usedFiftyfifty:false,
            previousRandomNumbers:[],
            time:{}
        };

        
    }

    componentDidMount(){
        const {questions,currentQuestion,nextQuestion,previousQuestion} = this.state;
        this.displayQuestions(questions,currentQuestion,nextQuestion,previousQuestion)
    }

    displayQuestions=(questions = this.state.questions,currentQuestion,nextQuestion,previousQuestion)=>{
        let {currentQuestionIndex} = this.state;
        if(!isEmpty(this.state.questions)){
            questions = this.state.questions;
            currentQuestion = questions [currentQuestionIndex];
            nextQuestion = questions[currentQuestionIndex+1];
            previousQuestion = questions[currentQuestionIndex-1];
            const answer = currentQuestion.answer;
            console.log(answer);
            this.setState({
                currentQuestion,
                nextQuestion,
                previousQuestion,
                answer,
                previousRandomNumbers:[]
            },()=>{
              this.showOptions();  
            })
        }
    }

    handleNextButtononClick =()=>{
        console.log('clicked');
        if(this.state.nextQuestion !== undefined){
            this.setState(prevstate=>({
                currentQuestionIndex:prevstate.currentQuestionIndex+1
            }),()=>{
                this.displayQuestions(this.state.questions,this.state.currentQuestion,this.state.nextQuestion,this.state.previousQuestion);
            })
        }
    }
    handlePrevButtononClick =()=>{
        //console.log('clicked');
        if(this.state.previousQuestion !== undefined){
            this.setState(prevstate=>({
                currentQuestionIndex:prevstate.currentQuestionIndex -1
            }),()=>{
                this.displayQuestions(this.state.questions,this.state.currentQuestion,this.state.nextQuestion,this.state.previousQuestion);
            })
        }
    }
    handleQuitbuttononClick =()=>{
        if(window.confirm('Are you sure ,you wan to Quit!')){
            this.props.history.push('/');
        }
    }

    handleOptionClick =(e) =>{
        if(e.target.innerHTML.toLowerCase() === this.state.answer){
            this.correctAnswers();
        }
        else{
            this.wrongAnswers();
        }
        }

        correctAnswers = ()=>{
            M.toast({
                html:'Correct Answer',
                classes:'toast-valid',
                displayLength:1500
            });
            this.setState(prevstate=>({
                score:prevstate.score+1,
                correctAnswers:prevstate.correctAnswers+1,
                currentQuestionIndex:prevstate.currentQuestionIndex+1,
                numberofAnsweredQuestion:prevstate.numberofAnsweredQuestion+1

            }),()=>{
                this.displayQuestions(this.state.questions,this.state.currentQuestion,this.state.nextQuestion,this.state.previousQuestion);
            })
        }
        wrongAnswers = ()=>{
            navigator.vibrate(1000);
            M.toast({
                html:'Wrong Answer',
                classes:'toast-invalid',
                displayLength:1500
            });
            this.setState(prevstate=>({
               wrongAnswers:prevstate.wrongAnswers+1,
               currentQuestionIndex:prevstate.currentQuestionIndex+1,
               numberofAnsweredQuestion:prevstate.numberofAnsweredQuestion+1

            }),()=>{
                this.displayQuestions(this.state.questions,this.state.currentQuestion,this.state.nextQuestion,this.state.previousQuestion);

            })
        }

        showOptions =() =>{
            const options = Array.from(document.querySelectorAll('.option'));

            options.forEach(option =>{
                option.style.visibility = 'visible';
            });
            this.setState({
                usedFiftyfifty:false
            })
        }

        handlehint =()=>{
            //console.log('clicked')
           if(this.state.hints > 0){
            const options = Array.from(document.querySelectorAll('.option'));
            let indexofAnswer;

            options.forEach((option,index)=>{
                if(option.innerHTML.toLowerCase() === this.state.answer.toLowerCase()){
                    indexofAnswer = index;
                }
            });
            while(true){
                const randomNumber = Math.round(Math.random() * 3)
                if(randomNumber !== indexofAnswer && !this.state.previousRandomNumbers.includes(randomNumber)){
                    options.forEach((option,index)=>{
                        
                        if(index === randomNumber){
                            option.style.visibility = 'hidden';
                            
                            this.setState(prevstate =>({
                                hints:prevstate.hints - 1,
                                previousRandomNumbers:prevstate.previousRandomNumbers.concat(randomNumber)
                            }));                           
                        }
                    });
                    break;
                }
                if(this.state.previousRandomNumbers.length >=3) {
                    break
                };
            }
           
           } 
        }
    
        handleFiftyfifty =()=>{
           // console.log('clicked');
            if(this.state.fiftyFifty > 0 && this.state.usedFiftyfifty === false){
                const options = document.querySelectorAll('.option');
                const randomNumbers = [];
                let indexofAnswer;
                options.forEach((option,index)=>{
                    if(option.innerHTML.toLowerCase === this.state.answer.toLowerCase()){
                        indexofAnswer = index;
                    }
                });
                let count = 0;
                do{
                    const randomNumber = Math.round(Math.random()*3);
                    if(randomNumber !== indexofAnswer){
                        if(randomNumbers.length <2  && !randomNumbers.includes(randomNumber) && !randomNumbers.includes(indexofAnswer) ){
                            randomNumbers.push(randomNumber);
                            count++;
                            
                        }
                        else{
                            while(true){
                                const newrandomnumber = Math.round(Math.random() *3);
                                if(!randomNumbers.includes(newrandomnumber) && !randomNumbers.includes(indexofAnswer)){
                                    randomNumbers.push(newrandomnumber);
                                    count++;
                                    break;
                                }
                            }
                            console.log('my number-2',randomNumbers);
                        }
                    }
                }while(count < 2);
                options.forEach((option,index)=>{   
                    if(randomNumbers.includes(index)){    
                        option.style.visibility = 'hidden';
                    }
                });
                this.setState(prevstate=>({
                    fiftyFifty:prevstate.fiftyFifty - 1,
                    usedFiftyfifty:true
                }))
            }
        }
    render(){
       // console.log(questions);
       const {currentQuestion,currentQuestionIndex,fiftyFifty,hints,numberofAnsweredQuestion} = this.state;
        return(
            <Fragment>
                <Helmet><title>Quiz Page</title></Helmet>
                <div className="questions">
                    <h3>Quiz Mode</h3>
                    <div className="lifeline-container">
                        <p>
                            <span onClick={this.handleFiftyfifty}className="mdi mdi-set-center mdi-24px lifeline-icon">
                            <span className="lifeline">{fiftyFifty}</span>
                            </span>
                        </p>
                        <p>
                            <span onClick ={this.handlehint} className="mdi mdi-lightbulb-on-outline mdi-24px lifeline-icon">
                            <span className="lifeline" >{hints}</span>
                            </span>
                            
                        </p>

                    </div>
                    <div>
                        <p>
                            <span className="left">1 of 15</span>
                            <span className="right">2:15<span className="mdi mdi-clock-outline mdi-24px"></span></span>
                        </p>
                    </div>
                     <h5>{currentQuestion.question}</h5>
                     <div className="options-container">
                         <p onClick = {this.handleOptionClick} className="option">{currentQuestion.optionA}</p>
                         <p onClick = {this.handleOptionClick} className="option">{currentQuestion.optionB}</p>
                     </div>
                     <div className="options-container">
                         <p onClick = {this.handleOptionClick} className="option">{currentQuestion.optionC}</p>
                         <p onClick = {this.handleOptionClick} className="option">{currentQuestion.optionD}</p>
                     </div>
                     <div className="button-container">
                         <button onClick={this.handlePrevButtononClick}>Previous</button>
                         <button onClick={this.handleNextButtononClick}>Next</button>
                         <button onClick={this.handleQuitbuttononClick}>Quit</button>
                     </div>
                </div>
            </Fragment>
            
        )
    }
}

export default Play;

