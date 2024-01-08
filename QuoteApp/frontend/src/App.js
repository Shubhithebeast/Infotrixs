// client/src/App.js
import React, { useState, useEffect,useRef } from 'react';
import axios from 'axios';
import './App.css'; // Import the CSS file
import Typed from 'typed.js'  

const  App=() =>{
    const [quote, setQuote] = useState({ text: '', author: '' });
    const [searchAuthor, setSearchAuthor] = useState('');
    const autoText = useRef(null); 

    const getRandomQuote = async () => { 
        try {
            const response = await axios.get('http://localhost:5000/api/random');
            console.log("Random quote fetch data: ",response.data);
            const {a:author, q:text} = response.data[0];

            await axios.post('http://localhost:5000/api/addQuote',{author,text});
            setQuote({author,text});
        } catch (error) {  
            console.error(error);
        }
    };

    const searchByAuthor = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/api/search/${searchAuthor}`);

            if (response.data.length > 0) { 
               console.log("Author quote fetch data: ",response.data);
                setQuote(response.data[0]);
            } else {
               console.log("No quote found by Author: ",response.data);
                setQuote({ text: 'No quotes found.', author: '' });
            }
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        getRandomQuote();

        const typed = new Typed(autoText.current,{
            strings:['Quote of the day','Find your thoughts in quotes','Happiness, Love, Peace, Vibes, Calmness...'],
            typeSpeed:150,
            backSpeed:150,
            loop:true
        })

        return()=>{
            // Destroy Typed instance during cleanup to stop animation
            typed.destroy();
        }

    }, []);

    return (
        <div className="app-container">
        <h1 class="font-effect-fire" ><span class="font-effect-neon">🖋 </span><span ref={autoText}></span></h1>
            
            <div className="quote-container">
                <p className="quote-text">{quote.text}</p>
                <p className="quote-author">-✍🏻{quote.author}</p>
            </div>

            <div className="buttons-container">
                <button className="button" onClick={getRandomQuote}>
                    Next Quote
                </button>

                <div className="search-container">
                    <input
                        type="text"
                        placeholder="Enter author name"
                        value={searchAuthor}
                        onChange={(e) => setSearchAuthor(e.target.value)}
                    />
                    <button className="button" onClick={searchByAuthor}>
                        Search by Author
                    </button>
                </div>
            </div>
        </div>
    );
}

export default App;
