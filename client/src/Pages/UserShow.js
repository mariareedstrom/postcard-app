import React from 'react';
import { Link} from "react-router-dom";
import {Box, Typography, Button } from "@mui/material";
import Grid from "@mui/material/Grid";
import PostCard from "../Components/PostCard";

function UserShow({currentUser}) {
    const {name, postcards, id, comments } = currentUser
    const destinations = postcards.map(card => card.destination)




    return (

        <>
        < div style={{ maxWidth:"550px", margin:"0 auto"}}>
            <Box style={{
                display: "flex",
                justifyContent:"space-around",
                margin:"18px 0px",
                borderBottom:"1px solid grey"
               }}>
                <div>
                    <img alt='user'
                         style={{width: "160px",
                                height:"160px",
                                borderRadius:"80px"}}
                    src="https://images.unsplash.com/photo-1524117074681-31bd4de22ad3?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NHx8YW5pbWF0aW9uJTIwY2FydG9vbnxlbnwwfDJ8MHx8&auto=format&fit=crop&w=800&q=60"/>
                </div>
                <div>
                    <Typography component="h2" variant="h4" gutterBottom sx={{marginTop: '16px'}}>
                        Postcards from {name}
                    </Typography>

                    {currentUser ? <Button component={Link} to={{pathname: `/users/${id}/edit`, state: {name: name}}}> Edit Profile</Button> : null}

                    <div style={{display:"flex", justifyContent:"space-between", width:"108%"}}>
                        <Typography component="h6" variant="h4" gutterBottom sx={{marginTop: '16px'}}>
                            {postcards.length} Postcards
                        </Typography>
                        <Typography component="h6" variant="h4" gutterBottom sx={{marginTop: '16px'}}>
                            {destinations.length} Destinations
                        </Typography>
                        <Typography component="h6" variant="h4" gutterBottom sx={{marginTop: '16px'}}>
                            {comments.length} Comments
                        </Typography>
                    </div>
                </div>
            </Box>

            <Grid className="gallery" >

                        {postcards.map((postcard) => (

                            <Grid item display="flex" key={postcard.id}>
                                <PostCard postcard={postcard} />
                            </Grid>
                        ))}
            </Grid>
        </div>
</>



    );
}

export default UserShow;