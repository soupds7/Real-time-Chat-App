import React from 'react';

import { useState } from 'react';
import { Link } from "react-router-dom";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Register = () => {
    const [name, setName] = useState();
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const navigate = useNavigate();

    const handleSubmit = (event) => {
        event.preventDefault();
        
        axios.post( 'https://real-time-chat-app-c45p.vercel.app/api/user/register', {name, email, password})
        .then(result => {
            console.log(result);
            if(result.data === "Already registered"){
                alert("E-mail already registered! Please Login to proceed.");
                navigate('/login');
            }
            else{
                alert("Registered successfully! Please Login to proceed.")
                navigate('/login');
            }
            
        })
        .catch(err => console.log(err));
    }


    return (
        <div className="min-h-screen flex items-center justify-center bg-[#23272A]">
            <div className="w-full max-w-md bg-[#2C2F33] rounded-lg shadow-lg p-8 text-center">
                <h2 className="mb-6 text-3xl font-extrabold text-[#7289DA]">Register</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="text-left">
                        <label htmlFor="name" className="block text-[#99AAB5] font-semibold mb-2">Name</label>
                        <input
                            type="text"
                            id="name"
                            placeholder="Enter Name"
                            className="w-full px-4 py-2 rounded bg-[#23272A] text-[#99AAB5] border border-[#7289DA] focus:outline-none focus:ring-2 focus:ring-[#7289DA]"
                            onChange={(event) => setName(event.target.value)}
                            required
                        />
                    </div>
                    <div className="text-left">
                        <label htmlFor="email" className="block text-[#99AAB5] font-semibold mb-2">Email</label>
                        <input
                            type="email"
                            id="email"
                            placeholder="Enter Email"
                            className="w-full px-4 py-2 rounded bg-[#23272A] text-[#99AAB5] border border-[#7289DA] focus:outline-none focus:ring-2 focus:ring-[#7289DA]"
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
                            className="w-full px-4 py-2 rounded bg-[#23272A] text-[#99AAB5] border border-[#7289DA] focus:outline-none focus:ring-2 focus:ring-[#7289DA]"
                            onChange={(event) => setPassword(event.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="w-full py-2 rounded bg-[#7289DA] text-white font-bold hover:bg-[#5865F2] transition">Register</button>
                </form>
                <p className="mt-6 text-[#99AAB5]">Already have an account?</p>
                <Link to='/login' className="inline-block mt-2 px-4 py-2 rounded bg-[#7289DA] text-white font-bold hover:bg-[#5865F2] transition">Login</Link>
            </div>
        </div>
    )
}

export default Register
