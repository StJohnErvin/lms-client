import React, { useEffect, useState, useContext } from 'react';
import { collection, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';
import { UserContext } from '../context/UserContext';

const AnnouncementPage = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [editMode, setEditMode] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');
  const { user } = useContext(UserContext);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'announcements'));
        const announcementsList = querySnapshot.docs.map(doc => {
          const data = doc.data();
          return { id: doc.id, ...data };
        });

        setAnnouncements(announcementsList);
      } catch (error) {
        console.error('Error fetching announcements:', error);
      }
    };

    fetchAnnouncements();
  }, []);

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, 'announcements', id));
      setAnnouncements(announcements.filter(announcement => announcement.id !== id));
    } catch (error) {
      console.error('Error deleting announcement:', error);
    }
  };

  const handleEdit = async (id) => {
    try {
      await updateDoc(doc(db, 'announcements', id), {
        title: editTitle,
        content: editContent,
      });
      setEditMode(null);
      setAnnouncements(
        announcements.map(announcement =>
          announcement.id === id ? { ...announcement, title: editTitle, content: editContent } : announcement
        )
      );
    } catch (error) {
      console.error('Error editing announcement:', error);
    }
  };

  const renderAttachment = (url) => {
    if (!url) return <p>No attachment</p>;

    const fileExtension = url.split('.').pop().toLowerCase();

    if (['jpg', 'jpeg', 'png', 'gif'].includes(fileExtension)) {
      return <img src={url} alt="Attachment" className="w-full h-auto" />;
    } else if (['pdf'].includes(fileExtension)) {
      return <a href={url} target="_blank" rel="noopener noreferrer">View PDF</a>;
    } else {
      return <a href={url} target="_blank" rel="noopener noreferrer">Download Attachment</a>;
    }
  };

  const isStudent = user?.role === 'student';

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl mb-4">Announcements</h1>
      <ul>
        {announcements.map(announcement => (
          <li key={announcement.id} className="mb-4 p-4 border rounded">
            {editMode === announcement.id ? (
              <>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full mb-2 p-2 border"
                />
                <textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="w-full mb-2 p-2 border"
                ></textarea>
                <button
                  onClick={() => handleEdit(announcement.id)}
                  className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded mr-2"
                >
                  Save
                </button>
                <button
                  onClick={() => setEditMode(null)}
                  className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded"
                >
                  Cancel
                </button>
              </>
            ) : (
              <>
                <h2 className="text-xl">{announcement.title}</h2>
                <p>{announcement.content}</p>
                <div className="mt-2">
                  {renderAttachment(announcement.materialURL)}
                </div>
                {!isStudent && (
                  <div className="mt-2">
                    <button
                      onClick={() => {
                        setEditMode(announcement.id);
                        setEditTitle(announcement.title);
                        setEditContent(announcement.content);
                      }}
                      className="bg-yellow-500 hover:bg-yellow-600 text-white py-2 px-4 rounded mr-2"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(announcement.id)}
                      className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AnnouncementPage;
