import './App.css';

import React from "react";
import {useState, useEffect} from "react";
import {Routes, Route, useNavigate } from 'react-router-dom';
import {Container} from "@mui/material";

import Header from "./Components/Header";
import UserShow from "./Pages/UserShow";
import SignupForm from "./Components/SignupForm";
import UserEdit from "./Pages/UserEdit";
import PostcardShow from "./Pages/PostcardShow";
import NewPostcardForm from "./Components/NewPostcardForm";
import PostcardEdit from "./Pages/PostcardEdit";
import PostcardIndex from "./Pages/PostcardIndex";
import LoginForm from "./Components/LoginForm";


function App() {
    const [currentUser, setCurrentUser] = useState(null)
    const [authenticated, setAuthenticated] = useState(false)
    const [postcards, setPostcards] = useState([])

    const navigate = useNavigate()


    useEffect(() => {
        fetch('/api/me')
            .then((res) => {
                if (res.ok) {
                    res.json().then((user) => {
                        setCurrentUser(user)
                        setAuthenticated(true)
                    })
                } else {
                    setAuthenticated(true)
                }
            })
    }, [])

    useEffect(() => {
        fetch('/api/postcards')
            .then((res) => res.json())
            .then((postcards) => {
                setPostcards(postcards)
            })

    }, [])

    if (!authenticated) {
        return <div></div>
    }


    function handleLogout() {
        setCurrentUser(null)
        fetch('/api/logout', {method: "DELETE"})
        navigate(`/`)

    }

    function handlePostcardUpdate(postcard, props) {
        // find postcard
        const index = postcards.indexOf(postcard)
        // Update props on postcard
        const updated = {...postcard, ...props}
        // create shallow copy of postcards
        const copyArray = postcards.slice()
        // replace postcard with updated
        copyArray.splice(index, 1, updated)
        setPostcards(copyArray)
    }

    function handlePostcardDelete(postcardId) {
        setPostcards(postcards.filter(({id}) => `${id}` !== postcardId))
    }

    function handlePostcardAdd(postcard) {
        setPostcards([...postcards, postcard])
    }


    return (
        <>
            {currentUser ? <Header currentUser={currentUser} handleLogout={handleLogout}/> : null}
            <Container maxWidth="xl">
                <main className="App" style={{height: "100vh", display: "flex", flexDirection: "column"}}>
                    <Routes>
                        <Route path="/" element=
                            {currentUser ? (
                                <PostcardIndex currentUser={currentUser} postcards={postcards}/>
                            ) : (
                                <LoginForm setCurrentUser={setCurrentUser}/>
                            )}
                        />
                        <Route path="/users/:id" element={<UserShow currentUser={currentUser}/>}/>
                        <Route path="/signup" element={<SignupForm setCurrentUser={setCurrentUser}/>}/>
                        <Route path="/users/:id/edit"
                               element={<UserEdit currentUser={currentUser} setCurrentUser={setCurrentUser}/>}/>
                        <Route path="/postcards/:id"
                               element={<PostcardShow currentUser={currentUser}
                                                      postcards={postcards}
                                                      onPostcardUpdate={handlePostcardUpdate}
                                                      onPostcardDelete={handlePostcardDelete}/>
                        }/>
                        <Route path="/postcards/:id/edit" element={<PostcardEdit postcards={postcards} onPostcardUpdate={handlePostcardUpdate}/>} />
                        <Route path="/postcards/new" element={<NewPostcardForm currentUser={currentUser} onPostcardAdd={handlePostcardAdd}/>}/>
                    </Routes>
                </main>
            </Container>
        </>
    );
}

export default App;
