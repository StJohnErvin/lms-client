import React, { useState } from 'react';
import { db, storage } from '../firebase/firebaseConfig';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { getAuth } from 'firebase/auth';

const AddAnnouncement = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const allowedFileTypes = ['image/jpeg', 'image/png', 'application/pdf'];

  const handleAddAnnouncement = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    setSuccessMessage('');

    if (!title || !content) {
      setError('Please fill in both title and content.');
      setIsSubmitting(false);
      return;
    }

    if (file && !allowedFileTypes.includes(file.type)) {
      setError('Invalid file type. Please upload a JPEG, PNG, or PDF.');
      setIsSubmitting(false);
      return;
    }

    let materialURL = '';

    if (file) {
      const fileRef = ref(storage, `announcements/${file.name}`);
      const uploadTask = uploadBytesResumable(fileRef, file);

      await new Promise((resolve, reject) => {
        uploadTask.on(
          'state_changed',
          (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            setUploadProgress(progress);
          },
          (uploadError) => {
            setError(`File upload failed: ${uploadError.message}`);
            setIsSubmitting(false);
            reject(uploadError);
          },
          async () => {
            try {
              materialURL = await getDownloadURL(uploadTask.snapshot.ref);
              resolve();
            } catch (error) {
              setError(`Failed to get download URL: ${error.message}`);
              setIsSubmitting(false);
              reject(error);
            }
          }
        );
      });
    }

    try {
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) {
        throw new Error('User is not authenticated');
      }

      await addDoc(collection(db, 'announcements'), {
        title,
        content,
        materialURL,
        createdAt: serverTimestamp(),
      });

      setTitle('');
      setContent('');
      setFile(null);
      setUploadProgress(0);
      setSuccessMessage('Announcement added successfully!');
    } catch (error) {
      setError(`Error adding announcement: ${error.message}`);
    }

    setIsSubmitting(false);
  };

  return (
    <form onSubmit={handleAddAnnouncement} className="p-4">
      <h2 className="text-2xl mb-4">Add Announcement</h2>

      {error && <p className="text-red-500 mb-4">{error}</p>}
      {successMessage && <p className="text-green-500 mb-4">{successMessage}</p>}

      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full mb-4 p-2 border"
        disabled={isSubmitting}
      />

      <textarea
        placeholder="Content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="w-full mb-4 p-2 border"
        disabled={isSubmitting}
      ></textarea>

      <input
        type="file"
        onChange={(e) => setFile(e.target.files[0])}
        className="mb-4"
        disabled={isSubmitting}
      />

      {file && (
        <p className="mb-2">File: {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)</p>
      )}

      {uploadProgress > 0 && (
        <p className="mb-4">Upload Progress: {uploadProgress.toFixed(2)}%</p>
      )}

      <button
        type="submit"
        className={`bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded ${isSubmitting && 'opacity-50 cursor-not-allowed'}`}
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Uploading...' : 'Add Announcement'}
      </button>
    </form>
  );
};

export default AddAnnouncement;
