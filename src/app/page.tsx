'use client'
import { invoke } from '@tauri-apps/api/tauri'
import React, { useEffect, useState, useRef } from 'react';

export default function Home() {

  const divRef = useRef<any>(null);

  const [word, setWord] = useState('');
  const [definitions, setDefinitions] = useState<any>([]);
  const [timer, setTimer] = useState<any>(null);

  const fetchDefinition = async (wordToFetch: any) => {
    try {
      const fetchedDefinitions = await invoke('get_foo', { word: wordToFetch });
      setDefinitions(fetchedDefinitions as any);
    } catch (error) {
      console.error("Error fetching definition:", error);
      setDefinitions([]);
    }
  };

  const getRes = (e: any) => {
    const newWord = e.target.value;
    setWord(newWord);

    // Clear the existing timer if there's one
    if (timer) {
      clearTimeout(timer);
    }

    // Set a new timer
    setTimer(setTimeout(() => {
      if (newWord) {
        fetchDefinition(newWord);
      } else {
        setDefinitions([]);
      }
    }, 3000));  // 3 seconds
  };

  useEffect(() => {
    if (definitions && divRef.current) {
      let divH = divRef.current.offsetHeight;
      let newContentHeight = divH + 100;
      if (typeof window === 'undefined') return

      import('@tauri-apps/api/window').then(({ appWindow, LogicalSize }) => {
        console.log("Hello");
        appWindow.setSize(new LogicalSize(1000, newContentHeight));
      });

    }
  }, [definitions]);

  return (
    <main className='rounded-2xl h-screen overflow-x-hidden overflow-y-scroll'>
      <div className={`${definitions.length > 0 ? 'rounded-t-2xl' : 'rounded-2xl'} bg-zinc-100 box w-full fixed h-14`}>
        <input
          value={word}
          onChange={getRes}
          className={`${definitions.length > 0 ? 'rounded-t-2xl' : 'rounded-2xl'} p-5 w-full text-lg focus:outline-none`}
          type="text"
          placeholder='Search...'
        />
      </div>
      <div data-tauri-drag-region className="absolute bg-orange-300 rounded-full p-4 cursor-move right-5 top-4">
      </div>
      {
        definitions.length > 0 && (
          <div ref={divRef} className="box-2 bg-zinc-100/95 p-10 rounded-b-2xl overflow-x-hidden overflow-y-scroll mt-14">
            <h2 className="text-xl mb-4">Definitions for &apos;{word}&apos;:</h2>
            <ol className='list-decimal m-4'>
              {definitions.map((def: any, index: any) => (
                <div key={index} className="def mb-2">
                  <li>{def.definition}</li>
                </div>
              ))}
            </ol>
          </div>
        )
      }
    </main>
  );
}