import React from 'react';
import { Input } from './ui/input';
import Form from "next/form";
import { RefreshCcw, Search } from 'lucide-react';
import { detectGames } from '@/app/db/gameDB';
import Link from 'next/link';


// Assuming `Input` is a custom component or can be a simple HTML input
const SearchBar: React.FC = () => {
    return (
        <div className="w-full flex justify-center">
            <Form action="/" className="flex items-center w-3/4 max-w-lg spacing-4">
                <Input
                    type="text"
                    placeholder="Search for games"
                    className="flex-grow p-4 text-lg rounded-l-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    name='query'
                    id='query'
                />
                <button 
                    type="submit"
                    className="bg-blue-500 hover:bg-blue-700 transition duration-300 text-white font-bold py-2 px-4 rounded-full shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50 active:bg-blue-600"
                >
                    <Search size={24} />
                </button>
            </Form>
            <Form action={async () => {
                "use server"
                detectGames();
            }}>
                
                <button 
                    type="submit"
                    className="bg-blue-500 hover:bg-blue-700 transition duration-300 text-white font-bold py-2 px-4 rounded-full shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50 active:bg-blue-600"
                >
                    <RefreshCcw size={24} />
                </button>
            </Form>
        </div>
    );
};

export default SearchBar;