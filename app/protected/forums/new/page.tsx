"use client";

import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import Tiptap from '../../../../components/Tiptap';

// Petition Form Component
function PetitionForm() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission here
  };

  return (
    <div className="min-h-screen bg-white text-black px-4">
      <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium mb-1">Title</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
            required
          />
        </div>
        <div>
          <label htmlFor="description" className="block text-sm font-medium mb-1">Description</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md h-44"
            required
          />
        </div>
        <div className="flex justify-center">
          <button
            type="submit"
            className="px-6 w-32 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          >
            Post
          </button>
        </div>
      </form>
    </div>
  );
}

// Poll Creation Form Component
function PollCreationForm() {
  const [question, setQuestion] = useState('');
  const [answers, setAnswers] = useState(['', '']);

  const addAnswer = () => setAnswers([...answers, '']);
  const removeAnswer = (index: number) => {
    if (answers.length > 2) {
      setAnswers(answers.filter((_, i) => i !== index));
    }
  };
  const updateAnswer = (index: number, value: string) => {
    const newAnswers = [...answers];
    newAnswers[index] = value;
    setAnswers(newAnswers);
  };

  return (
    <div className="w-full max-w-lg mx-auto bg-white text-black rounded-lg">
      <div className="mb-6">
        <label htmlFor="question" className="block text-sm font-medium text-gray-700 mb-2">QUESTION</label>
        <input
          id="question"
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="What question do you want to ask?"
          className="w-full p-2 border border-gray-300 rounded-md"
        />
      </div>
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">ANSWERS</label>
        {answers.map((answer, index) => (
          <div key={index} className="flex mb-2">
            <div className="flex-1 flex items-center border border-gray-300 rounded-md overflow-hidden">
              <input
                type="text"
                value={answer}
                onChange={(e) => updateAnswer(index, e.target.value)}
                placeholder="Type your answer"
                className="flex-1 p-2 outline-none"
              />
            </div>
            {answers.length > 2 && (
              <button onClick={() => removeAnswer(index)} className="ml-2 p-2 text-gray-500 hover:text-gray-700">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </button>
            )}
          </div>
        ))}
        <button onClick={addAnswer} className="w-full p-2 mt-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">
          + Add another answer
        </button>
      </div>
      <div className='flex justify-center'>
        <button className="w-32 p-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
            Post
        </button>
      </div>
    </div>
  );
}

// Forum Creation Form Component
function ForumCreationForm() {
  return (
    <>
      <div className="p-4 border-2 bg-white max-w-4xl mx-auto rounded-lg shadow-md">
        <Tiptap />
      </div>
      <div className='flex justify-center'>
        <button className="mt-4 w-32 p-2 bg-blue-500 text-white rounded hover:bg-blue-600">Post</button>
      </div>
    </>
  );
}

// New Post Page Component
export default function NewPostPage() {
  const searchParams = useSearchParams();
  const type = searchParams.get('type');

  return (
    <div className='min-h-screen bg-white py-8'>
      {type === 'forum' && (
        <>
          <h1 className='text-3xl text-center font-bold py-10'>New Forum</h1>
          <ForumCreationForm />
        </>
      )}
      {type === 'poll' && (
        <>
          <h1 className='text-3xl text-center font-bold py-10'>New Poll</h1>
          <PollCreationForm />
        </>
      )}
      {type === 'petition' && (
        <>
          <h1 className='text-3xl text-center font-bold py-10'>New Petition</h1>
          <PetitionForm />
        </>
      )}
    </div>
  );
}
