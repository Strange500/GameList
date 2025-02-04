"use client"
import { SearchResults } from "@/app/db/interfaces/apiInterfaces";
import React from "react";
import { SmallGameCard } from "./SmallGameCard";
import { Input } from "../ui/input";



export const SearchGameInput = () => {


    const [searchGames, setSearchGames] = React.useState<string>("");
    const [gameGrid, setGameGrid] = React.useState<React.ReactNode>();
    const [debouncedQuery, setDebouncedQuery] = React.useState(searchGames);

    React.useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedQuery(searchGames);
        }, 1000);

        return () => {
            clearTimeout(handler);
        };
    }
    , [searchGames]);

    React.useEffect(() => {
        
        if (debouncedQuery) {
          // Call your research function here with the debouncedQuery
            const response = findGame(debouncedQuery);
            response.then((r: SearchResults) => {
                setGameGrid(genCardPrezList(r));
            });
        }
      }, [debouncedQuery, game.path]);

      return (
        <>
            <Input type="search" placeholder="Search the game" value={searchGames} onChange={(e) => setSearchGames(e.target.value)}/>
            <Input type
        </>
      )
    }