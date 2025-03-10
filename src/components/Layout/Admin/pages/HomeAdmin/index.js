import axios from "axios";
import { useEffect, useState } from "react";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

function HomeAdmin() {
    const [postList, setPostList] = useState([]);

    useEffect(()=>{
        const fetchPosts = async () => {
        let res = await axios.get("https://api-blog-xonf.onrender.com/v1/post");
        setPostList(res.data)
        };
        fetchPosts();
    },[])

    //post Api
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [images, setImages] = useState("");
    
    const handleSubmit = () => {
        PostApi(title,content,images);
    }
    

    const PostApi = async (title, content,images) => {
        let res = await axios.post(`${process.env.REACT_APP_API_ENDPOINT}/v1/post`, {
            title: title,
            content : content,
            images : images
        });
        console.log(res.data); 
        setPostList([res.data, ...postList]);        
    }

    //update
    const [post,setPost] = useState({})
    const getpostById = async (id) => {
        let res = await axios.get(`${process.env.REACT_APP_API_ENDPOINT}/v1/post/${id}`);
        setPost(res.data);
        console.log(post); 
    }
    const handleUpdateBtn = async ()=> {
        let res = await axios.put(`${process.env.REACT_APP_API_ENDPOINT}/v1/post/${post._id}`,{
            title: title || post.title ,
            content:content || post.content,
            images:images || post.images 
        });
        setPostList([res.data, ...postList])
    }

    //delete
    //confilm

    const deleteApi = async (id)=> {
        await axios.delete(`${process.env.REACT_APP_API_ENDPOINT}/v1/post/${id}`);
        setPostList(postList.filter(post=> post._id !== id));
        console.log("deleted");
    }
    

    return(
        <div>
            <div>
                <div>
                    <h1>Add Post</h1>
                    <form onSubmit={handleSubmit}>
                        <lable>
                            Title
                            <input type={"text"} name={"name"} onChange = {e => setTitle(e.target.value)} />
                        </lable>
                        <lable>
                            <h3>Content</h3>
                            <ReactQuill theme="snow" value={content} onChange = {setContent} />
                        </lable>
                        {console.log(content)}
                        <lable>
                            Images
                            <input type={"text"} name={"images"} onChange = {e => setImages(e.target.value)}/>
                        </lable>
                        <button type={"submit"}>Add</button>
                    </form>
                </div>
                <div>
                    <h1>Update Post</h1>
                    <form onSubmit={handleUpdateBtn} >
                        <lable>
                            Title
                            <input type={"text"} name={"name"} onChange = {e => setTitle(e.target.value)} defaultValue ={post.title} />
                        </lable>
                        <lable>
                            Content
                            <input type={"text"} name={"content"} onChange = {e => setContent(e.target.defaultValue)} defaultValue={post.content}/>
                        </lable>
                        <lable>
                            Images
                            <input type={"text"} name={"images"} onChange = {e => setImages(e.target.value)} defaultValue={post.images}/>
                        </lable>
                        <button type={"submit"}>Add</button>
                    </form>
                </div>
            </div>

            <h3>List Post</h3>
            <ul>
                {postList.map((post,id) => 
                    <li key={id} >{post.title} 
                        <span onClick={()=>{ if (window.confirm('Are you sure you wish to delete this item?')) deleteApi(post._id) }}> -Xóa-</span>
                        <span onClick={()=>getpostById(post._id)}> -Edit-</span>
                    </li>
                )}
            </ul>
        </div>
    );
}

export default HomeAdmin;