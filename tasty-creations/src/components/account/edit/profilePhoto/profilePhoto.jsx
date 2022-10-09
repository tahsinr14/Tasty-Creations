import "./profilePhoto.css";


const UserProfilePhoto = () => {

    return (
        <>
        <div className="photo">
            <img src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460__340.png" alt="user profile" /> <br/>
                
                <input type="file" /><br/>    
                <input type="submit" value="Submit" /><br/>
            
        </div>
        </>
    );
}

export default UserProfilePhoto;