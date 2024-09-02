import React, { useState } from 'react';
import { db, storage } from '../firebase/firebaseConfig';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const AddAnnouncement = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [file, setFile] = useState(null);

  const handleAddAnnouncement = async (e) => {
    e.preventDefault();

    let materialURL = '';

    if (file) {
      const fileRef = ref(storage, `announcements/${file.name}`);
      await uploadBytes(fileRef, file);
      materialURL = await getDownloadURL(fileRef);
    }

    try {
      await addDoc(collection(db, 'announcements'), {
        title,
        content,
        materialURL,
        createdAt: serverTimestamp(),
      });
      setTitle('');
      setContent('');
      setFile(null);
    } catch (error) {
      console.error('Error adding announcement:', error);
    }
  };

  return (
    <form onSubmit={handleAddAnnouncement} className="p-4">
      <h2 className="text-2xl mb-4">Add Announcement</h2>
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full mb-4 p-2 border"
      />
      <textarea
        placeholder="Content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="w-full mb-4 p-2 border"
      ></textarea>
      <input
        type="file"
        onChange={(e) => setFile(e.target.files[0])}
        className="mb-4"
      />
      <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded">
        Add Announcement
      </button>
    </form>
  );
};

export default AddAnnouncement;
