import React from 'react';
import { useState } from 'react';
import { Link } from "react-router-dom";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const navigate = useNavigate();

    const handleSubmit = (event) => {
        event.preventDefault();
        
        axios.post('http://localhost:5001/api/user/login', {email, password})
        .then(result => {
            // Expect result.data to be user object or error
            if(result.data && result.data._id){
                localStorage.setItem("user", JSON.stringify(result.data));
                alert('Login successful!');
                navigate('/home');
            } else {
                alert('Incorrect email or password! Please try again.');
            }
        })
        .catch(err => {
            console.log(err);
            alert('Login failed. Please try again.');
        });
    }


    return (
        <div>
            <div className="flex min-h-screen justify-center items-center text-center bg-neutral-300">
                <div className="bg-white rounded-md p-6">
                    <h2 className='mb-6 mt-3 text-2xl font-bold'>Login</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3 text-start py-2">
                            <label htmlFor="exampleInputEmail1" className="form-label m-2 mr-4 p-0.5">
                                <strong>Email Id</strong>
                            </label>
                            <input 
                                type="email" 
                                placeholder="Enter Email"
                                className="form-control p-1 rounded-sm" 
                                id="exampleInputEmail1" 
                                onChange={(event) => setEmail(event.target.value)}
                                required
                            /> 
                        </div>
                        <div className="mb-3 text-start">
                            <label htmlFor="exampleInputPassword1" className="form-label m-2">
                                <strong className=''>Password</strong>
                            </label>
                            <input 
                                type="password" 
                                placeholder="Enter Password"
                                className="form-control p-1" 
                                id="exampleInputPassword1" 
                                onChange={(event) => setPassword(event.target.value)}
                                required
                            />
                        </div>
                        <button type="submit" className="btn btn-primary border-2 p-2 px-4 border-zinc-950 rounded-2xl bg-green-500 my-4 hover:bg-green-700">Login</button>
                    </form>
                    
                    <p className='container my-4 text-slate-500'>Don't have an account? <Link to='/register' className="btn btn-secondary text-slate-700 hover:text-blue-600">Register</Link></p>
                    
                </div>
            </div>
        </div>
    )
}

export default Login