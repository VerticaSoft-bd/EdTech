// components/cv/YourCvs.tsx
'use client';
import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Edit, Trash2, PlusCircle } from 'lucide-react';
import Link from 'next/link';
import { CvListSkeleton } from '../ui/SkeletonLoader';

interface CvSummary { _id: string; fullName: string; titles: string[]; updatedAt: string; }

function YourCvsContent() {
  const [cvs, setCvs] = useState<CvSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [resolvedUserId, setResolvedUserId] = useState<string | null>(null);

  const searchParams = useSearchParams();

  useEffect(() => {
    const checkAndFetchUser = async () => {
      let uid = searchParams.get('userId');
      if (!uid) {
        try {
          const stored = localStorage.getItem('user');
          if (stored) {
            const u = JSON.parse(stored);
            uid = u._id || u.id || null;
          }
        } catch (e) {}
      }
      
      setResolvedUserId(uid);

      if (!uid) {
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const res = await fetch(`/api/v1/cvs/user/${uid}`, {
          headers: { 'x-user-id': uid }
        });
        if (!res.ok) throw new Error('Network response was not ok');
        const data = await res.json();
        setCvs(data.data);
      } catch (error) {
        console.error("Failed to fetch user's CVs:", error);
      } finally {
        setLoading(false);
      }
    };
    checkAndFetchUser();
  }, [searchParams]);

  const handleDelete = async (cvId: string) => {
    if (!resolvedUserId) return;
    if (window.confirm('Are you sure you want to delete this CV?')) {
      try {
        const res = await fetch(`/api/v1/cvs/${cvId}`, {
          method: 'DELETE',
          headers: { 'x-user-id': resolvedUserId }
        });
        if (!res.ok) throw new Error('Network response was not ok');
        setCvs(prev => prev.filter(cv => cv._id !== cvId));
      } catch (error) {
        console.error('Failed to delete CV', error);
        alert('An error occurred while deleting the CV.');
      }
    }
  };

  if (loading) return <CvListSkeleton />;
  if (!resolvedUserId) {
    return <p className="text-center text-red-500 font-semibold mt-10">Please Login to view and create your CVs.</p>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Your Created CVs</h2>
        <Link href={`/cv/create?userId=${resolvedUserId}`} className="bg-[#6C5DD3] hover:bg-[#5b4eb3] text-white px-5 py-2.5 rounded-[12px] shadow-lg shadow-[#6C5DD3]/20 flex items-center gap-2 text-[14px] font-bold cursor-pointer transition-all">
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
                <Link href={`/cv/${cv._id}?userId=${resolvedUserId}`} className="p-2 text-gray-600 hover:bg-gray-100 rounded-full cursor-pointer" title="Edit CV">
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