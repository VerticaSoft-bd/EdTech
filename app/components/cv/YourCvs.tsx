// components/cv/YourCvs.tsx
'use client';
import { useEffect, useState, Suspense } from 'react';
import axios from 'axios';
import { useSearchParams } from 'next/navigation';
import { Edit, Trash2, PlusCircle } from 'lucide-react';
import Link from 'next/link';
import { CvListSkeleton } from '../ui/SkeletonLoader';

interface CvSummary { _id: string; fullName: string; titles: string[]; updatedAt: string; }

function YourCvsContent() {
  const [cvs, setCvs] = useState<CvSummary[]>([]);
  const [loading, setLoading] = useState(true);

  const searchParams = useSearchParams();
  const userId = searchParams.get('userId');

  useEffect(() => {
    const fetchCVs = async () => {
      if (!userId) {
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const res = await axios.get(`/api/v1/cvs/user/${userId}`, {
          headers: { 'x-user-id': userId }
        });
        setCvs(res.data.data);
      } catch (error) {
        console.error("Failed to fetch user's CVs:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCVs();
  }, [userId]);

  const handleDelete = async (cvId: string) => {
    if (!userId) return;
    if (window.confirm('Are you sure you want to delete this CV?')) {
      try {
        await axios.delete(`/api/v1/cvs/${cvId}`, {
          headers: { 'x-user-id': userId }
        });
        setCvs(prev => prev.filter(cv => cv._id !== cvId));
      } catch (error) {
        console.error('Failed to delete CV', error);
        alert('An error occurred while deleting the CV.');
      }
    }
  };

  if (loading) return <CvListSkeleton />;
  if (!userId) {
    return <p className="text-center text-red-500 font-semibold">Could not identify user. Please navigate from your dashboard sidebar.</p>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Your Created CVs</h2>
        <Link href={`/cv/create?userId=${userId}`} className="bg-black text-white px-4 py-2 rounded-md flex items-center gap-2 text-sm font-semibold cursor-pointer">
          <PlusCircle size={16} /> Create New
        </Link>
      </div>
      {cvs.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed rounded-lg">
          <p className="text-gray-500">You haven&apos;t created any CVs yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {cvs.map(cv => (
            <div key={cv._id} className="p-4 border rounded-lg flex justify-between items-center bg-white hover:shadow-md transition-shadow">
              <div>
                <h3 className="font-bold text-lg text-gray-800">{cv.fullName || "Untitled CV"}</h3>
                <p className="text-sm text-gray-600">{cv.titles.join(' | ')}</p>
              </div>
              <div className="flex items-center gap-3">
                <Link href={`/cv/${cv._id}?userId=${userId}`} className="p-2 text-gray-600 hover:bg-gray-100 rounded-full cursor-pointer" title="Edit CV">
                  <Edit size={18} />
                </Link>
                <button onClick={() => handleDelete(cv._id)} className="p-2 text-red-600 hover:bg-red-50 rounded-full cursor-pointer" title="Delete CV">
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function YourCvs() {
  return (
    <Suspense fallback={<CvListSkeleton />}>
      <YourCvsContent />
    </Suspense>
  )
}