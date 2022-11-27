
import "../about/about.css"

const About=()=>{

    return (
        <>
            <div className="aboutContainer">
                {/* <div>
                    <input type="text" name="" placeholder="Search" id="search"/>
                </div> */}
                <div className="aboutCreators">
                    <div className="div1">
                        About the Creators
                    </div>
                    <div>
                        <b>Why we made this site:</b><br/>
                        The project, Tasty Creations, is aimed toward people who love cooking and want to create amazing recipes without any hassle. We will also deliver a project which will create an adequate atmosphere for the cooking community with high quality food to ensure a high-quality life.
                    </div>
                </div>
                <div  className="profiles">
                    <div className="singleProfile">
                        <div>
                            <img src="https://media.istockphoto.com/id/1142192548/vector/man-avatar-profile-male-face-silhouette-or-icon-isolated-on-white-background-vector.jpg?s=612x612&w=0&k=20&c=DUKuRxK9OINHXt3_4m-GxraeoDDlhNuCbA9hp6FotFE=" alt="" id="aboutImg"/><br />
                            <div id="Membername">
                                <b>Thang Cong Van</b>
                            </div>
                        </div>
                        <div>
                        I am Thanh Cong Van and originally from Vietnam. I am in the last semester of CPA, and this time my teammates and I have created a handy website for people loving cooking. The reason why I chose CPA is because I want to build up a website with my own ideas, and all the technologies I have learned in this program.
                        </div>
                    </div>
                    <div className="singleProfile">
                        <div>
                            <img src="https://media.istockphoto.com/id/1142192666/vector/avatar-profile-female-face-silhouette-or-icon-isolated-on-white-background-vector.jpg?s=612x612&w=0&k=20&c=zRpQo0scJ5MWHkrESBfhG_gZYwBtHPHJvTQ21F_MBJA=" alt="" id="aboutImg"/><br />
                            <div id="Membername">
                                <b>Tahsin Rahman</b>
                            </div>
                        </div>
                        <div>
                        My name is Tahsin Rahman, an international student of Seneca College's Computer Programming and Analysis program, and originally from Bangladesh. I'm currently in my last semester and participating in this group collaboration to make a web application using the skills and knowledge which I have mastered while being a student in Seneca. I am mostly interested in database and web programming development. I'm glad that I was able to contribute to this group project. 
                        </div>
                    </div>
                    <div className="singleProfile">
                        <div>
                            <img src="https://media.istockphoto.com/id/1142192548/vector/man-avatar-profile-male-face-silhouette-or-icon-isolated-on-white-background-vector.jpg?s=612x612&w=0&k=20&c=DUKuRxK9OINHXt3_4m-GxraeoDDlhNuCbA9hp6FotFE=" alt="" id="aboutImg"/><br />
                            <div id="Membername">
                                <b>Taimoor Dawami</b>
                            </div>
                        </div>
                        <div>
                        My name is Taimoor Dawami who is the most recent addition to the team. I joined the team In the development phase. I am originally from Pakistan but migrated to Canada early on in life. My main contribution to the project is adding the “Like” functionality for API-fetched recipes, and handling CRUD operations for user reviews.
                        </div>
                    </div>
                    <div className="singleProfile">
                        <div>
                            <img src="https://media.istockphoto.com/id/1142192548/vector/man-avatar-profile-male-face-silhouette-or-icon-isolated-on-white-background-vector.jpg?s=612x612&w=0&k=20&c=DUKuRxK9OINHXt3_4m-GxraeoDDlhNuCbA9hp6FotFE=" alt="" id="aboutImg"/><br />
                            <div id="Membername">
                                <b>Sami Ali</b>
                            </div>
                        </div>
                        <div>
                        My name is Sami Ali and I am a student in Seneca College's Computer Programming and Analysis program. I am Pakistani, born and raised in Canada. I am interested in database administration and possess skills in web development and c++ programming. I am partaking in this course and project to apply the skills I have learned throughout the program, skills such as web development and group collaboration.
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default About;