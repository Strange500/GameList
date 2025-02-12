import { Input } from './ui/input';
import Form from "next/form";
import {   RefreshCcw, Search } from 'lucide-react';
// import { detectGames} from '@/app/db/gameDB';

import { revalidatePath } from 'next/cache';
import Loader from './Loader';
import { Games } from '@/app/db/models/Games';




// Assuming `Input` is a custom component or can be a simple HTML input
const SearchBar: React.FC = () => {

    const refreshGames = async () => {
        "use server";

        await Games.refreshGamesList();
        revalidatePath('/');
        
    }
    return (
        <div className="w-full flex justify-center">
            <Form action="/" className="flex items-center w-3/4 max-w-lg spacing-4">
                <Input
                    type="text"
                    placeholder="Search for games"
                    className="flex-grow p-4 text-lg rounded-l-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring))] focus:border-transparent"
                    name='query'
                    id='query'
                />
                <button 
                    type="submit"
                    className="bg-[hsl(var(--foreground))] hover:bg-[hsl(var(--background))] transition duration-300  font-bold py-2 px-4 rounded-full shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50 active:bg-blue-600"
                >
                    <Search size={24} />
                </button>
            </Form>

            <Form action={refreshGames}>
                    <button 
                    className="bg-[hsl(var(--foreground))] hover:bg-[hsl(var(--background))] transition duration-300  font-bold py-2 px-4 rounded-full shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50 active:bg-blue-600"
                    type='submit'
                >
                    <RefreshCcw/>
                </button>
                <Loader mainText="Refreshing games" secondaryText="Please wait"/>
                    
            </Form>

        </div>
    );
};

export default SearchBar;