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
        console.log("updated")
        axios.post('https://real-time-chat-app-production-06a7.up.railway.app/api/user/login', {email, password})
        .then(result => {
            // Expect result.data to be user object or error
            if(result.data && result.data._id){
                localStorage.setItem("user", JSON.stringify(result.data));
                // Auto-login: redirect immediately
                navigate('/home', { replace: true });
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
        <div className="min-h-screen flex items-center justify-center bg-[#23272A] px-2">
            <div className="w-full max-w-md bg-[#2C2F33] rounded-lg shadow-lg p-4 md:p-8 text-center">
                <h2 className="mb-6 text-2xl md:text-3xl font-extrabold text-[#7289DA]">Login</h2>
                <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
                    <div className="text-left">
                        <label htmlFor="email" className="block text-[#99AAB5] font-semibold mb-2">Email</label>
                        <input
                            type="email"
                            id="email"
                            placeholder="Enter Email"
                            className="w-full px-3 md:px-4 py-2 rounded bg-[#23272A] text-[#99AAB5] border border-[#7289DA] focus:outline-none focus:ring-2 focus:ring-[#7289DA] text-sm md:text-base"
                            onChange={(event) => setEmail(event.target.value)}
                            required
                        />
                    </div>
                    <div className="text-left">
                        <label htmlFor="password" className="block text-[#99AAB5] font-semibold mb-2">Password</label>
                        <input
                            type="password"
                            id="password"
                            placeholder="Enter Password"
                            className="w-full px-3 md:px-4 py-2 rounded bg-[#23272A] text-[#99AAB5] border border-[#7289DA] focus:outline-none focus:ring-2 focus:ring-[#7289DA] text-sm md:text-base"
                            onChange={(event) => setPassword(event.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="w-full py-2 rounded bg-[#7289DA] text-white font-bold hover:bg-[#5865F2] transition text-sm md:text-base">Login</button>
                </form>
                <p className="mt-6 text-[#99AAB5] text-sm md:text-base">Don't have an account?</p>
                <Link to='/register' className="inline-block mt-2 px-4 py-2 rounded bg-[#7289DA] text-white font-bold hover:bg-[#5865F2] transition text-sm md:text-base">Register</Link>
            </div>
        </div>
    )
}

export default Login
