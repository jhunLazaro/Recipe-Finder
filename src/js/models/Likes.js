export default class Likes {
    constructor() {
        this.likes = [];
    }
    addLike(id, title, author, img) {
        const like = { id,
        title,
        author,
        img
        };
        this.likes.push(like);
        this.persistData();
        // Persist the date in local Storage
        return like;
    }
    deleteLike(id) {
        const index = this.likes.findIndex(el => el.id === id);
        this.likes.splice(index, 1);

        this.persistData();
        // Persist the date in local Storage
    }
    isLiked(id) {
        return this.likes.findIndex(el => el.id === id) !== -1;
    }
    numLikes(){
        return this.likes.length;
    }

    persistData() {
        localStorage.setItem('likes', JSON.stringify(this.likes)); //1 and 2 parameter is string so JSON. use to convert this.likes to string
        
    }
    retrieveStorage() {
        const storage = JSON.parse(localStorage.getItem('likes')); // to convert back to object or data structure before
        // Restoring like from a local storage
        if (storage) this.likes = storage;
    }

}